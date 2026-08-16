import type { User } from "~/entities/user/domain";
import type { User as PrismaUser } from "@prisma/client";
import { db as prisma } from "~/shared/lib/db";
import bcrypt from "bcryptjs";

async function userList(): Promise<User[]> {
        const users = await prisma.user.findMany({
            include: {
                games: true,
            },
            orderBy: {
                rating: "desc",
            },
        });
        return users.map(dbUserToDbUserEntity);
}

async function userCreate(login: string, password: string): Promise<User> {
    const existing = await prisma.user.findFirst({
        where: { login },
    });

    if (existing) {
        throw new Error("Login already exists. Choose something oRiGiNaL.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            login,
            passwordHash,
        },
    });

    return dbUserToDbUserEntity(user);
}

function dbUserToDbUserEntity(user: PrismaUser): User {
    return {
        id: user.id,
        login: user.login,
    };
}

async function userUpdateRating(id: string, delta: number): Promise<User> {
    const user = await prisma.user.update({
        where: { id },
        data: { rating: { increment: delta } },
    });
    return dbUserToDbUserEntity(user);
}

export const userRepository = { userList, userCreate, userUpdateRating };