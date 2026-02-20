import dotenv from 'dotenv';
// dotenv.config();
const envFile = process.env.NODE_ENV === 'development' ? '.env.local' : '.env.production';
dotenv.config({ path: envFile });
import { defineConfig, env } from "prisma/config";


export default defineConfig({
   schema: "prisma/schema.prisma",
   migrations: {
     path: "prisma/migrations"
   },
   datasource: {
      url: env("DATABASE_URL"),
   },
});