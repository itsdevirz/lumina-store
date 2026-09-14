export interface FestivalThemeStyles {
  // Banner & Hero Container Gradient
  cardGradient: string;
  cardBorder: string;
  glowTop: string;
  glowBottom: string;

  // Typography
  titleText: string;
  sloganText: string;
  descriptionText: string;

  // Badges & Pills
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  badgeIcon: string;

  discountPillBg: string;
  discountPillText: string;
  discountPillBorder: string;

  couponPillBg: string;
  couponPillText: string;
  couponPillBorder: string;
  couponPillHover: string;

  // Countdown Clock Box
  clockBoxBg: string;
  clockBoxBorder: string;
  clockBoxTitle: string;
  clockBoxIcon: string;

  clockNumberBg: string;
  clockNumberText: string;
  clockNumberBorder: string;
  clockNumberLabel: string;

  clockSecondsBg: string;
  clockSecondsText: string;
  clockSecondsBorder: string;

  // CTA Button
  ctaButton: string;

  // Product Chips Bar
  productChipBg: string;
  productChipBorder: string;
  productChipTitle: string;
  productChipPrice: string;
  productChipOriginalPrice: string;
}

export function getFestivalTheme(color?: string): FestivalThemeStyles {
  switch (color) {
    case 'indigo':
      return {
        cardGradient: 'from-indigo-500/15 via-violet-500/10 to-indigo-50/90 dark:from-indigo-950/90 dark:via-slate-900/95 dark:to-slate-950 shadow-xl shadow-indigo-100/50 dark:shadow-2xl',
        cardBorder: 'border-indigo-200/90 dark:border-indigo-500/30',
        glowTop: 'bg-indigo-500/20 dark:bg-indigo-500/20',
        glowBottom: 'bg-violet-500/15 dark:bg-violet-500/15',

        titleText: 'text-indigo-950 dark:text-white',
        sloganText: 'text-indigo-800/90 dark:text-indigo-200/90',
        descriptionText: 'text-slate-700 dark:text-slate-300',

        badgeBg: 'bg-indigo-100 dark:bg-indigo-500/20',
        badgeText: 'text-indigo-800 dark:text-indigo-300',
        badgeBorder: 'border-indigo-200 dark:border-indigo-500/40',
        badgeIcon: 'text-indigo-600 dark:text-indigo-400',

        discountPillBg: 'bg-slate-900/10 dark:bg-white/10',
        discountPillText: 'text-slate-900 dark:text-white',
        discountPillBorder: 'border-slate-900/15 dark:border-white/20',

        couponPillBg: 'bg-white/90 dark:bg-white/10',
        couponPillText: 'text-indigo-950 dark:text-white',
        couponPillBorder: 'border-indigo-200 dark:border-white/20',
        couponPillHover: 'hover:bg-indigo-100/80 dark:hover:bg-white/20',

        clockBoxBg: 'bg-white/80 dark:bg-black/50 backdrop-blur-md',
        clockBoxBorder: 'border-indigo-200/80 dark:border-white/15',
        clockBoxTitle: 'text-slate-700 dark:text-slate-300',
        clockBoxIcon: 'text-indigo-600 dark:text-indigo-400',

        clockNumberBg: 'bg-indigo-100/90 dark:bg-white/10',
        clockNumberText: 'text-indigo-950 dark:text-white',
        clockNumberBorder: 'border-indigo-200 dark:border-white/10',
        clockNumberLabel: 'text-slate-600 dark:text-slate-400',

        clockSecondsBg: 'bg-indigo-500/20 dark:bg-indigo-500/30',
        clockSecondsText: 'text-indigo-800 dark:text-indigo-300',
        clockSecondsBorder: 'border-indigo-300 dark:border-indigo-500/50',

        ctaButton: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 dark:shadow-indigo-950/40',

        productChipBg: 'bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10',
        productChipBorder: 'border-indigo-200/70 dark:border-white/10',
        productChipTitle: 'text-slate-900 dark:text-white',
        productChipPrice: 'text-indigo-600 dark:text-indigo-400',
        productChipOriginalPrice: 'text-slate-400 dark:text-slate-400'
      };

    case 'emerald':
      return {
        cardGradient: 'from-emerald-500/15 via-teal-500/10 to-emerald-50/90 dark:from-emerald-950/90 dark:via-slate-900/95 dark:to-slate-950 shadow-xl shadow-emerald-100/50 dark:shadow-2xl',
        cardBorder: 'border-emerald-200/90 dark:border-emerald-500/30',
        glowTop: 'bg-emerald-500/20 dark:bg-emerald-500/20',
        glowBottom: 'bg-teal-500/15 dark:bg-teal-500/15',

        titleText: 'text-emerald-950 dark:text-white',
        sloganText: 'text-emerald-800/90 dark:text-emerald-200/90',
        descriptionText: 'text-slate-700 dark:text-slate-300',

        badgeBg: 'bg-emerald-100 dark:bg-emerald-500/20',
        badgeText: 'text-emerald-800 dark:text-emerald-300',
        badgeBorder: 'border-emerald-200 dark:border-emerald-500/40',
        badgeIcon: 'text-emerald-600 dark:text-emerald-400',

        discountPillBg: 'bg-slate-900/10 dark:bg-white/10',
        discountPillText: 'text-slate-900 dark:text-white',
        discountPillBorder: 'border-slate-900/15 dark:border-white/20',

        couponPillBg: 'bg-white/90 dark:bg-white/10',
        couponPillText: 'text-emerald-950 dark:text-white',
        couponPillBorder: 'border-emerald-200 dark:border-white/20',
        couponPillHover: 'hover:bg-emerald-100/80 dark:hover:bg-white/20',

        clockBoxBg: 'bg-white/80 dark:bg-black/50 backdrop-blur-md',
        clockBoxBorder: 'border-emerald-200/80 dark:border-white/15',
        clockBoxTitle: 'text-slate-700 dark:text-slate-300',
        clockBoxIcon: 'text-emerald-600 dark:text-emerald-400',

        clockNumberBg: 'bg-emerald-100/90 dark:bg-white/10',
        clockNumberText: 'text-emerald-950 dark:text-white',
        clockNumberBorder: 'border-emerald-200 dark:border-white/10',
        clockNumberLabel: 'text-slate-600 dark:text-slate-400',

        clockSecondsBg: 'bg-emerald-500/20 dark:bg-emerald-500/30',
        clockSecondsText: 'text-emerald-800 dark:text-emerald-300',
        clockSecondsBorder: 'border-emerald-300 dark:border-emerald-500/50',

        ctaButton: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 dark:shadow-emerald-950/40',

        productChipBg: 'bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10',
        productChipBorder: 'border-emerald-200/70 dark:border-white/10',
        productChipTitle: 'text-slate-900 dark:text-white',
        productChipPrice: 'text-emerald-600 dark:text-emerald-400',
        productChipOriginalPrice: 'text-slate-400 dark:text-slate-400'
      };

    case 'amber':
      return {
        cardGradient: 'from-amber-500/15 via-orange-500/10 to-amber-50/90 dark:from-amber-950/90 dark:via-slate-900/95 dark:to-slate-950 shadow-xl shadow-amber-100/50 dark:shadow-2xl',
        cardBorder: 'border-amber-200/90 dark:border-amber-500/30',
        glowTop: 'bg-amber-500/20 dark:bg-amber-500/20',
        glowBottom: 'bg-orange-500/15 dark:bg-orange-500/15',

        titleText: 'text-amber-950 dark:text-white',
        sloganText: 'text-amber-800/90 dark:text-amber-200/90',
        descriptionText: 'text-slate-700 dark:text-slate-300',

        badgeBg: 'bg-amber-100 dark:bg-amber-500/20',
        badgeText: 'text-amber-800 dark:text-amber-300',
        badgeBorder: 'border-amber-200 dark:border-amber-500/40',
        badgeIcon: 'text-amber-600 dark:text-amber-400',

        discountPillBg: 'bg-slate-900/10 dark:bg-white/10',
        discountPillText: 'text-slate-900 dark:text-white',
        discountPillBorder: 'border-slate-900/15 dark:border-white/20',

        couponPillBg: 'bg-white/90 dark:bg-white/10',
        couponPillText: 'text-amber-950 dark:text-white',
        couponPillBorder: 'border-amber-200 dark:border-white/20',
        couponPillHover: 'hover:bg-amber-100/80 dark:hover:bg-white/20',

        clockBoxBg: 'bg-white/80 dark:bg-black/50 backdrop-blur-md',
        clockBoxBorder: 'border-amber-200/80 dark:border-white/15',
        clockBoxTitle: 'text-slate-700 dark:text-slate-300',
        clockBoxIcon: 'text-amber-600 dark:text-amber-400',

        clockNumberBg: 'bg-amber-100/90 dark:bg-white/10',
        clockNumberText: 'text-amber-950 dark:text-white',
        clockNumberBorder: 'border-amber-200 dark:border-white/10',
        clockNumberLabel: 'text-slate-600 dark:text-slate-400',

        clockSecondsBg: 'bg-amber-500/20 dark:bg-amber-500/30',
        clockSecondsText: 'text-amber-800 dark:text-amber-300',
        clockSecondsBorder: 'border-amber-300 dark:border-amber-500/50',

        ctaButton: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-600/25 dark:shadow-amber-950/40',

        productChipBg: 'bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10',
        productChipBorder: 'border-amber-200/70 dark:border-white/10',
        productChipTitle: 'text-slate-900 dark:text-white',
        productChipPrice: 'text-amber-600 dark:text-amber-400',
        productChipOriginalPrice: 'text-slate-400 dark:text-slate-400'
      };

    case 'purple':
      return {
        cardGradient: 'from-purple-500/15 via-fuchsia-500/10 to-purple-50/90 dark:from-purple-950/90 dark:via-slate-900/95 dark:to-slate-950 shadow-xl shadow-purple-100/50 dark:shadow-2xl',
        cardBorder: 'border-purple-200/90 dark:border-purple-500/30',
        glowTop: 'bg-purple-500/20 dark:bg-purple-500/20',
        glowBottom: 'bg-fuchsia-500/15 dark:bg-fuchsia-500/15',

        titleText: 'text-purple-950 dark:text-white',
        sloganText: 'text-purple-800/90 dark:text-purple-200/90',
        descriptionText: 'text-slate-700 dark:text-slate-300',

        badgeBg: 'bg-purple-100 dark:bg-purple-500/20',
        badgeText: 'text-purple-800 dark:text-purple-300',
        badgeBorder: 'border-purple-200 dark:border-purple-500/40',
        badgeIcon: 'text-purple-600 dark:text-purple-400',

        discountPillBg: 'bg-slate-900/10 dark:bg-white/10',
        discountPillText: 'text-slate-900 dark:text-white',
        discountPillBorder: 'border-slate-900/15 dark:border-white/20',

        couponPillBg: 'bg-white/90 dark:bg-white/10',
        couponPillText: 'text-purple-950 dark:text-white',
        couponPillBorder: 'border-purple-200 dark:border-white/20',
        couponPillHover: 'hover:bg-purple-100/80 dark:hover:bg-white/20',

        clockBoxBg: 'bg-white/80 dark:bg-black/50 backdrop-blur-md',
        clockBoxBorder: 'border-purple-200/80 dark:border-white/15',
        clockBoxTitle: 'text-slate-700 dark:text-slate-300',
        clockBoxIcon: 'text-purple-600 dark:text-purple-400',

        clockNumberBg: 'bg-purple-100/90 dark:bg-white/10',
        clockNumberText: 'text-purple-950 dark:text-white',
        clockNumberBorder: 'border-purple-200 dark:border-white/10',
        clockNumberLabel: 'text-slate-600 dark:text-slate-400',

        clockSecondsBg: 'bg-purple-500/20 dark:bg-purple-500/30',
        clockSecondsText: 'text-purple-800 dark:text-purple-300',
        clockSecondsBorder: 'border-purple-300 dark:border-purple-500/50',

        ctaButton: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-600/25 dark:shadow-purple-950/40',

        productChipBg: 'bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10',
        productChipBorder: 'border-purple-200/70 dark:border-white/10',
        productChipTitle: 'text-slate-900 dark:text-white',
        productChipPrice: 'text-purple-600 dark:text-purple-400',
        productChipOriginalPrice: 'text-slate-400 dark:text-slate-400'
      };

    case 'cyan':
      return {
        cardGradient: 'from-cyan-500/15 via-blue-500/10 to-cyan-50/90 dark:from-cyan-950/90 dark:via-slate-900/95 dark:to-slate-950 shadow-xl shadow-cyan-100/50 dark:shadow-2xl',
        cardBorder: 'border-cyan-200/90 dark:border-cyan-500/30',
        glowTop: 'bg-cyan-500/20 dark:bg-cyan-500/20',
        glowBottom: 'bg-blue-500/15 dark:bg-blue-500/15',

        titleText: 'text-cyan-950 dark:text-white',
        sloganText: 'text-cyan-800/90 dark:text-cyan-200/90',
        descriptionText: 'text-slate-700 dark:text-slate-300',

        badgeBg: 'bg-cyan-100 dark:bg-cyan-500/20',
        badgeText: 'text-cyan-800 dark:text-cyan-300',
        badgeBorder: 'border-cyan-200 dark:border-cyan-500/40',
        badgeIcon: 'text-cyan-600 dark:text-cyan-400',

        discountPillBg: 'bg-slate-900/10 dark:bg-white/10',
        discountPillText: 'text-slate-900 dark:text-white',
        discountPillBorder: 'border-slate-900/15 dark:border-white/20',

        couponPillBg: 'bg-white/90 dark:bg-white/10',
        couponPillText: 'text-cyan-950 dark:text-white',
        couponPillBorder: 'border-cyan-200 dark:border-white/20',
        couponPillHover: 'hover:bg-cyan-100/80 dark:hover:bg-white/20',

        clockBoxBg: 'bg-white/80 dark:bg-black/50 backdrop-blur-md',
        clockBoxBorder: 'border-cyan-200/80 dark:border-white/15',
        clockBoxTitle: 'text-slate-700 dark:text-slate-300',
        clockBoxIcon: 'text-cyan-600 dark:text-cyan-400',

        clockNumberBg: 'bg-cyan-100/90 dark:bg-white/10',
        clockNumberText: 'text-cyan-950 dark:text-white',
        clockNumberBorder: 'border-cyan-200 dark:border-white/10',
        clockNumberLabel: 'text-slate-600 dark:text-slate-400',

        clockSecondsBg: 'bg-cyan-500/20 dark:bg-cyan-500/30',
        clockSecondsText: 'text-cyan-800 dark:text-cyan-300',
        clockSecondsBorder: 'border-cyan-300 dark:border-cyan-500/50',

        ctaButton: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 dark:shadow-cyan-950/40',

        productChipBg: 'bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10',
        productChipBorder: 'border-cyan-200/70 dark:border-white/10',
        productChipTitle: 'text-slate-900 dark:text-white',
        productChipPrice: 'text-cyan-600 dark:text-cyan-400',
        productChipOriginalPrice: 'text-slate-400 dark:text-slate-400'
      };

    case 'rose':
    default:
      return {
        cardGradient: 'from-rose-500/15 via-pink-500/10 to-rose-50/90 dark:from-rose-950/90 dark:via-slate-900/95 dark:to-slate-950 shadow-xl shadow-rose-100/50 dark:shadow-2xl',
        cardBorder: 'border-rose-200/90 dark:border-rose-500/30',
        glowTop: 'bg-rose-500/20 dark:bg-rose-500/20',
        glowBottom: 'bg-pink-500/15 dark:bg-pink-500/15',

        titleText: 'text-rose-950 dark:text-white',
        sloganText: 'text-rose-800/90 dark:text-rose-200/90',
        descriptionText: 'text-slate-700 dark:text-slate-300',

        badgeBg: 'bg-rose-100 dark:bg-rose-500/20',
        badgeText: 'text-rose-800 dark:text-rose-300',
        badgeBorder: 'border-rose-200 dark:border-rose-500/40',
        badgeIcon: 'text-rose-600 dark:text-rose-400',

        discountPillBg: 'bg-slate-900/10 dark:bg-white/10',
        discountPillText: 'text-slate-900 dark:text-white',
        discountPillBorder: 'border-slate-900/15 dark:border-white/20',

        couponPillBg: 'bg-white/90 dark:bg-white/10',
        couponPillText: 'text-rose-950 dark:text-white',
        couponPillBorder: 'border-rose-200 dark:border-white/20',
        couponPillHover: 'hover:bg-rose-100/80 dark:hover:bg-white/20',

        clockBoxBg: 'bg-white/80 dark:bg-black/50 backdrop-blur-md',
        clockBoxBorder: 'border-rose-200/80 dark:border-white/15',
        clockBoxTitle: 'text-slate-700 dark:text-slate-300',
        clockBoxIcon: 'text-rose-600 dark:text-rose-400',

        clockNumberBg: 'bg-rose-100/90 dark:bg-white/10',
        clockNumberText: 'text-rose-950 dark:text-white',
        clockNumberBorder: 'border-rose-200 dark:border-white/10',
        clockNumberLabel: 'text-slate-600 dark:text-slate-400',

        clockSecondsBg: 'bg-rose-500/20 dark:bg-rose-500/30',
        clockSecondsText: 'text-rose-800 dark:text-rose-300',
        clockSecondsBorder: 'border-rose-300 dark:border-rose-500/50',

        ctaButton: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-600/25 dark:shadow-rose-950/40',

        productChipBg: 'bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10',
        productChipBorder: 'border-rose-200/70 dark:border-white/10',
        productChipTitle: 'text-slate-900 dark:text-white',
        productChipPrice: 'text-rose-600 dark:text-rose-400',
        productChipOriginalPrice: 'text-slate-400 dark:text-slate-400'
      };
  }
}
