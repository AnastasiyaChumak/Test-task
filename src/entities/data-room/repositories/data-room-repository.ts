import type { DataRoom } from "~/entities/data-room/domain";
import type { DataRoom as PrismaDataRoom } from "@prisma/client";
import { db as prisma } from "~/shared/lib/db";

async function dataRoomList(ownerId: string): Promise<DataRoom[]> {
    const rooms = await prisma.dataRoom.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
    });
    return rooms.map(dbDataRoomToEntity);
}

async function dataRoomCreate(name: string, ownerId: string): Promise<DataRoom> {
    const room = await prisma.dataRoom.create({
        data: { name, ownerId },
    });
    return dbDataRoomToEntity(room);
}

function dbDataRoomToEntity(room: PrismaDataRoom): DataRoom {
    return {
        id: room.id,
        name: room.name,
    };
}

export const dataRoomRepository = { dataRoomList, dataRoomCreate };