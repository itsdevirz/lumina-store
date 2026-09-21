-- ==========================================================
-- Online Shop Database Schema & Initial Data Export
-- Database: online_shop_db
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. Table structure for `categories`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `nameFa` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(100) DEFAULT 'Folder',
  `image` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `parentId` VARCHAR(100) DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  `sortOrder` INT DEFAULT 0,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  `updatedAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_categories_parent` (`parentId`),
  KEY `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. Table structure for `products`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `nameFa` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `price` BIGINT NOT NULL,
  `originalPrice` BIGINT DEFAULT NULL,
  `discount` INT DEFAULT 0,
  `rating` DECIMAL(3,1) DEFAULT 5.0,
  `reviewsCount` INT DEFAULT 0,
  `soldCount` INT DEFAULT 0,
  `stock` INT DEFAULT 0,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `descriptionFa` TEXT DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `primaryImage` VARCHAR(500) DEFAULT NULL,
  `specs` JSON DEFAULT NULL,
  `features` JSON DEFAULT NULL,
  `featuresFa` JSON DEFAULT NULL,
  `colors` JSON DEFAULT NULL,
  `variants` JSON DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `isNew` TINYINT(1) DEFAULT 0,
  `isFeatured` TINYINT(1) DEFAULT 0,
  `isBestseller` TINYINT(1) DEFAULT 0,
  `isActive` TINYINT(1) DEFAULT 1,
  `sku` VARCHAR(100) DEFAULT NULL,
  `views` INT DEFAULT 0,
  `cartAdds` INT DEFAULT 0,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  `updatedAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category`),
  KEY `idx_products_price` (`price`),
  KEY `idx_products_active` (`isActive`),
  KEY `idx_products_sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. Table structure for `users`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `role` VARCHAR(50) DEFAULT 'regular',
  `joinedDate` VARCHAR(50) DEFAULT NULL,
  `ordersCount` INT DEFAULT 0,
  `totalSpent` BIGINT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'active',
  `lastActive` VARCHAR(100) DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. Table structure for `orders`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `timestamp` BIGINT NOT NULL,
  `customer` JSON NOT NULL,
  `items` JSON NOT NULL,
  `subtotal` BIGINT NOT NULL,
  `discount` BIGINT DEFAULT 0,
  `shipping` BIGINT DEFAULT 0,
  `total` BIGINT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `statusFa` VARCHAR(100) NOT NULL,
  `paymentMethod` VARCHAR(100) DEFAULT NULL,
  `trackingNumber` VARCHAR(100) DEFAULT NULL,
  `courierName` VARCHAR(100) DEFAULT NULL,
  `estimatedDelivery` VARCHAR(100) DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. Table structure for `coupons`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` VARCHAR(100) NOT NULL,
  `code` VARCHAR(100) NOT NULL,
  `discountPercent` INT DEFAULT 0,
  `maxDiscount` BIGINT DEFAULT 0,
  `minPurchase` BIGINT DEFAULT 0,
  `expiresAt` VARCHAR(50) DEFAULT NULL,
  `usageCount` INT DEFAULT 0,
  `maxUsage` INT DEFAULT 100,
  `isActive` TINYINT(1) DEFAULT 1,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_coupons_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. Table structure for `festivals`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `festivals`;
CREATE TABLE `festivals` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `titleEn` VARCHAR(255) DEFAULT NULL,
  `slogan` TEXT DEFAULT NULL,
  `sloganEn` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `startDate` VARCHAR(50) DEFAULT NULL,
  `endDate` VARCHAR(50) DEFAULT NULL,
  `startTimestamp` BIGINT DEFAULT NULL,
  `endTimestamp` BIGINT DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  `priority` INT DEFAULT 0,
  `themeColor` VARCHAR(50) DEFAULT 'rose',
  `badgeText` VARCHAR(100) DEFAULT NULL,
  `discountPercent` INT DEFAULT 0,
  `couponCode` VARCHAR(100) DEFAULT NULL,
  `bannerImage` VARCHAR(500) DEFAULT NULL,
  `products` JSON DEFAULT NULL,
  `coupons` JSON DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  `updatedAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_festivals_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. Table structure for `reviews`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` VARCHAR(100) NOT NULL,
  `productId` VARCHAR(100) NOT NULL,
  `productNameFa` VARCHAR(255) DEFAULT NULL,
  `userId` VARCHAR(100) DEFAULT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `userAvatar` VARCHAR(500) DEFAULT NULL,
  `userEmail` VARCHAR(255) DEFAULT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'approved',
  `isVerifiedPurchase` TINYINT(1) DEFAULT 0,
  `adminReply` TEXT DEFAULT NULL,
  `adminReplyBy` VARCHAR(100) DEFAULT NULL,
  `adminReplyAt` VARCHAR(50) DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  `timestamp` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_product` (`productId`),
  KEY `idx_reviews_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. Table structure for `admin_notifications`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `admin_notifications`;
CREATE TABLE `admin_notifications` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `time` VARCHAR(50) DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT 'order',
  `isRead` TINYINT(1) DEFAULT 0,
  `linkTab` VARCHAR(100) DEFAULT NULL,
  `createdAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 9. Table structure for `site_analytics`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `site_analytics`;
