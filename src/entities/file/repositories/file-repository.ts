import type { File } from "~/entities/file/domain";
import type { File as PrismaFile } from "@prisma/client";
import { db as prisma } from "~/shared/lib/db";

async function fileList(dataRoomId: string, folderId: string | null): Promise<File[]> {
    const files = await prisma.file.findMany({
        where: { dataRoomId, folderId },
        orderBy: { createdAt: "desc" },
    });
    return files.map(dbFileToEntity);
}

async function fileCreate(name: string, blobUrl: string, size: number, mimeType: string, dataRoomId: string, folderId: string | null): Promise<File> {
    const existing = await prisma.file.findFirst({ where: { name, folderId, dataRoomId } });
    if (existing) {
        throw new Error("File already exists. Choose something oRiGiNaL.");
    }

    const created = await prisma.file.create({
        data: { name, blobUrl, size, folderId, mimeType, dataRoom: { connect: { id: dataRoomId } } },
    });

    return dbFileToEntity(created);
}

function dbFileToEntity(file: PrismaFile): File {
    return {
        id: file.id,
        name: file.name,
        blobUrl: file.blobUrl,
    };
}

export const fileRepository = { fileList, fileCreate };