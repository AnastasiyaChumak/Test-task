import { z } from "zod";
import { dataRoomRepository } from "~/entities/data-room/repositories/data-room-repository";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dataRoomRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return dataRoomRepository.dataRoomList(ctx.session.user.id);
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(255) }))
    .mutation(({ ctx, input }) => {
      return dataRoomRepository.dataRoomCreate(input.name, ctx.session.user.id);
    }),
});