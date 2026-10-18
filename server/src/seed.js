// Run with: npm run seed
// Replaces all products with the demo data and creates/updates the admin login.
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Admin from './models/Admin.js';
import products from './seedData.js';

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
await Product.deleteMany({});
await Product.insertMany(products);
await Admin.createWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
console.log(`Seeded ${products.length} products and admin ${ADMIN_EMAIL}`);
await mongoose.disconnect();
