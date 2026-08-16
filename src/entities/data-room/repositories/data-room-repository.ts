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

async function dataRoomRename(id: string, name: string): Promise<DataRoom> {
    const updated = await prisma.dataRoom.update({
        where: { id },
        data: { name },
    });
    return dbDataRoomToEntity(updated);
}

async function dataRoomDelete(id: string): Promise<void> {
    await prisma.dataRoom.delete({ where: { id } });
}

function dbDataRoomToEntity(room: PrismaDataRoom): DataRoom {
    return {
        id: room.id,
        name: room.name,
    };
}

export const dataRoomRepository = { dataRoomList, dataRoomCreate, dataRoomRename, dataRoomDelete };