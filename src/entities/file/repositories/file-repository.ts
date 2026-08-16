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
        data: { name, blobUrl, size, folderId, mimeType, dataRoomId },
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

async function fileRename(id: string, name: string): Promise<File> {
    const updated = await prisma.file.update({
        where: { id },
        data: { name },
    });
    return dbFileToEntity(updated);
}

async function fileDelete(id: string): Promise<void> {
    await prisma.file.delete({ where: { id } });
}

async function fileMove(id: string, folderId: string | null): Promise<File> {
    const updated = await prisma.file.update({
        where: { id },
        data: { folderId },
    });
    return dbFileToEntity(updated);
}

export const fileRepository = { fileList, fileCreate, fileRename, fileDelete, fileMove };