import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Status, TaskStatus, Tariff, Role } from "../src/generated/prisma/client.js";
import * as bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(){
    await prisma.usersInOrganizations.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    const projects = [
        { title: "First Michael`s Project" },
        { title: "Second Michael`s Project" },
        { title: "First Dexter`s Project" },
    ]

    const orgs = [
        { title: "Michael`s Organization", tariff: Tariff.FREE },
        { title: "Dexter`s Company", tariff: Tariff.PRO }
    ];

    const tasks = [
        { title: "Task 1", description: "Task1 description", status: TaskStatus.PROGRESS, priority: 8, deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1) },
        { title: "Some task", description: "Some description", status: TaskStatus.PROGRESS, priority: 4, deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) },
        { title: "Tasktask", status: TaskStatus.PAUSED, priority: 10, deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6) },
        { title: "Mystery task" }
    ]

    const users = [
        { email: "example0@gmail.com", password: await bcrypt.hash("0123456789", 10), name: "Michael S." },
        { email: "example1@gmail.com", password: await bcrypt.hash("0123456789", 10), name: "Lana D." },
        { email: "example2@gmail.com", password: await bcrypt.hash("0123456789", 10), name: "Johan B." },
        { email: "example3@gmail.com", password: await bcrypt.hash("0123456789", 10), name: "Ben C." },
        { email: "example4@gmail.com", password: await bcrypt.hash("0123456789", 10), name: "Bill J." },
        { email: "example5@gmail.com", password: await bcrypt.hash("0123456789", 10), name: "Dexter M." }
    ];

    const dbUsers = await prisma.user.createManyAndReturn({
        data: users
    });
  
    const firstOrg = await prisma.organization.create({
        data: {
            title: orgs[0].title,
            tariff: orgs[0].tariff,
            members: {
                create: [
                    { userId: dbUsers[0].id, role: Role.OWNER },
                    { userId: dbUsers[1].id, role: Role.ADMIN },
                    { userId: dbUsers[2].id, role: Role.MEMBER },
                    { userId: dbUsers[5].id, role: Role.MEMBER }
                ]
            }
        }
    });
    const secondOrg = await prisma.organization.create({
        data: {
            title: orgs[1].title,
            tariff: orgs[1].tariff,
            members: {
                create: [
                    { userId: dbUsers[5].id, role: Role.OWNER },
                    { userId: dbUsers[2].id, role: Role.ADMIN },
                    { userId: dbUsers[3].id, role: Role.MEMBER },
                    { userId: dbUsers[4].id, role: Role.MEMBER },
                ]
            }
        }
    });

    const dbProjects = await prisma.project.createManyAndReturn({
        data: [
            { title: projects[0].title, orgId: firstOrg.id, status: Status.ACTIVE },
            { title: projects[1].title, orgId: firstOrg.id, status: Status.ACTIVE },
            { title: projects[2].title, orgId: secondOrg.id, status: Status.PAUSED }
        ]
    });

    await prisma.task.create({
        data: {
            title: tasks[0].title,
            projectId: dbProjects[0].id,
            description: tasks[0].description,
            priority: tasks[0].priority,
            deadline: tasks[0].deadline,
            status: tasks[0].status,
            assigned: {
                connect: [
                    { id: dbUsers[0].id },
                    { id: dbUsers[1].id }
                ],
            }
        }
    });
    await prisma.task.create({
        data: {
            title: tasks[1].title,
            projectId: dbProjects[0].id,
            description: tasks[1].description,
            priority: tasks[1].priority,
            deadline: tasks[1].deadline,
            status: tasks[1].status,
            assigned: {
                connect: [
                    { id: dbUsers[2].id },
                    { id: dbUsers[5].id }
                ]
            }
        }
    });
    await prisma.task.create({
        data: {
            title: tasks[2].title,
            projectId: dbProjects[1].id,
            description: tasks[2].description,
            priority: tasks[2].priority,
            deadline: tasks[2].deadline,
            status: tasks[2].status,
            assigned: {
                connect: [
                    { id: dbUsers[1].id },
                    { id: dbUsers[2].id }
                ]
            }
        }
    });
    await prisma.task.create({
        data: {
            title: tasks[3].title,
            projectId: dbProjects[2].id,
            description: tasks[3].description,
            priority: tasks[3].priority,
            deadline: tasks[3].deadline,
            status: tasks[3].status,
            assigned: {
                connect: [
                    { id: dbUsers[3].id },
                    { id: dbUsers[4].id },
                    { id: dbUsers[5].id }
                ]
            }
        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });