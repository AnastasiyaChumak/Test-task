import type { Folder } from "~/entities/folder/domain";
import type { Folder as PrismaFolder } from "@prisma/client";
import { db as prisma } from "~/shared/lib/db";

async function folderList(dataRoomId: string, parentId: string | null): Promise<Folder[]> {

    const folders = await prisma.folder.findMany({
        where: { dataRoomId, parentId },
        orderBy: { createdAt: "desc" },
    });
    return folders.map(dbFolderToEntity);
}

async function folderCreate(
    name: string,
    dataRoomId: string,
    parentId: string | null
): Promise<Folder> {
    let path = "/";
    if (parentId) {
        const parent = await prisma.folder.findUniqueOrThrow({
            where: { id: parentId },
        });
        path = parent.path;
    }

    const folder = await prisma.folder.create({
        data: { name, dataRoomId, parentId, path },
    });

    const updated = await prisma.folder.update({
        where: { id: folder.id },
        data: { path: `${path}${folder.id}/` },
    });

    return dbFolderToEntity(updated);
}

async function folderRename(id: string, name: string): Promise<Folder> {
    const updated = await prisma.folder.update({
        where: { id },
        data: { name },
    });
    return dbFolderToEntity(updated);
}

function dbFolderToEntity(folders: PrismaFolder): Folder {
    return {
        id: folders.id,
        name: folders.name,
        path: folders.path,
    };
}

async function folderGetByIds(ids: string[]): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
        where: { id: { in: ids } },
    });
    const foldersMap = new Map(folders.map((f) => [f.id, f]));
    const ordered = ids.map((id) => foldersMap.get(id)!);
    return ordered.map(dbFolderToEntity);
}

async function folderCountSubtree(folderId: string): Promise<{ folders: number; files: number }> {
    const target = await prisma.folder.findUniqueOrThrow({ where: { id: folderId } });

    const subtreeFolders = await prisma.folder.findMany({
        where: { path: { startsWith: target.path } },
        select: { id: true },
    });
    const folderIds = subtreeFolders.map((f) => f.id);

    const filesCount = await prisma.file.count({
        where: { folderId: { in: folderIds } },
    });

    return { folders: subtreeFolders.length, files: filesCount };
}

async function folderDelete(folderId: string): Promise<void> {
    const target = await prisma.folder.findUniqueOrThrow({ where: { id: folderId } });

    await prisma.folder.deleteMany({
        where: { path: { startsWith: target.path } },
    });
}

export const folderRepository = { folderList, folderCreate, folderGetByIds, folderRename, folderCountSubtree, folderDelete };