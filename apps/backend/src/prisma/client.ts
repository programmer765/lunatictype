// import dotenv from 'dotenv';
// // dotenv.config();
// const envFile = process.env.NODE_ENV === 'development' ? '.env.local' : '.env.production';
// dotenv.config({ path: envFile });
import { database_url } from "../env";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(database_url)
console.log(database_url)
const client = new PrismaClient({ adapter });

export default client;