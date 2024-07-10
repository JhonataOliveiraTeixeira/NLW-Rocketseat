import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import nodemailer from "nodemailer"
import z from "zod"
import { getMailClient } from "../lib/email"
import { prisma } from "../lib/prisma"

export async function confirmtrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/trips/:tripID/confirm',
        {
            schema: {
                params: z.object({
                    tripID: z.string().uuid()
                })
            }
        },
        async (request, reply) => {
            const { tripID } = request.params

            const trip = await prisma.trip.findUnique({
                where: { id: tripID },
                include: {
                    participants: {
                        where: { is_owner: false }
                    }
                }
            })

            if (!trip) {
                return reply.status(404).send({ error: "Trip not found." })
            }

            if (trip.is_confirmed) {
                return reply.status(200).send("Trip is confirmed before")
            }

            await prisma.trip.update({
                where: { id: tripID },
                data: { is_confirmed: true }
            })

            const emailClient = await getMailClient()

            await Promise.all(
                trip.participants.map(async (participant) => {
                    const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`
                    const message = await emailClient.sendMail({
                        from: {
                            name: "Equipe plann.er",
                            address: "Teste@plannn.er"
                        },
                        to: participant.email,
                        subject: "Confirme sua viagem para " + trip.destination + ".",
                        html: `<p>Teste envio de e-mail: <a href="${confirmationLink}">${confirmationLink}</a></p>`
                    })
                    console.log(nodemailer.getTestMessageUrl(message))
                })
            )

            return reply.status(200).send("Trip confirmed Now")
        }
    )
}
