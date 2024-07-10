import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClienteError } from "../erros/client-error";

export async function getTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request) => {
        const { tripId } = request.params


        const trip = await prisma.trip.findUnique({
            select: {
                id: true,
                destination: true,
                created_at: true,
                ends_st: true,
                is_confirmed: true


            },
            where: { id: tripId }
        })

        if (!trip) {
            throw new ClienteError("Trip not found!")
        }




        return { tripId: trip }


    })
}