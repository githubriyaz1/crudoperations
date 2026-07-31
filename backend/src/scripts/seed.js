import { connectMongoDB } from "../config/database.js";
import { env } from "../config/env.js";
import { USER_ROLES, USER_STATUSES } from "../constants/roles.js";
import { Category } from "../models/Category.model.js";
import { Coupon } from "../models/Coupon.model.js";
import { Product } from "../models/Product.model.js";
import { StoreSettings } from "../models/StoreSettings.model.js";
import { User } from "../models/User.model.js";
import { logger } from "../utils/logger.js";

export async function runAutoSeed() {
  try {
    // 1. Seed Store Settings
    const existingSettings = await StoreSettings.findOne();
    if (!existingSettings) {
      await StoreSettings.create({
        storeName: "Love2Bazzar",
        email: "nellaiestates26@gmail.com",
        phone: "+91 98765 43210",
        address: "Jaipur Jewellery Market, Rajasthan, India",
        announcementText: "Flat 10% OFF on First Order | Code: WELCOME10",
        announcementActive: true,
        shippingThreshold: 999,
        shippingCharge: 99,
        primaryColor: "#d4af37",
      });
      logger.info("Default Store Settings seeded.");
    } else if (existingSettings.email !== "nellaiestates26@gmail.com") {
      existingSettings.email = "nellaiestates26@gmail.com";
      await existingSettings.save();
    }

    // 2. Seed / Update Admin User
    const email = env.ADMIN_EMAIL?.trim().toLowerCase() || "nellaiestates26@gmail.com";
    const password = env.ADMIN_PASSWORD || "Love008322";

    const passwordHash = await User.hashPassword(password);
    const existingAdmin = await User.findOne({ $or: [{ email }, { role: USER_ROLES.ADMIN }] });
    
    if (!existingAdmin) {
      await User.create({
        name: "Love2Bazzar Admin",
        email,
        phone: "+91 98765 43210",
        passwordHash,
        role: USER_ROLES.ADMIN,
        status: USER_STATUSES.ACTIVE,
        joinedAt: new Date(),
      });
      logger.info(`Admin user created: ${email}`);
    } else {
      existingAdmin.email = email;
      existingAdmin.role = USER_ROLES.ADMIN;
      existingAdmin.status = USER_STATUSES.ACTIVE;
      existingAdmin.passwordHash = passwordHash;
      await existingAdmin.save();
      logger.info(`Admin user updated to: ${email}`);
    }

    // 3. Seed Default Categories if empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const seedCats = [
        { name: "Rings", slug: "rings", sortOrder: 1, isActive: true },
        { name: "Necklaces", slug: "necklaces", sortOrder: 2, isActive: true },
        { name: "Earrings", slug: "earrings", sortOrder: 3, isActive: true },
        { name: "Bangles", slug: "bangles", sortOrder: 4, isActive: true },
        { name: "Gift Sets", slug: "giftsets", sortOrder: 5, isActive: true },
        { name: "Bracelets", slug: "bracelets", sortOrder: 6, isActive: true },
      ];
      await Category.insertMany(seedCats);
      logger.info("Default categories seeded.");
    }

    // 4. Seed Default Coupons if empty
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany([
        {
          code: "WELCOME10",
          discountPercent: 10,
          minSpend: 799,
          maxDiscount: 250,
          usageLimit: 1000,
          isActive: true,
        },
        {
          code: "GIFT150",
          discountAmount: 150,
          minSpend: 1499,
          usageLimit: 500,
          isActive: true,
        },
      ]);
      logger.info("Default coupons seeded.");
    }
  } catch (err) {
    logger.warn(`Auto-seed warning: ${err.message}`);
  }
}

if (process.argv[1]?.endsWith("seed.js")) {
  connectMongoDB()
    .then(async () => {
      await runAutoSeed();
      logger.info(`Seed complete for ${env.NODE_ENV} environment.`);
      process.exit(0);
    })
    .catch((err) => {
      logger.error("Seed execution error", err);
      process.exit(1);
    });
}
