import { database_url } from "../env";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ database_url })

const client = new PrismaClient({ adapter });

export default client;