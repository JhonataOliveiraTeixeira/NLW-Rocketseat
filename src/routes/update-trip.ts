import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClienteError } from "../erros/client-error";

export async function updateTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                destination: z.string().min(4),
                start_at: z.coerce.date(),
                ends_st: z.coerce.date(),
            })
        }
    }, async (request) => {
        const { tripId } = request.params
        const { destination, ends_st, start_at } = request.body

        const trip = await prisma.trip.findUnique({ where: { id: tripId } })

        if (!trip) {
            throw new ClienteError("Trip not found!")
        }

        if (dayjs(start_at).isBefore(new Date())) {
            throw new ClienteError("Invalid trip start date")
        }

        if (dayjs(ends_st).isBefore(start_at)) {
            throw new ClienteError("Invalid trip ends date")
        }

        await prisma.trip.update({
            where: { id: tripId },
            data: {
                destination,
                start_at,
                ends_st
            }
        })



        return { tripId: trip.id }


    })
}