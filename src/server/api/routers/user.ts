import { z } from "zod";
import { userRepository } from "~/entities/user/repositories/user-repository";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ login: z.string(), password: z.string() }))
        .mutation(({ input }) => {
            return userRepository.userCreate(input.login, input.password);
        }),

    updateRating: protectedProcedure
        .input(z.object({ delta: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return userRepository.userUpdateRating(ctx.session.user.id, input.delta);
        }),
});

