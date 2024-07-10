import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../lib/prisma"

export async function confirmParticipant(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/participant/:participantId/confirm',
        {
            schema: {
                params: z.object({
                    participantId: z.string().uuid()
                })
            }
        },
        async (request, reply) => {
            try {
                const { participantId } = request.params

                const participant = await prisma.participant.findUnique({
                    where: { id: participantId }
                })

                if (!participant) {
                    return reply.status(404).send({ error: "Participant not found." })
                }

                if (participant.is_confirmed) {
                    return reply.status(200).send(participant.tripId)
                }

                await prisma.participant.update({
                    where: { id: participantId },
                    data: { is_confirmed: true }
                })

                return reply.status(200).send(participant.tripId)
            } catch (error) {
                app.log.error(error)
                return reply.status(500).send({ error: "Internal Server Error" })
            }
        }
    )
}
