import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import nodemailer from "nodemailer"
import z from "zod"
import { getMailClient } from "../lib/email"
import { prisma } from "../lib/prisma"

export function confirmtrip(app:FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get(
        '/trips/:ytipsId/confirm',
        {
            schema:{
                params: z.object({
                    tripID: z.string().uuid()
                })
            }
        },
        async (request, reply)=>{

            const {tripID} = request.params
            const trip = await prisma.trip.findUnique({
                where:{
                    id: tripID
                },
                include:{
                    participants:{
                        where:{
                            is_owner: false
                        }
                    }
                }
            })

            if(!trip){
                throw new Error(`Trip not found.`)
            }
            
            if(trip.is_confirmed){
                return reply.status(201).send()
            }

            await prisma.trip.update({
                where:{id: tripID},
                data:{
                    is_confirmed: true
                }
            })

            
            const emailClient = await getMailClient()
            
            await Promise.all(
                trip.participants.map( async (participants)=>{
                    const confirmationLink = `http://localhost:3333/participants/${participants.id}/confirm`
                    const mensage = await emailClient.sendMail({
                        from: {
                            name: "Equipe plann.er",
                            address: "Teste@plannn.er"
                        },
                        to: participants.email,
                        subject: "Confirme sua viagem para "+trip.destination+".",
                        html: `<p>Teste envio de e-mail${confirmationLink}</p>`
            
                    }
                    )
                    console.log(nodemailer.getTestMessageUrl(mensage))
            
                })
            )
    

            return reply.status(201).send()
        }
    )
}