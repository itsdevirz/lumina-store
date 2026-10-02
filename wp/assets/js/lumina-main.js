/**
 * Lumina WordPress Theme - Main Client Interactivity Engine
 * Handles: Dark Mode, Live Search, Cart Drawer, Wishlist, Infinite Scroll, Filters
 */

(function () {
  'use strict';

  // 1. Theme Configuration & Localized Object
  const luminaData = window.luminaThemeData || {
    ajaxUrl: '/wp-admin/admin-ajax.php',
    nonce: '',
    siteUrl: '/',
    themeUri: '',
    isRtl: true
  };

  // 2. Audio Chime & Tactile Sound Utility
  function playClickSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // 3. Toast Notification System
  function showToast(message, type = 'success') {
    let container = document.getElementById('lumina-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'lumina-toast-container';
      container.className = 'lumina-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'lumina-toast';
    toast.innerHTML = `
      <span style="color: ${type === 'success' ? '#10B981' : '#F43F5E'}; font-size: 14px;">●</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // 4. Dark / Light Mode Toggle
  function initThemeToggle() {
    const toggles = document.querySelectorAll('.lumina-theme-toggle');
    const saved = localStorage.getItem('lumina_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('lumina_theme', isDark ? 'dark' : 'light');
      });
    });
  }

  // 5. Cart Management & Drawer Engine
  const LuminaCart = {
    getItems: function () {
      try {
        return JSON.parse(localStorage.getItem('lumina_cart') || '[]');
      } catch (e) {
        return [];
      }
    },
    saveItems: function (items) {
      localStorage.setItem('lumina_cart', JSON.stringify(items));
      this.updateUI();
    },
    addItem: function (product, qty = 1) {
      playClickSound();
      const items = this.getItems();
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty
        });
      }
      this.saveItems(items);
      showToast(`«${product.name}» به سبد خرید اضافه شد.`);
      this.openDrawer();
    },
    removeItem: function (id) {
      let items = this.getItems();
      items = items.filter(i => i.id !== id);
      this.saveItems(items);
    },
    updateQuantity: function (id, delta) {
      const items = this.getItems();
      const item = items.find(i => i.id === id);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          this.removeItem(id);
          return;
        }
      }
      this.saveItems(items);
    },
    updateUI: function () {
      const items = this.getItems();
      const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      // Update counters in header
      document.querySelectorAll('.cart-badge-counter').forEach(el => {
        el.textContent = totalCount.toLocaleString('fa-IR');
        el.style.display = totalCount > 0 ? 'flex' : 'none';
      });

      // Update Drawer Items
      const container = document.getElementById('drawer-items-list');
      const subtotalEl = document.getElementById('drawer-subtotal-price');

      if (subtotalEl) {
        subtotalEl.textContent = (subtotal / 10).toLocaleString('fa-IR') + ' تومان';
      }

      if (container) {
        if (items.length === 0) {
          container.innerHTML = `
            <div style="text-align: center; padding: 40px 10px; color: #94A3B8;">
              <p style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">سبد خرید شما خالی است</p>
              <p style="font-size: 11px;">محصولات دلخواه خود را به سبد خرید اضافه کنید.</p>
            </div>
          `;
        } else {
          container.innerHTML = items.map(item => `
            <div class="drawer-item" data-id="${item.id}">
              <img src="${item.image}" alt="${item.name}" class="drawer-item-img">
              <div class="drawer-item-info">
                <h5 class="drawer-item-title">${item.name}</h5>
                <span class="drawer-item-price">${(item.price / 10).toLocaleString('fa-IR')} تومان</span>
                <div class="qty-control">
                  <button type="button" class="qty-btn" onclick="window.LuminaCart.updateQuantity('${item.id}', 1)">+</button>
                  <span style="font-size: 11px; font-weight: 700; font-family: var(--font-mono);">${item.quantity.toLocaleString('fa-IR')}</span>
                  <button type="button" class="qty-btn" onclick="window.LuminaCart.updateQuantity('${item.id}', -1)">-</button>
                  <button type="button" style="margin-right: auto; color: #F43F5E; font-size: 11px; font-weight: 700;" onclick="window.LuminaCart.removeItem('${item.id}')">حذف</button>
                </div>
              </div>
            </div>
          `).join('');
        }
      }
    },
    openDrawer: function () {
      const drawer = document.getElementById('lumina-cart-drawer');
      const backdrop = document.getElementById('lumina-drawer-backdrop');
      if (drawer && backdrop) {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },
    closeDrawer: function () {
      const drawer = document.getElementById('lumina-cart-drawer');
      const backdrop = document.getElementById('lumina-drawer-backdrop');
      if (drawer && backdrop) {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };
  window.LuminaCart = LuminaCart;

  // 6. Wishlist System
  const LuminaWishlist = {
    getItems: function () {
      try {
        return JSON.parse(localStorage.getItem('lumina_wishlist') || '[]');
      } catch (e) {
        return [];
      }
    },
    toggle: function (productId) {
      playClickSound();
      let items = this.getItems();
      const index = items.indexOf(productId);
      const isAdded = index === -1;
      if (isAdded) {
        items.push(productId);
        showToast('محصول به علاقه‌مندی‌ها اضافه شد.');
      } else {
        items.splice(index, 1);
        showToast('از علاقه‌مندی‌ها حذف شد.', 'info');
      }
      localStorage.setItem('lumina_wishlist', JSON.stringify(items));
      this.updateUI();
      return isAdded;
    },
    has: function (productId) {
      return this.getItems().includes(productId);
    },
    updateUI: function () {
      const items = this.getItems();
      document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-product-id');
        if (id && items.includes(id)) {
          btn.classList.add('active');
          btn.style.color = '#F43F5E';
        } else {
          btn.classList.remove('active');
          btn.style.color = '';
        }
      });
      document.querySelectorAll('.wishlist-badge-counter').forEach(el => {
        el.textContent = items.length.toLocaleString('fa-IR');
        el.style.display = items.length > 0 ? 'flex' : 'none';
      });
    }
  };
  window.LuminaWishlist = LuminaWishlist;

  // 7. Live Instant Search with Dropdown
  function initLiveSearch() {
    const input = document.getElementById('lumina-main-search');
    const dropdown = document.getElementById('lumina-search-results');
    const clearBtn = document.getElementById('lumina-search-clear');
    if (!input || !dropdown) return;

    let debounceTimer;

    input.addEventListener('input', () => {
      const query = input.value.trim();
      if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

      clearTimeout(debounceTimer);
      if (query.length < 2) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch(`${luminaData.ajaxUrl}?action=lumina_search&q=${encodeURIComponent(query)}&nonce=${luminaData.nonce}`)
          .then(r => r.json())
          .then(res => {
            if (res.success && res.data && res.data.length > 0) {
              dropdown.innerHTML = res.data.map(item => `
                <a href="${item.url}" class="search-result-item">
                  <img src="${item.image}" alt="${item.title}" class="search-result-img">
                  <div style="flex: 1;">
                    <h6 style="font-size: 12px; font-weight: 700; margin-bottom: 2px;">${item.title}</h6>
                    <span style="font-size: 11px; font-weight: 800; color: #10B981; font-family: var(--font-mono);">${(item.price / 10).toLocaleString('fa-IR')} تومان</span>
                  </div>
                </a>
              `).join('');
              dropdown.classList.add('active');
            } else {
              dropdown.innerHTML = `<div style="padding: 14px; text-align: center; font-size: 12px; color: #94A3B8;">محصولی با این مشخصات یافت نشد</div>`;
              dropdown.classList.add('active');
            }
          })
          .catch(() => {});
      }, 250);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        dropdown.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }

  // 8. Infinite Scroll Product Loader Engine
  function initInfiniteScroll() {
    const sentinel = document.getElementById('lumina-infinite-sentinel');
    const container = document.getElementById('lumina-products-catalog-grid');
    const loaderPill = document.getElementById('lumina-loading-indicator');
    const endNotice = document.getElementById('lumina-end-notice');

    if (!sentinel || !container) return;

    let page = 1;
    let isLoading = false;
    let hasMore = true;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isLoading && hasMore) {
        isLoading = true;
        if (loaderPill) loaderPill.style.display = 'inline-flex';

        page++;
        const activeCategory = container.getAttribute('data-category') || 'all';

        fetch(`${luminaData.ajaxUrl}?action=lumina_load_more&page=${page}&category=${encodeURIComponent(activeCategory)}&nonce=${luminaData.nonce}`)
          .then(r => r.json())
          .then(res => {
            setTimeout(() => {
              if (res.success && res.data && res.data.html) {
                container.insertAdjacentHTML('beforeend', res.data.html);
                hasMore = res.data.hasMore;
              } else {
                hasMore = false;
              }

              if (loaderPill) loaderPill.style.display = 'none';
              if (!hasMore && endNotice) endNotice.style.display = 'flex';
              isLoading = false;
              LuminaWishlist.updateUI();
            }, 600); // Smooth realistic delay
          })
          .catch(() => {
            if (loaderPill) loaderPill.style.display = 'none';
            isLoading = false;
          });
      }
    }, { rootMargin: '180px' });

    observer.observe(sentinel);
  }

  // 9. Attach DOM Events on Ready
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLiveSearch();
    initInfiniteScroll();
    LuminaCart.updateUI();
    LuminaWishlist.updateUI();

    // Cart Drawer Triggers
    document.querySelectorAll('.lumina-cart-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        playClickSound();
        LuminaCart.openDrawer();
      });
    });

    const closeBtn = document.getElementById('lumina-drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', () => LuminaCart.closeDrawer());

    const backdrop = document.getElementById('lumina-drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => LuminaCart.closeDrawer());

    // Wishlist Toggle Buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.card-wishlist-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-product-id');
        if (id) LuminaWishlist.toggle(id);
      }
    });

    // Add to cart buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-card-add-btn, .btn-hero-primary');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('[data-product-id]') || document.querySelector('[data-featured-hero]');
        if (card) {
          const product = {
            id: card.getAttribute('data-product-id') || 'lum-01',
            name: card.getAttribute('data-product-name') || 'محصول لومینا',
            price: parseInt(card.getAttribute('data-product-price') || '14800000', 10),
            image: card.getAttribute('data-product-image') || '/wp-content/themes/lumina/assets/images/products/photo-1505740420928-5e560c06d30e.jpg'
          };
          LuminaCart.addItem(product, 1);
        }
      }
    });
  });

})();
