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
    const finalName = await generateUniqueFileName(name, dataRoomId, folderId);

    const created = await prisma.file.create({
        data: { name: finalName, blobUrl, size, folderId, mimeType, dataRoomId },
    });

    return dbFileToEntity(created);
}

async function generateUniqueFileName(name: string, dataRoomId: string, folderId: string | null): Promise<string> {
    const existing = await prisma.file.findFirst({ where: { name, folderId, dataRoomId } });
    if (!existing) return name;

    const dotIndex = name.lastIndexOf(".");
    const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
    const ext = dotIndex > 0 ? name.slice(dotIndex) : "";

    let counter = 1;
    let candidate = `${base} (${counter})${ext}`;
    while (await prisma.file.findFirst({ where: { name: candidate, folderId, dataRoomId } })) {
        counter++;
        candidate = `${base} (${counter})${ext}`;
    }
    return candidate;
}

function dbFileToEntity(file: PrismaFile): File {
    return {
        id: file.id,
        name: file.name,
        blobUrl: file.blobUrl,
        folderId: file.folderId,
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