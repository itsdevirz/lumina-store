import mysql from 'mysql2/promise';

export interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
  ssl?: any;
}

export interface MySQLStatus {
  connected: boolean;
  database: string;
  host: string;
  port: number;
  user: string;
  error?: string;
  tablesCount?: number;
  records?: {
    products: number;
    categories: number;
    users: number;
    orders: number;
    coupons: number;
    festivals: number;
    reviews: number;
  };
}

export class MySQLService {
  private pool: mysql.Pool | null = null;
  private isConnected = false;
  private lastError: string | null = null;
  private config: MySQLConfig;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'cp63925519643_dev',
      password: process.env.DB_PASSWORD || 'Alireza23!#',
      database: process.env.DB_NAME || 'cp63925519643_online_shop_db',
    };
  }

  public getConfig(): MySQLConfig {
    return { ...this.config, password: this.config.password ? '******' : '' };
  }

  public getStatus(): MySQLStatus {
    return {
      connected: this.isConnected,
      database: this.config.database,
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      error: this.lastError || undefined,
    };
  }

  public isConnectedToMySQL(): boolean {
    return this.isConnected;
  }

  public async testAndReconnect(newConfig?: Partial<MySQLConfig>, initialData?: any): Promise<{ success: boolean; message: string; error?: string; diagnostic?: string }> {
    if (newConfig) {
      const cleanConfig: Partial<MySQLConfig> = { ...newConfig };
      if (!cleanConfig.password && this.config.password) {
        delete cleanConfig.password;
      }
      this.config = {
        ...this.config,
        ...cleanConfig,
        port: Number(newConfig.port) || this.config.port
      };
    }
    try {
      if (this.pool) {
        try {
          await this.pool.end();
        } catch {
          // ignore pool close error
        }
      }
      const success = await this.init(initialData);
      if (success) {
        return {
          success: true,
          message: `اتصال به پایگاه داده MySQL (${this.config.database}) در ${this.config.host}:${this.config.port} با موفقیت برقرار شد.`
        };
      } else {
        let diagnostic = '';
        const errStr = (this.lastError || '').toLowerCase();
        const host = this.config.host;

        if (host === 'localhost' || host === '127.0.0.1') {
          diagnostic = 'نکته مهم: آدرس سرور روی «localhost» قرار دارد. برای اتصال زنده از راه دور به هاست cPanel خود، آدرس IP سرور یا دامنه سایتتان را در فیلد میزبان (Host) وارد کرده و در cPanel بخش Remote MySQL دسترسی % را فعال نمایید.';
        } else if (errStr.includes('access denied') || errStr.includes('1045')) {
          diagnostic = 'خطای دسترسی نام کاربری یا رمز عبور: لطفاً در سی‌پنل (MySQL Databases) بررسی کنید که کاربر به این دیتابیس متصل بوده و تیک دسترسی ALL PRIVILEGES خورده باشد.';
        } else if (errStr.includes('timedout') || errStr.includes('econnrefused') || errStr.includes('enotfound')) {
          diagnostic = `عدم دسترسی به پورت 3306 در سرور ${this.config.host}. لطفاً در سی‌پنل هاست به بخش «Remote MySQL» بروید و در کادر Host علامت % (درصد) را اضافه نمایید.`;
        } else if (errStr.includes('unknown database') || errStr.includes('1049')) {
          diagnostic = `دیتابیسی با نام «${this.config.database}» در هاست پیدا نشد. لطفاً ابتدا در سی‌پنل این دیتابیس را بسازید.`;
        }

        return {
          success: false,
          message: this.lastError ? `پاسخ سرور دیتابیس (${this.config.host}:${this.config.port}): ${this.lastError}` : 'اتصال برقرار نشد.',
          error: this.lastError || undefined,
          diagnostic
        };
      }
    } catch (err: any) {
      this.isConnected = false;
      const code = err?.code || '';
      const errno = err?.errno || '';
      const sqlMsg = err?.sqlMessage || err?.message || String(err);
      this.lastError = code ? `[${code}${errno ? ` / ${errno}` : ''}] ${sqlMsg}` : sqlMsg;
      return {
        success: false,
        message: `خطا در اتصال به MySQL (${this.config.host}:${this.config.port}): ${this.lastError}`,
        error: this.lastError
      };
    }
  }

  public async getTableCounts(): Promise<Record<string, number> | null> {
    if (!this.pool || !this.isConnected) return null;
    try {
      const counts: Record<string, number> = {};
      const tables = ['products', 'categories', 'orders', 'users', 'coupons', 'festivals', 'reviews', 'support_sessions'];
      for (const t of tables) {
        try {
          const [rows]: any = await this.pool.query(`SELECT COUNT(*) as count FROM \`${t}\``);
          const key = t === 'support_sessions' ? 'supportSessions' : t;
          counts[key] = rows && rows[0] ? Number(rows[0].count) : 0;
        } catch {
          const key = t === 'support_sessions' ? 'supportSessions' : t;
          counts[key] = 0;
        }
      }
      return counts;
    } catch {
      return null;
    }
  }

  public async init(initialData?: any): Promise<boolean> {
    try {
      console.log(`[MySQL] Attempting connection to MySQL server at ${this.config.host}:${this.config.port} (database: ${this.config.database})...`);

      this.pool = mysql.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
      });

      const connection = await this.pool.getConnection();
      console.log(`[MySQL] Successfully connected to MySQL database: ${this.config.database}`);
      connection.release();

      this.isConnected = true;
      this.lastError = null;

      await this.createTablesIfNotExist();

      if (initialData) {
        await this.seedInitialDataIfEmpty(initialData);
      }

      return true;
    } catch (err: any) {
      this.isConnected = false;
      const code = err?.code || '';
      const errno = err?.errno || '';
      const sqlMsg = err?.sqlMessage || err?.message || String(err);
      this.lastError = code ? `[${code}${errno ? ` / ${errno}` : ''}] ${sqlMsg}` : sqlMsg;
      console.warn(`[MySQL] Notice: MySQL database connection could not be established (${this.lastError}).`);
      return false;
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public getPool(): mysql.Pool | null {
    return this.pool;
  }

  public async createTablesIfNotExist(): Promise<void> {
    if (!this.pool || !this.isConnected) return;

    try {
      console.log('[MySQL] Ensuring database schema and tables exist in online_shop_db...');

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`categories\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`name\` VARCHAR(255) NOT NULL,
          \`nameFa\` VARCHAR(255) NOT NULL,
          \`slug\` VARCHAR(255) NOT NULL,
          \`icon\` VARCHAR(100) DEFAULT 'Folder',
          \`image\` VARCHAR(500) DEFAULT NULL,
          \`description\` TEXT DEFAULT NULL,
          \`parentId\` VARCHAR(100) DEFAULT NULL,
          \`isActive\` TINYINT(1) DEFAULT 1,
          \`sortOrder\` INT DEFAULT 0,
          \`createdAt\` VARCHAR(50) DEFAULT NULL,
          \`updatedAt\` VARCHAR(50) DEFAULT NULL,
          INDEX \`idx_categories_parent\` (\`parentId\`),
          INDEX \`idx_categories_slug\` (\`slug\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`products\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`name\` VARCHAR(255) NOT NULL,
          \`nameFa\` VARCHAR(255) NOT NULL,
          \`brand\` VARCHAR(100) NOT NULL,
          \`price\` BIGINT NOT NULL,
          \`originalPrice\` BIGINT DEFAULT NULL,
          \`discount\` INT DEFAULT 0,
          \`rating\` DECIMAL(3,1) DEFAULT 5.0,
          \`reviewsCount\` INT DEFAULT 0,
          \`soldCount\` INT DEFAULT 0,
          \`stock\` INT DEFAULT 0,
          \`category\` VARCHAR(100) NOT NULL,
          \`description\` TEXT DEFAULT NULL,
          \`descriptionFa\` TEXT DEFAULT NULL,
          \`images\` JSON DEFAULT NULL,
          \`primaryImage\` VARCHAR(500) DEFAULT NULL,
          \`specs\` JSON DEFAULT NULL,
          \`features\` JSON DEFAULT NULL,
          \`featuresFa\` JSON DEFAULT NULL,
          \`colors\` JSON DEFAULT NULL,
          \`variants\` JSON DEFAULT NULL,
          \`tags\` JSON DEFAULT NULL,
          \`isNew\` TINYINT(1) DEFAULT 0,
          \`isFeatured\` TINYINT(1) DEFAULT 0,
          \`isBestseller\` TINYINT(1) DEFAULT 0,
          \`isActive\` TINYINT(1) DEFAULT 1,
          \`sku\` VARCHAR(100) DEFAULT NULL,
          \`views\` INT DEFAULT 0,
          \`cartAdds\` INT DEFAULT 0,
          \`createdAt\` VARCHAR(50) DEFAULT NULL,
          \`updatedAt\` VARCHAR(50) DEFAULT NULL,
          INDEX \`idx_products_category\` (\`category\`),
          INDEX \`idx_products_price\` (\`price\`),
          INDEX \`idx_products_active\` (\`isActive\`),
          INDEX \`idx_products_sku\` (\`sku\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`users\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`name\` VARCHAR(255) NOT NULL,
          \`email\` VARCHAR(255) NOT NULL,
          \`phone\` VARCHAR(50) NOT NULL,
          \`password\` VARCHAR(255) DEFAULT NULL,
          \`avatar\` VARCHAR(500) DEFAULT NULL,
          \`role\` VARCHAR(50) DEFAULT 'regular',
          \`joinedDate\` VARCHAR(50) DEFAULT NULL,
          \`ordersCount\` INT DEFAULT 0,
          \`totalSpent\` BIGINT DEFAULT 0,
          \`status\` VARCHAR(50) DEFAULT 'active',
          \`lastActive\` VARCHAR(100) DEFAULT NULL,
          \`createdAt\` VARCHAR(50) DEFAULT NULL,
          INDEX \`idx_users_email\` (\`email\`),
          INDEX \`idx_users_phone\` (\`phone\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`orders\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`date\` VARCHAR(50) NOT NULL,
          \`timestamp\` BIGINT NOT NULL,
          \`customer\` JSON NOT NULL,
          \`items\` JSON NOT NULL,
          \`subtotal\` BIGINT NOT NULL,
          \`discount\` BIGINT DEFAULT 0,
          \`shipping\` BIGINT DEFAULT 0,
          \`total\` BIGINT NOT NULL,
          \`status\` VARCHAR(50) NOT NULL,
          \`statusFa\` VARCHAR(100) NOT NULL,
          \`paymentMethod\` VARCHAR(100) DEFAULT NULL,
          \`trackingNumber\` VARCHAR(100) DEFAULT NULL,
          \`courierName\` VARCHAR(100) DEFAULT NULL,
          \`estimatedDelivery\` VARCHAR(100) DEFAULT NULL,
          \`createdAt\` VARCHAR(50) DEFAULT NULL,
          INDEX \`idx_orders_status\` (\`status\`),
          INDEX \`idx_orders_timestamp\` (\`timestamp\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`coupons\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`code\` VARCHAR(100) NOT NULL UNIQUE,
          \`discountPercent\` INT DEFAULT 0,
          \`maxDiscount\` BIGINT DEFAULT 0,
          \`minPurchase\` BIGINT DEFAULT 0,
          \`expiresAt\` VARCHAR(50) DEFAULT NULL,
          \`usageCount\` INT DEFAULT 0,
          \`maxUsage\` INT DEFAULT 100,
          \`isActive\` TINYINT(1) DEFAULT 1,
          \`createdAt\` VARCHAR(50) DEFAULT NULL,
          INDEX \`idx_coupons_code\` (\`code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`festivals\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`title\` VARCHAR(255) NOT NULL,
          \`titleEn\` VARCHAR(255) DEFAULT NULL,
          \`slogan\` TEXT DEFAULT NULL,
          \`sloganEn\` TEXT DEFAULT NULL,
          \`description\` TEXT DEFAULT NULL,
          \`startDate\` VARCHAR(50) DEFAULT NULL,
          \`endDate\` VARCHAR(50) DEFAULT NULL,
          \`startTimestamp\` BIGINT DEFAULT NULL,
          \`endTimestamp\` BIGINT DEFAULT NULL,
          \`isActive\` TINYINT(1) DEFAULT 1,
          \`priority\` INT DEFAULT 0,
          \`themeColor\` VARCHAR(50) DEFAULT 'rose',
          \`badgeText\` VARCHAR(100) DEFAULT NULL,
          \`discountPercent\` INT DEFAULT 0,
          \`couponCode\` VARCHAR(100) DEFAULT NULL,
          \`bannerImage\` VARCHAR(500) DEFAULT NULL,
          \`products\` JSON DEFAULT NULL,
          \`coupons\` JSON DEFAULT NULL,
          \`createdAt\` VARCHAR(50) DEFAULT NULL,
          \`updatedAt\` VARCHAR(50) DEFAULT NULL,
          INDEX \`idx_festivals_active\` (\`isActive\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`reviews\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`productId\` VARCHAR(100) NOT NULL,
          \`productNameFa\` VARCHAR(255) DEFAULT NULL,
          \`userId\` VARCHAR(100) DEFAULT NULL,
          \`userName\` VARCHAR(255) NOT NULL,
          \`userAvatar\` VARCHAR(500) DEFAULT NULL,
          \`userEmail\` VARCHAR(255) DEFAULT NULL,
          \`rating\` INT NOT NULL,
          \`comment\` TEXT NOT NULL,
          \`status\` VARCHAR(50) DEFAULT 'approved',
          \`isVerifiedPurchase\` TINYINT(1) DEFAULT 0,
          \`adminReply\` TEXT DEFAULT NULL,
          \`adminReplyBy\` VARCHAR(100) DEFAULT NULL,
          \`adminReplyAt\` VARCHAR(50) DEFAULT NULL,
          \`createdAt\` VARCHAR(50) DEFAULT NULL,
          \`timestamp\` BIGINT DEFAULT NULL,
          INDEX \`idx_reviews_product\` (\`productId\`),
          INDEX \`idx_reviews_status\` (\`status\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`admin_notifications\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`title\` VARCHAR(255) NOT NULL,
          \`message\` TEXT NOT NULL,
          \`time\` VARCHAR(50) DEFAULT NULL,
          \`type\` VARCHAR(50) DEFAULT 'order',
          \`isRead\` TINYINT(1) DEFAULT 0,
          \`linkTab\` VARCHAR(100) DEFAULT NULL,
          \`createdAt\` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`site_analytics\` (
          \`key_name\` VARCHAR(100) PRIMARY KEY,
          \`value_num\` BIGINT DEFAULT 0,
          \`value_json\` JSON DEFAULT NULL,
          \`updatedAt\` VARCHAR(50) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`support_sessions\` (
          \`id\` VARCHAR(100) PRIMARY KEY,
          \`userName\` VARCHAR(255) DEFAULT NULL,
          \`userEmail\` VARCHAR(255) DEFAULT NULL,
          \`userPhone\` VARCHAR(50) DEFAULT NULL,
          \`createdAt\` BIGINT NOT NULL,
          \`updatedAt\` BIGINT NOT NULL,
          \`status\` VARCHAR(50) DEFAULT 'waiting_human',
          \`unreadByAdminCount\` INT DEFAULT 0,
          \`unreadByUserCount\` INT DEFAULT 0,
          \`lastMessage\` TEXT DEFAULT NULL,
          \`messages\` JSON DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      console.log('[MySQL] All tables verified/created successfully in online_shop_db.');
    } catch (err: any) {
      console.error('[MySQL] Error creating tables:', err);
      throw err;
    }
  }

  public async seedInitialDataIfEmpty(data: any): Promise<void> {
    if (!this.pool || !this.isConnected) return;
    try {
      const [rows]: any = await this.pool.query('SELECT COUNT(*) as count FROM `products`');
      const count = rows[0]?.count || 0;

      if (count === 0) {
        console.log('[MySQL] MySQL tables are empty. Seeding initial store dataset into online_shop_db...');
        await this.syncAllToMySQL(data);
        console.log('[MySQL] Seeding completed successfully!');
      }
    } catch (err) {
      console.error('[MySQL] Error checking/seeding database:', err);
    }
  }

  public async syncAllToMySQL(data: any): Promise<boolean> {
    if (!this.pool || !this.isConnected) return false;

    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      if (Array.isArray(data.categories)) {
        for (const cat of data.categories) {
          await connection.query(`
            INSERT INTO \`categories\` (\`id\`, \`name\`, \`nameFa\`, \`slug\`, \`icon\`, \`image\`, \`description\`, \`parentId\`, \`isActive\`, \`sortOrder\`, \`createdAt\`, \`updatedAt\`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              \`name\` = VALUES(\`name\`), \`nameFa\` = VALUES(\`nameFa\`), \`slug\` = VALUES(\`slug\`),
              \`icon\` = VALUES(\`icon\`), \`image\` = VALUES(\`image\`), \`description\` = VALUES(\`description\`),
              \`parentId\` = VALUES(\`parentId\`), \`isActive\` = VALUES(\`isActive\`), \`sortOrder\` = VALUES(\`sortOrder\`),
              \`updatedAt\` = VALUES(\`updatedAt\`)
          `, [
            cat.id, cat.name, cat.nameFa, cat.slug || cat.id, cat.icon || 'Folder',
            cat.image || null, cat.description || null, cat.parentId || null,
            cat.isActive !== false ? 1 : 0, cat.sortOrder || 0,
            cat.createdAt || new Date().toISOString(), cat.updatedAt || new Date().toISOString()
          ]);
        }
      }

      if (Array.isArray(data.products)) {
        for (const p of data.products) {
          await connection.query(`
            INSERT INTO \`products\` (
              \`id\`, \`name\`, \`nameFa\`, \`brand\`, \`price\`, \`originalPrice\`, \`discount\`,
              \`rating\`, \`reviewsCount\`, \`soldCount\`, \`stock\`, \`category\`,
              \`description\`, \`descriptionFa\`, \`images\`, \`primaryImage\`, \`specs\`,
              \`features\`, \`featuresFa\`, \`colors\`, \`variants\`, \`tags\`,
              \`isNew\`, \`isFeatured\`, \`isBestseller\`, \`isActive\`, \`sku\`,
              \`views\`, \`cartAdds\`, \`createdAt\`, \`updatedAt\`
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              \`name\` = VALUES(\`name\`), \`nameFa\` = VALUES(\`nameFa\`), \`brand\` = VALUES(\`brand\`),
              \`price\` = VALUES(\`price\`), \`originalPrice\` = VALUES(\`originalPrice\`), \`discount\` = VALUES(\`discount\`),
              \`rating\` = VALUES(\`rating\`), \`reviewsCount\` = VALUES(\`reviewsCount\`), \`soldCount\` = VALUES(\`soldCount\`),
              \`stock\` = VALUES(\`stock\`), \`category\` = VALUES(\`category\`), \`description\` = VALUES(\`description\`),
              \`descriptionFa\` = VALUES(\`descriptionFa\`), \`images\` = VALUES(\`images\`), \`primaryImage\` = VALUES(\`primaryImage\`),
              \`specs\` = VALUES(\`specs\`), \`features\` = VALUES(\`features\`), \`featuresFa\` = VALUES(\`featuresFa\`),
              \`colors\` = VALUES(\`colors\`), \`variants\` = VALUES(\`variants\`), \`tags\` = VALUES(\`tags\`),
              \`isNew\` = VALUES(\`isNew\`), \`isFeatured\` = VALUES(\`isFeatured\`), \`isBestseller\` = VALUES(\`isBestseller\`),
              \`isActive\` = VALUES(\`isActive\`), \`sku\` = VALUES(\`sku\`), \`views\` = VALUES(\`views\`),
              \`cartAdds\` = VALUES(\`cartAdds\`), \`updatedAt\` = VALUES(\`updatedAt\`)
          `, [
            p.id, p.name, p.nameFa, p.brand || 'Lumina', p.price, p.originalPrice || null, p.discount || 0,
            p.rating || 5.0, p.reviewsCount || 0, p.soldCount || 0, p.stock || 0, p.category,
            p.description || '', p.descriptionFa || '',
            JSON.stringify(p.images || []), p.primaryImage || (p.images && p.images[0]) || null,
            JSON.stringify(p.specs || {}), JSON.stringify(p.features || []), JSON.stringify(p.featuresFa || []),
            JSON.stringify(p.colors || []), JSON.stringify(p.variants || []), JSON.stringify(p.tags || []),
            p.isNew ? 1 : 0, p.isFeatured ? 1 : 0, p.isBestseller ? 1 : 0,
            p.isActive !== false ? 1 : 0, p.sku || `LUM-${p.id}`,
            p.views || 0, p.cartAdds || 0,
            p.createdAt || new Date().toISOString(), p.updatedAt || new Date().toISOString()
          ]);
        }
      }

      if (Array.isArray(data.users)) {
        for (const u of data.users) {
          await connection.query(`
            INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`password\`, \`avatar\`, \`role\`, \`joinedDate\`, \`ordersCount\`, \`totalSpent\`, \`status\`, \`lastActive\`, \`createdAt\`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              \`name\` = VALUES(\`name\`), \`email\` = VALUES(\`email\`), \`phone\` = VALUES(\`phone\`),
              \`avatar\` = VALUES(\`avatar\`), \`role\` = VALUES(\`role\`), \`ordersCount\` = VALUES(\`ordersCount\`),
              \`totalSpent\` = VALUES(\`totalSpent\`), \`status\` = VALUES(\`status\`), \`lastActive\` = VALUES(\`lastActive\`)
          `, [
            u.id, u.name, u.email, u.phone, u.password || 'password123',
            u.avatar || null, u.role || 'regular', u.joinedDate || '۱۴۰۴/۰۱/۰۱',
            u.ordersCount || 0, u.totalSpent || 0, u.status || 'active',
            u.lastActive || 'هم‌اکنون', u.createdAt || new Date().toISOString()
          ]);
        }
      }

      if (Array.isArray(data.orders)) {
        for (const o of data.orders) {
          await connection.query(`
            INSERT INTO \`orders\` (
              \`id\`, \`date\`, \`timestamp\`, \`customer\`, \`items\`, \`subtotal\`,
              \`discount\`, \`shipping\`, \`total\`, \`status\`, \`statusFa\`,
              \`paymentMethod\`, \`trackingNumber\`, \`courierName\`, \`estimatedDelivery\`, \`createdAt\`
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              \`status\` = VALUES(\`status\`), \`statusFa\` = VALUES(\`statusFa\`),
              \`trackingNumber\` = VALUES(\`trackingNumber\`), \`courierName\` = VALUES(\`courierName\`),
              \`estimatedDelivery\` = VALUES(\`estimatedDelivery\`)
          `, [
            o.id, o.date, o.timestamp || Date.now(),
            JSON.stringify(o.customer || {}), JSON.stringify(o.items || []),
            o.subtotal || o.total, o.discount || 0, o.shipping || 0, o.total,
            o.status, o.statusFa || o.status, o.paymentMethod || 'درگاه آنلاین',
            o.trackingNumber || null, o.courierName || null, o.estimatedDelivery || null,
            o.createdAt || new Date().toISOString()
          ]);
        }
      }

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      console.error('[MySQL] Transaction error syncing to MySQL:', err);
      throw err;
    } finally {
      connection.release();
    }
  }

  public async saveProduct(p: any): Promise<void> {
    if (!this.pool || !this.isConnected) return;
    try {
      await this.pool.query(`
        INSERT INTO \`products\` (
          \`id\`, \`name\`, \`nameFa\`, \`brand\`, \`price\`, \`originalPrice\`, \`discount\`,
          \`rating\`, \`reviewsCount\`, \`soldCount\`, \`stock\`, \`category\`,
          \`description\`, \`descriptionFa\`, \`images\`, \`primaryImage\`, \`specs\`,
          \`features\`, \`featuresFa\`, \`colors\`, \`variants\`, \`tags\`,
          \`isNew\`, \`isFeatured\`, \`isBestseller\`, \`isActive\`, \`sku\`,
          \`views\`, \`cartAdds\`, \`createdAt\`, \`updatedAt\`
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          \`name\` = VALUES(\`name\`), \`nameFa\` = VALUES(\`nameFa\`), \`brand\` = VALUES(\`brand\`),
          \`price\` = VALUES(\`price\`), \`originalPrice\` = VALUES(\`originalPrice\`), \`discount\` = VALUES(\`discount\`),
          \`rating\` = VALUES(\`rating\`), \`reviewsCount\` = VALUES(\`reviewsCount\`), \`soldCount\` = VALUES(\`soldCount\`),
          \`stock\` = VALUES(\`stock\`), \`category\` = VALUES(\`category\`), \`description\` = VALUES(\`description\`),
          \`descriptionFa\` = VALUES(\`descriptionFa\`), \`images\` = VALUES(\`images\`), \`primaryImage\` = VALUES(\`primaryImage\`),
          \`specs\` = VALUES(\`specs\`), \`features\` = VALUES(\`features\`), \`featuresFa\` = VALUES(\`featuresFa\`),
          \`colors\` = VALUES(\`colors\`), \`variants\` = VALUES(\`variants\`), \`tags\` = VALUES(\`tags\`),
          \`isNew\` = VALUES(\`isNew\`), \`isFeatured\` = VALUES(\`isFeatured\`), \`isBestseller\` = VALUES(\`isBestseller\`),
          \`isActive\` = VALUES(\`isActive\`), \`sku\` = VALUES(\`sku\`), \`views\` = VALUES(\`views\`),
          \`cartAdds\` = VALUES(\`cartAdds\`), \`updatedAt\` = VALUES(\`updatedAt\`)
      `, [
        p.id, p.name, p.nameFa, p.brand || 'Lumina', p.price, p.originalPrice || null, p.discount || 0,
        p.rating || 5.0, p.reviewsCount || 0, p.soldCount || 0, p.stock || 0, p.category,
        p.description || '', p.descriptionFa || '',
        JSON.stringify(p.images || []), p.primaryImage || (p.images && p.images[0]) || null,
        JSON.stringify(p.specs || {}), JSON.stringify(p.features || []), JSON.stringify(p.featuresFa || []),
        JSON.stringify(p.colors || []), JSON.stringify(p.variants || []), JSON.stringify(p.tags || []),
        p.isNew ? 1 : 0, p.isFeatured ? 1 : 0, p.isBestseller ? 1 : 0,
        p.isActive !== false ? 1 : 0, p.sku || `LUM-${p.id}`,
        p.views || 0, p.cartAdds || 0,
        p.createdAt || new Date().toISOString(), p.updatedAt || new Date().toISOString()
      ]);
    } catch (err) {
      console.error('[MySQL] Error saving product to MySQL:', err);
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    if (!this.pool || !this.isConnected) return;
    try {
      await this.pool.query('DELETE FROM `products` WHERE `id` = ?', [id]);
    } catch (err) {
      console.error('[MySQL] Error deleting product from MySQL:', err);
    }
  }
}

export const mySQLService = new MySQLService();
