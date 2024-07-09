import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../lib/prisma"

export function confirmParticipant(app:FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get(
        '/participant/:participantId/confirm',
        {
            schema:{
                params: z.object({
                    participantId: z.string().uuid()
                })
            }
        },
        async (request, reply)=>{

            const { participantId } = request.params

            const participant = await prisma.participant.findUnique({
                where:{
                    id:participantId
                }
            })

            if(!participant){
                throw new Error ("Participant not found.")
            }

            if(participant.is_confirmed){
                return reply.status(201).send(participant.tripId)
            }

            await prisma.participant.update({
                where:{id:participantId},
                data:{is_confirmed:true}
            })
            
            return reply.status(201).send(participant.tripId)
        }
    )
}