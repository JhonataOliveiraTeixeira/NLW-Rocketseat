import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { map } from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import { getMailClient } from "../lib/email"
import nodemailer from "nodemailer"

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
            body: z.object({
                destination: z.string().min(4),
                start_at: z.coerce.date(),
                ends_st: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email())
            })
        }
    }, async (request) => {
        const { destination, ends_st, start_at, owner_name, owner_email, emails_to_invite } = request.body

        if (dayjs(start_at).isBefore(new Date())) {
            throw new Error("Invalid trip start date")
        }

        if (dayjs(ends_st).isBefore(start_at)) {
            throw new Error("Invalid trip ends date")
        }



        const trip = await prisma.trip.create({
            data: {
                destination,
                start_at,
                ends_st,
                participants: {
                    createMany: {
                        data: [
                            {
                                name: owner_name,
                                email: owner_email,
                                is_confirmed: true,
                                is_owner: true
                            },
                            ...emails_to_invite.map(email => {
                                return { email }
                            })
                        ],
                    }
                }
            }
        })

        const emailClient = await getMailClient()

        const mensage = await emailClient.sendMail({
            from: {
                name: "Equipe plann.er",
                address: "Teste@plannn.er"
            },
            to: {
                name: owner_name,
                address: owner_email
            },
            subject: "Testando envio de e-mail",
            html: `<p>Teste envio de e-mail</p>`

        }
        )
        console.log(nodemailer.getTestMessageUrl(mensage))

        return { tripId: trip.id }


    })
}