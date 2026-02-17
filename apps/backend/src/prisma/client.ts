import { database_url } from "../env";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${database_url}`;

const adapter = new PrismaPg({ connectionString })

const client = new PrismaClient({ adapter });

export default client;