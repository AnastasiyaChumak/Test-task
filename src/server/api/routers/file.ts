import { z } from "zod";
import { fileRepository } from "~/entities/file/repositories/file-repository";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fileRouter = createTRPCRouter({
    list: protectedProcedure
        .input(z.object({ dataRoomId: z.string(), folderId: z.string().nullable() }))
        .query(({ input }) => {
            return fileRepository.fileList(input.dataRoomId, input.folderId);
        }),

    create: protectedProcedure
        .input(z.object({ name: z.string().min(1).max(255), blobUrl: z.string(), size: z.number(), mimeType: z.string(), dataRoomId: z.string(), folderId: z.string().nullable() }))
        .mutation(({ input }) => {
            return fileRepository.fileCreate(input.name, input.blobUrl, input.size, input.mimeType, input.dataRoomId, input.folderId);
        }),
});