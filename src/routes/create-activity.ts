import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";


export async function createActivity(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activities', {

        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                title: z.string().min(4),
                occur_at: z.coerce.date(),
            })
        }
    }, async (request) => {
        const { tripId } = request.params
        const { title, occur_at } = request.body

        const trip = await prisma.trip.findUnique({ where: { id: tripId } })

        if (!trip) {
            throw new Error("Trip not found!")
        }

        if (dayjs(occur_at).isBefore(trip?.start_at)) {
            throw new Error("Invalid activitie date")

        }

        if (dayjs(occur_at).isBefore(trip?.start_at)) {
            throw new Error("Invalid activitie date")

        }

        const activity = await prisma.activity.create({
            data: {
                title,
                occur_at,
                tripId: tripId
            }
        })

        return { activityID: activity.id }

    })
}
