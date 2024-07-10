import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClienteError } from "../erros/client-error";

export async function getParticipantDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantsId', {
        schema: {
            params: z.object({
                participantsId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { participantsId } = request.params


        const participant = await prisma.participant.findUnique({
            where: { id: participantsId },
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true
            }
        }
        )

        if (!participant) {
            throw new ClienteError("Participant not found!")
        }




        return { participant: participant }


    })
}