CREATE TABLE `site_analytics` (
  `key_name` VARCHAR(100) NOT NULL,
  `value_num` BIGINT DEFAULT 0,
  `value_json` JSON DEFAULT NULL,
  `updatedAt` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 10. Table structure for `product_events`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `product_events`;
CREATE TABLE `product_events` (
  `id` VARCHAR(100) NOT NULL,
  `productId` VARCHAR(100) NOT NULL,
  `eventType` VARCHAR(50) NOT NULL,
  `timestamp` BIGINT NOT NULL,
  `userId` VARCHAR(100) DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_events_pid` (`productId`),
  KEY `idx_product_events_type` (`eventType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 11. Table structure for `product_favorites`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `product_favorites`;
CREATE TABLE `product_favorites` (
  `id` VARCHAR(100) NOT NULL,
  `productId` VARCHAR(100) NOT NULL,
  `userId` VARCHAR(100) DEFAULT NULL,
  `sessionId` VARCHAR(100) DEFAULT NULL,
  `timestamp` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_fav_prod` (`productId`),
  KEY `idx_fav_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 12. Table structure for `support_sessions`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `support_sessions`;
CREATE TABLE `support_sessions` (
  `id` VARCHAR(100) NOT NULL,
  `userName` VARCHAR(255) DEFAULT NULL,
  `userEmail` VARCHAR(255) DEFAULT NULL,
  `userPhone` VARCHAR(50) DEFAULT NULL,
  `createdAt` BIGINT NOT NULL,
  `updatedAt` BIGINT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'waiting_human',
  `unreadByAdminCount` INT DEFAULT 0,
  `unreadByUserCount` INT DEFAULT 0,
  `lastMessage` TEXT DEFAULT NULL,
  `messages` JSON DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA INSERTION
-- ==========================================================

-- Categories Seed
INSERT INTO `categories` (`id`, `name`, `nameFa`, `slug`, `icon`, `image`, `description`, `parentId`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
('apparel', 'Apparel & Fashion', 'پوشاک و مد', 'apparel', 'Shirt', '/images/products/photo-1521572267360-ee0c2909d518.jpg', 'کالکشن لباس‌های مینیمال، راحت و باکیفیت طراحی لومینا', NULL, 1, 1, '2026-01-10T10:00:00.000Z', '2026-01-10T10:00:00.000Z'),
('apparel-men', 'Men''s Clothing', 'پوشاک مردانه', 'apparel-men', 'Shirt', '/images/products/photo-1617137984095-74e4e5e3613f.jpg', 'انواع تیشرت، پیراهن، شلوار و هودی‌های مدرن آقایان', 'apparel', 1, 1, '2026-01-10T10:05:00.000Z', '2026-01-10T10:05:00.000Z'),
('apparel-men-tshirt', 'Men''s T-Shirts', 'تیشرت و پولوشرت مردانه', 'apparel-men-tshirt', 'Shirt', '/images/products/photo-1521572267360-ee0c2909d518.jpg', 'تیشرت‌های کتان نخ پنبه سوپر ارگانیک با دوخت پریمیوم', 'apparel-men', 1, 1, '2026-01-10T10:10:00.000Z', '2026-01-10T10:10:00.000Z'),
('apparel-men-pants', 'Men''s Pants', 'شلوار و اسلش مردانه', 'apparel-men-pants', 'Shirt', '/images/products/photo-1624378439575-d8705ad7ae80.jpg', 'شلوارهای کژوال و اسلش‌های راحت با متریال باکیفیت', 'apparel-men', 1, 2, '2026-01-10T10:15:00.000Z', '2026-01-10T10:15:00.000Z'),
('apparel-men-hoodie', 'Men''s Hoodies', 'هودی و دورس مردانه', 'apparel-men-hoodie', 'Shirt', '/images/products/photo-1556905055-8f358a7a47b2.jpg', 'هودی‌های گرم سه‌نخ توکرکی با طراحی مینیمال', 'apparel-men', 1, 3, '2026-01-10T10:20:00.000Z', '2026-01-10T10:20:00.000Z'),
('apparel-women', 'Women''s Clothing', 'پوشاک زنانه', 'apparel-women', 'Shirt', '/images/products/photo-1515886657613-9f3515b0c78f.jpg', 'مانتو، شومیز، شلوار و پیراهن‌های ترند روز برای بانوان', 'apparel', 1, 2, '2026-01-10T10:25:00.000Z', '2026-01-10T10:25:00.000Z'),
('apparel-women-manto', 'Women''s Overcoats & Mantos', 'مانتو و پالتو زنانه', 'apparel-women-manto', 'Shirt', '/images/products/photo-1539571696357-5a69c17a67c6.jpg', 'مانتوهای مینیمال و عبایی با پارچه‌های طبیعی و لنین', 'apparel-women', 1, 1, '2026-01-10T10:30:00.000Z', '2026-01-10T10:30:00.000Z'),
('apparel-women-shomiz', 'Women''s Blouses & Shirts', 'شومیز و بلوز زنانه', 'apparel-women-shomiz', 'Shirt', '/images/products/photo-1564257631407-4deb1f99d992.jpg', 'شومیزهای مجلسی و روزمره با دوخت ظریف و شیک', 'apparel-women', 1, 2, '2026-01-10T10:35:00.000Z', '2026-01-10T10:35:00.000Z'),
('apparel-women-pants', 'Women''s Pants', 'شلوار زنانه', 'apparel-women-pants', 'Shirt', '/images/products/photo-1541099649105-f69ad21f3246.jpg', 'شلوارهای جین و پارچه‌ای راسته و بگ بانوان', 'apparel-women', 1, 3, '2026-01-10T10:40:00.000Z', '2026-01-10T10:40:00.000Z'),
('apparel-kids', 'Kids'' Clothing', 'پوشاک بچگانه', 'apparel-kids', 'Shirt', '/images/products/photo-1519457431-44ccd64a579b.jpg', 'لباس‌های راحت، لطیف و ضدحساسیت برای کودکان و نوجوانان', 'apparel', 1, 3, '2026-01-10T10:45:00.000Z', '2026-01-10T10:45:00.000Z'),
('audio', 'Audio', 'تجهیزات صوتی', 'audio', 'Headphones', '/images/products/photo-1505740420928-5e560c06d30e.jpg', 'هدفون‌ها، ایرپادها و اسپیکرهای بی‌سیم با کیفیت استودیو', NULL, 1, 2, '2026-01-10T10:50:00.000Z', '2026-01-10T10:50:00.000Z'),
('audio-headphones', 'Headphones', 'هدفون و ایرفون', 'audio-headphones', 'Headphones', '/images/products/photo-1505740420928-5e560c06d30e.jpg', 'هدفون‌های روگوشی نویزکنسلینگ و هندزفری‌های بی‌سیم TWS', 'audio', 1, 1, '2026-01-10T10:55:00.000Z', '2026-01-10T10:55:00.000Z'),
('audio-speakers', 'Speakers', 'اسپیکر و بلندگو', 'audio-speakers', 'Headphones', '/images/products/photo-1545454675-3531b543be5d.jpg', 'اسپیکرهای بلوتوثی پرتابل و سیستم‌های صوتی خانگی های‌فای', 'audio', 1, 2, '2026-01-10T11:00:00.000Z', '2026-01-10T11:00:00.000Z'),
('workspace', 'Workspace', 'میز کار و اداری', 'workspace', 'Laptop', '/images/products/photo-1527864550417-7fd91fc51a46.jpg', 'لوازم ارگونومیک، کیبوردهای مکانیکال و استندهای چوب گردو', NULL, 1, 3, '2026-01-10T11:05:00.000Z', '2026-01-10T11:05:00.000Z'),
('smart-wear', 'Smart Gadgets', 'گجت هوشمند', 'smart-wear', 'Watch', '/images/products/photo-1523275335684-37898b6baf30.jpg', 'ساعت‌های هوشمند تیتانیومی و گجت‌های نسل نو سلامتی', NULL, 1, 4, '2026-01-10T11:10:00.000Z', '2026-01-10T11:10:00.000Z'),
('lifestyle', 'Lifestyle', 'لوازم روزمره', 'lifestyle', 'Briefcase', '/images/products/photo-1553062407-98eeb64c6a62.jpg', 'کیف‌های چرم طبیعی، کوله‌پشتی و اکسسوری‌های خاص', NULL, 1, 5, '2026-01-10T11:15:00.000Z', '2026-01-10T11:15:00.000Z'),
('coffee', 'Coffee', 'قهوه و کافه', 'coffee', 'Coffee', '/images/products/photo-1514432324607-a09d9b4aefdd.jpg', 'کتری‌های هوشمند باریستا، دانه‌های قهوه تخصصی و ماگ‌های عایق', NULL, 1, 6, '2026-01-10T11:20:00.000Z', '2026-01-10T11:20:00.000Z'),
('home-design', 'Home Decor', 'دکوراسیون', 'home-design', 'Home', '/images/products/photo-1507473885765-e6ed057f782c.jpg', 'چراغ‌های هوشمند امبینت، دکوری‌های بتنی و المان‌های آرامش‌بخش', NULL, 1, 7, '2026-01-10T11:25:00.000Z', '2026-01-10T11:25:00.000Z');

-- Products Seed (Top Core Products)
INSERT INTO `products` (`id`, `name`, `nameFa`, `brand`, `price`, `originalPrice`, `discount`, `rating`, `reviewsCount`, `soldCount`, `stock`, `category`, `description`, `descriptionFa`, `images`, `primaryImage`, `specs`, `features`, `featuresFa`, `colors`, `variants`, `tags`, `isNew`, `isFeatured`, `isBestseller`, `isActive`, `sku`, `views`, `cartAdds`, `createdAt`, `updatedAt`) VALUES
('lum-01', 'Lumina Horizon ANC Pro Headphones', 'هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو', 'Lumina Audio', 8950000, 10500000, 15, 4.9, 128, 450, 24, 'audio', 'Flagship wireless over-ear headphones with custom acoustic engineering.', 'پرچمدار هدفون‌های بی‌سیم روگوشی با درایورهای تیتانیومی ۴۰ میلی‌متری و نویزکنسلینگ فعال هیبریدی تا ۴۲ دسی‌بل.', '["/images/products/photo-1505740420928-5e560c06d30e.jpg", "/images/products/photo-1484704849700-f032a568e944.jpg"]', '/images/products/photo-1505740420928-5e560c06d30e.jpg', '{"battery": "55 ساعت پخش مداوم", "driver": "40mm Titanium Dynamic Driver", "anc": "Active Noise Cancelling up to 42dB"}', '["55-hour battery life", "Hybrid ANC", "Spatial Audio"]', '["۵۵ ساعت شارژدهی مداوم", "نویزکنسلینگ تطبیقی هوشمند", "صدای سه‌بعدی فراگیر Hi-Res"]', '[{"id": "space-gray", "name": "Space Gray", "nameFa": "خاکستری فضایی", "hex": "#374151"}, {"id": "silver", "name": "Silver Mist", "nameFa": "نقره‌ای مات", "hex": "#E5E7EB"}]', '[]', '["پرچمدار", "نویزکنسلینگ", "صدا"]', 1, 1, 1, 1, 'LUM-AUD-001', 1250, 185, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'),
('lum-02', 'Aura Titan Minimalist Smart Watch', 'ساعت هوشمند مینیمال آئورا تیتانیوم', 'Lumina Wear', 12800000, 14500000, 12, 4.8, 94, 320, 18, 'smart-wear', 'Precision forged grade-5 titanium aerospace smartwatch with sapphire display.', 'ساعت هوشمند مجهز به بدنه تیتانیوم گرید ۵ هوافضا، شیشه یاقوت کبود و سنسورهای نسل ۵ پایش سلامت و ضربان قلب.', '["/images/products/photo-1523275335684-37898b6baf30.jpg"]', '/images/products/photo-1523275335684-37898b6baf30.jpg', '{"material": "Grade 5 Titanium", "screen": "1.43 inch AMOLED Sapphire", "battery": "14 Days Typical"}', '["Titanium Body", "Sapphire Glass", "14-day Battery"]', '["بدنه تیتانیوم فوق سبک", "صفحه‌نمایش یاقوت کبود همیشه روشن", "۱۴ روز شارژدهی باتری"]', '[{"id": "raw-titanium", "name": "Titanium", "nameFa": "تیتانیوم مات", "hex": "#9CA3AF"}]', '[]', '["ساعت هوشمند", "تیتانیوم", "گجت"]', 1, 1, 1, 1, 'LUM-SMA-002', 980, 120, '2026-01-02T00:00:00.000Z', '2026-01-02T00:00:00.000Z'),
('lum-03', 'Lumina Ergonomic Walnut Desk Shelf', 'پایه‌ی مانیتور چوب گردو و ارگونومیک لومینا', 'Lumina Workspace', 3450000, 3900000, 10, 4.9, 86, 210, 35, 'workspace', 'Solid American Walnut handcrafted dual monitor riser with aluminum unibody feet.', 'استند مانیتور ساخته‌شده از چوب گردوی آمریکایی طبیعی فرآوری‌شده به همراه پایه‌های آلومینیومی ماشین‌کاری‌شده CNC.', '["/images/products/photo-1527864550417-7fd91fc51a46.jpg"]', '/images/products/photo-1527864550417-7fd91fc51a46.jpg', '{"wood": "American Solid Walnut", "feet": "Anodized Aluminum CNC", "length": "105 cm"}', '["Solid Walnut", "Cable Management", "Dual Monitor Support"]', '["چوب گردوی طبیعی", "مدیریت حرفه‌ای کابل‌ها", "تحمل وزن تا ۴۵ کیلوگرم"]', '[]', '[]', '["میز کار", "ارگونومیک", "چوب گردو"]', 0, 1, 1, 1, 'LUM-WOR-003', 740, 89, '2026-01-03T00:00:00.000Z', '2026-01-03T00:00:00.000Z'),
('lum-04', 'Precision Gooseneck Smart Kettle', 'کتری برقی هوشمند و ارگونومیک باریستا', 'Lumina Coffee', 5200000, 5800000, 10, 4.7, 62, 180, 22, 'coffee', 'Variable temperature PID gooseneck kettle designed for specialty pour-over brewing.', 'کتری برقی هوشمند با لوله ارگونومیک قوسی باریستا، کنترل دمای دقیق دیجیتال با دقت ۱ درجه و قابلیت حفظ دما تا ۲ ساعت.', '["/images/products/photo-1514432324607-a09d9b4aefdd.jpg"]', '/images/products/photo-1514432324607-a09d9b4aefdd.jpg', '{"capacity": "900ml", "power": "1200W Fast Boil", "control": "Digital PID ±1°C"}', '["PID Control", "Timer Display", "Matte Finish"]', '["کنترل دمای دقیق PID", "صفحه نمایش تایمر عصاره‌گیری", "پوشش مات نانو ضدلکه"]', '[]', '[]', '["قهوه", "باریستا", "کتری هوشمند"]', 0, 1, 0, 1, 'LUM-COF-004', 620, 68, '2026-01-04T00:00:00.000Z', '2026-01-04T00:00:00.000Z'),
('lum-05', 'Vortex Titanium EDC Travel Backpack', 'کوله پشتی ضدآب و اولترا لایت مسافرتی ورتکس', 'Lumina Lifestyle', 4600000, 5100000, 10, 4.8, 115, 290, 40, 'lifestyle', 'Cordura 500D waterproof commuter backpack with dedicated magnetic tech sleeves.', 'کوله‌پشتی ارگونومیک و سبک مسافرتی از جنس پارچه ضدآب کوردورا ۵۰۰D، مجهز به محفظه ضربه‌گیر لپ‌تاپ تا ۱۶ اینچ و زیپ‌های YKK.', '["/images/products/photo-1553062407-98eeb64c6a62.jpg"]', '/images/products/photo-1553062407-98eeb64c6a62.jpg', '{"capacity": "24 Liters", "material": "Cordura 500D Waterproof", "laptop": "Up to 16 inch MacBook Pro"}', '["Waterproof", "YKK Zippers", "Ergonomic Straps"]', '["پارچه نفوذناپذیر در برابر باران", "زیپ‌های ضدآب YKK ژاپن", "طراحی ارگونومیک ضدتعریق"]', '[]', '[]', '["کوله پشتی", "ضدآب", "مسافرتی"]', 0, 1, 1, 1, 'LUM-LIF-005', 890, 112, '2026-01-05T00:00:00.000Z', '2026-01-05T00:00:00.000Z'),
('lum-06', 'Halo Amber Sunset Mood Lamp', 'چراغ رومیزی اتمسفریک کهربایی هالو', 'Lumina Home', 2900000, 3400000, 15, 4.9, 78, 230, 28, 'home-design', 'Atmospheric sunset simulation desktop lamp with anodized aluminum finish.', 'چراغ رومیزی با لنز کریستالی شبیه‌ساز غروب کهربایی و بدنه تمام آلومینیوم مات جهت ایجاد اتمسفر گرم و آرامش‌بخش.', '["/images/products/photo-1507473885765-e6ed057f782c.jpg"]', '/images/products/photo-1507473885765-e6ed057f782c.jpg', '{"light": "Warm Amber Sunset 2200K", "body": "Anodized Aluminum", "power": "USB-C Powered"}', '["Crystal Lens", "Touch Dimming", "Ambient Glow"]', '["لنز اپتیکال شیشه‌ای", "دیمر لمسی تغییر شدت نور", "پورت تغذیه استاندارد تایپ‌سی"]', '[]', '[]', '["دکوراسیون", "چراغ خواب", "اتمسفر"]', 1, 1, 0, 1, 'LUM-HOM-006', 710, 84, '2026-01-06T00:00:00.000Z', '2026-01-06T00:00:00.000Z');

-- Users Seed
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `avatar`, `role`, `joinedDate`, `ordersCount`, `totalSpent`, `status`, `lastActive`, `createdAt`) VALUES
('usr-001', 'علیرضا رادمنش', 'alireza.rad@example.com', '۰۹۱۲۳۴۵۶۷۸۹', 'password123', '/images/products/photo-1534528741775-53994a69daeb.jpg', 'vip', '۱۴۰۳/۱۱/۲۰', 8, 42500000, 'active', '۱۰ دقیقه پیش', '2026-01-01T00:00:00.000Z'),
('usr-002', 'مهدی کشاورز', 'm.keshavarz@gmail.com', '۰۹۳۵۱۲۳۴۵۶۷', 'password123', '/images/products/photo-1507003211169-0a1dd7228f2d.jpg', 'regular', '۱۴۰۴/۰۱/۱۵', 3, 19800000, 'active', '۲ ساعت پیش', '2026-01-02T00:00:00.000Z'),
('usr-003', 'سارا تهرانی', 'sara.t@example.com', '۰۹۱۹۷۶۵۴۳۲۱', 'password123', '/images/products/photo-1494790108377-be9c29b29330.jpg', 'vip', '۱۴۰۳/۰۸/۱۰', 12, 68400000, 'active', 'دیروز', '2026-01-03T00:00:00.000Z'),
('usr-004', 'پویا امینی', 'pouya.am@gmail.com', '۰۹۱۲۸۹۰۱۲۳۴', 'password123', '/images/products/photo-1500648767791-00dcc994a43e.jpg', 'regular', '۱۴۰۴/۰۴/۰۲', 4, 21900000, 'active', '۳ روز پیش', '2026-01-04T00:00:00.000Z'),
('usr-005', 'نگار صادقی', 'negar.sd@yahoo.com', '۰۹۳۰۴۴۴۵۵۶۶', 'password123', '/images/products/photo-1544005313-94ddf0286df2.jpg', 'regular', '۱۴۰۴/۰۵/۱۸', 2, 6400000, 'active', '۵ روز پیش', '2026-01-05T00:00:00.000Z');

-- Orders Seed
INSERT INTO `orders` (`id`, `date`, `timestamp`, `customer`, `items`, `subtotal`, `discount`, `shipping`, `total`, `status`, `statusFa`, `paymentMethod`, `trackingNumber`, `courierName`, `estimatedDelivery`, `createdAt`) VALUES
('ORD-98750', '۱۴۰۴/۰۶/۱۹ - ۱۰:۳۰', 1758273600000, '{"name": "کیان مهرآذر", "email": "kian.mehrazar@example.com", "phone": "۰۹۱۲۳۴۵۶۷۸۹", "city": "تهران", "address": "خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر، پلاک ۱۲", "postalCode": "۱۹۶۸۸۱۴۵۳۲"}', '[{"id": "ord-item-proc-1", "productId": "lum-01", "productName": "Lumina Horizon Pro Wireless Headphones", "productNameFa": "هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال", "image": "/images/products/photo-1505740420928-5e560c06d30e.jpg", "price": 14500000, "quantity": 1}]', 14500000, 1450000, 0, 13050000, 'processing', 'در حال پردازش', 'درگاه آنلاین سامان', 'LMN-77492019', 'پیک ویژه اکسپرس لومینا', 'فردا بین ساعت ۱۴ تا ۱۸', '2026-09-19T10:30:00.000Z'),
('ORD-98612', '۱۴۰۴/۰۶/۱۸ - ۱۶:۴۵', 1758187200000, '{"name": "کیان مهرآذر", "email": "kian.mehrazar@example.com", "phone": "۰۹۱۲۳۴۵۶۷۸۹", "city": "تهران", "address": "ونک، خیابان ملاصدرا، برج فناوری لومینا", "postalCode": "۱۹۹۱۸۵۴۳۲۱"}', '[{"id": "ord-item-ship-1", "productId": "lum-03", "productName": "Aura Studio Ambient Smart Lamp", "productNameFa": "چراغ رومیزی هوشمند امبینت آئورا استودیو", "image": "/images/products/photo-1507473885765-e6ed057f782c.jpg", "price": 5200000, "quantity": 1}, {"id": "ord-item-ship-2", "productId": "lum-04", "productName": "Chrono Apex Titanium Smartwatch", "productNameFa": "ساعت هوشمند پرچمدار کورونو اپکس تیتانیومی", "image": "/images/products/photo-1523275335684-37898b6baf30.jpg", "price": 19800000, "quantity": 1}]', 25000000, 2500000, 0, 22500000, 'shipped', 'ارسال شده', 'درگاه آنلاین سامان', 'TPX-994108420', 'تیپاکس اکسپرس هوایی', 'امروز عصر تا ساعت ۲۰:۰۰', '2026-09-18T16:45:00.000Z'),
('LUM-84920', '۱۴۰۴/۰۶/۱۸ - ۱۶:۳۰', 1758186000000, '{"name": "علیرضا رادمنش", "email": "alireza.rad@example.com", "phone": "۰۹۱۲۳۴۵۶۷۸۹", "city": "تهران", "address": "سعادت‌آباد، خیابان علامه شمالی، پلاک ۴۲، واحد ۳", "postalCode": "۱۹۹۷۹۳۲۱۴۵"}', '[{"id": "lum-01", "productId": "lum-01", "productName": "Lumina Horizon ANC Pro Headphones", "productNameFa": "هدفون بی‌سیم نویزکنسلینگ لومینا هورایزن پرو", "image": "/images/products/photo-1505740420928-5e560c06d30e.jpg", "price": 8950000, "quantity": 1}, {"id": "lum-03", "productId": "lum-03", "productName": "Lumina Ergonomic Walnut Desk Shelf", "productNameFa": "پایه‌ی مانیتور چوب گردو و ارگونومیک لومینا", "image": "/images/products/photo-1527864550417-7fd91fc51a46.jpg", "price": 3450000, "quantity": 1}]', 12400000, 500000, 0, 11900000, 'paid', 'پرداخت شده', 'درگاه آنلاین شاپرک', 'TRK-98432190', 'پیک اکسپرس لومینا', 'تحویل فردا', '2026-09-18T16:30:00.000Z');

-- Coupons Seed
INSERT INTO `coupons` (`id`, `code`, `discountPercent`, `maxDiscount`, `minPurchase`, `expiresAt`, `usageCount`, `maxUsage`, `isActive`, `createdAt`) VALUES
('coup-1', 'LUMINA2025', 15, 1500000, 3000000, '۱۴۰۴/۰۷/۰۱', 142, 500, 1, '2026-01-01T00:00:00.000Z'),
('coup-2', 'VIPGIFT', 20, 3000000, 5000000, '۱۴۰۴/۰۶/۳۰', 68, 100, 1, '2026-01-01T00:00:00.000Z'),
('coup-3', 'WELCOME10', 10, 800000, 1000000, '۱۴۰۴/۱۲/۲۹', 310, 1000, 1, '2026-01-01T00:00:00.000Z');

-- Festivals Seed
INSERT INTO `festivals` (`id`, `title`, `titleEn`, `slogan`, `sloganEn`, `description`, `startDate`, `endDate`, `startTimestamp`, `endTimestamp`, `isActive`, `priority`, `themeColor`, `badgeText`, `discountPercent`, `couponCode`, `bannerImage`, `products`, `coupons`, `createdAt`, `updatedAt`) VALUES
('fest-spring-2026', 'جشنواره شگفت‌انگیز نوروزی لومینا ۲۰۲۶', 'Lumina Smart Tech Spring Festival 2026', 'تخفیف‌های استثنایی بر روی جدیدترین پرچمداران تکنولوژی و صدای استودیویی Hi-Res', 'Exclusive discounts on flagship audio, wearables and smart home ecosystem.', 'به مناسبت سال جدید و رونمایی از لاین‌آپ اختصاصی ۲۰۲۶، محصولات منتخب این کمپین با تخفیف‌های ویژه، ضمانت تعویض ۲۴ ماهه و ارسال اکسپرس رایگان ارائه می‌گردند.', '۱۴۰۴/۱۲/۱۵', '۱۴۰۵/۰۱/۱۵', 1758100000000, 1760700000000, 1, 10, 'rose', 'تخفیف شگفت‌انگیز نوروزی', 35, 'FESTIVAL2026', '/images/products/photo-1505740420928-5e560c06d30e.jpg', '[]', '[]', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z');

-- Reviews Seed
INSERT INTO `reviews` (`id`, `productId`, `productNameFa`, `userId`, `userName`, `userAvatar`, `userEmail`, `rating`, `comment`, `status`, `isVerifiedPurchase`, `adminReply`, `adminReplyBy`, `adminReplyAt`, `createdAt`, `timestamp`) VALUES
('rev-01', 'lum-01', 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال', 'usr-kian-01', 'کیان مهرآذر', '/images/products/photo-1535713875002-d1d0cf377fde.jpg', 'kian.mehrazar@example.com', 5, 'کیفیت ساخت و تفکیک صدای این هدفون بی‌نظیره! نویزکنسلینگ در محیط‌های شلوغ کاملاً عالی عمل می‌کنه و باتری هم راحت ۲ روز جواب میده.', 'approved', 1, 'ممنون از نظرتون جناب مهرآذر عزیز! خرسندیم که از کیفیت نویزکنسلینگ و کیفیت بالای هدفون هورایزن پرو رضایت دارید. 🌹', 'پشتیبانی لومینا', '۱۴۰۴/۰۶/۲۰ - ۱۲:۰۰', '۱۴۰۴/۰۶/۱۹ - ۱۴:۳۰', 1758273600000),
('rev-02', 'lum-01', 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال', 'usr-sarah-02', 'سارا رضایی', '/images/products/photo-1494790108377-be9c29b29330.jpg', 'sarah.rezaei@example.com', 4, 'ارسال بسیار سریع بود. پدهای گوشی خیلی نرم و راحتن. تنها نکته کوچیک کیف حملشه که یکم بزرگه، اما در کل ارزش خرید خیلی بالایی داره.', 'approved', 1, NULL, NULL, NULL, '۱۴۰۴/۰۶/۱۸ - ۰۹:۱۵', 1758187200000);

-- Site Analytics Seed
INSERT INTO `site_analytics` (`key_name`, `value_num`, `value_json`, `updatedAt`) VALUES
('dailyVisits', 3840, NULL, '2026-09-21T12:00:00.000Z'),
('weeklyVisits', 26500, NULL, '2026-09-21T12:00:00.000Z'),
('monthlyVisits', 114200, NULL, '2026-09-21T12:00:00.000Z')
ON DUPLICATE KEY UPDATE `value_num` = VALUES(`value_num`);

SET FOREIGN_KEY_CHECKS = 1;
