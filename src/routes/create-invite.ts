import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/email";
import nodemailer from "nodemailer"
import { CLIENT_RENEG_LIMIT } from "tls";
import { ClienteError } from "../erros/client-error";
import { env } from "../env";


export async function createInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invite', {

        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                email: z.string().email()

            })
        }
    }, async (request) => {
        const { tripId } = request.params
        const { email } = request.body

        const trip = await prisma.trip.findUnique({ where: { id: tripId } })

        if (!trip) {
            throw new ClienteError("Trip not found!")
        }


        const participant = await prisma.participant.create({
            data: {
                email,
                trip_id: { connect: { id: tripId } }
            }
        })

        const emailClient = await getMailClient()

        const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`
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



        return { participantId: participant.id }

    })
}
