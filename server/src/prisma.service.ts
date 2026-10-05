import { Injectable } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor () {
        const connectionString = `${process.env.DATABASE_URL}`;
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        super({ adapter });
    }
}