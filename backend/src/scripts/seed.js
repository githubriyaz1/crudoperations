import { connectMongoDB } from "../config/database.js";
import { env } from "../config/env.js";
import { USER_ROLES, USER_STATUSES } from "../constants/roles.js";
import { User } from "../models/User.model.js";
import { logger } from "../utils/logger.js";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    logger.warn("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an admin account.");
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = USER_ROLES.ADMIN;
    existing.status = USER_STATUSES.ACTIVE;
    await existing.save();
    logger.info(`Admin account already exists and is active: ${email}`);
    return;
  }

  const passwordHash = await User.hashPassword(password);
  await User.create({
    name: "Love2Bazzar Admin",
    email,
    phone: "",
    passwordHash,
    role: USER_ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE,
    joinedAt: new Date(),
  });
  logger.info(`Admin account seeded: ${email}`);
}

await connectMongoDB();
await seedAdmin();

logger.info(`Seed complete for ${env.NODE_ENV} environment.`);
process.exit(0);
