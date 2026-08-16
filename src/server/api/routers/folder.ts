import { z } from "zod";
import { folderRepository } from "~/entities/folder/repositories/folder-repository";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const folderRouter = createTRPCRouter({
    list: protectedProcedure
        .input(z.object({ dataRoomId: z.string(), parentId: z.string().nullable() }))
        .query(({ input }) => {
            return folderRepository.folderList(input.dataRoomId, input.parentId);
        }),

    create: protectedProcedure
        .input(z.object({ name: z.string().min(1).max(255), dataRoomId: z.string(), parentId: z.string().nullable() }))
        .mutation(({ input }) => {
            return folderRepository.folderCreate(input.name, input.dataRoomId, input.parentId);
        }),
    getByIds: protectedProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .query(({ input }) => {
            return folderRepository.folderGetByIds(input.ids);
        }),
    rename: protectedProcedure
        .input(z.object({ name: z.string().min(1).max(255), id: z.string() }))
        .mutation(({ input }) => {
            return folderRepository.folderRename(input.id, input.name);
        }),
    countSubtree: protectedProcedure
        .input(z.object({ folderId: z.string() }))
        .query(({ input }) => folderRepository.folderCountSubtree(input.folderId)),

    delete: protectedProcedure
        .input(z.object({ folderId: z.string() }))
        .mutation(({ input }) => folderRepository.folderDelete(input.folderId)),

    listAll: protectedProcedure
        .input(z.object({ dataRoomId: z.string() }))
        .query(({ input }) => folderRepository.folderListAll(input.dataRoomId)),
});