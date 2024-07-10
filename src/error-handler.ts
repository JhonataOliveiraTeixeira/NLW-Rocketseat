import { FastifyInstance } from "fastify"
import { ClienteError } from "./erros/client-error"
import { ZodError } from "zod"

type fastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: fastifyErrorHandler = (error, request, reply) => {

    if (error instanceof ZodError) {
        return reply.status(400).send({
            mensage: 'Inavlid Input',
            erros: error.flatten().fieldErrors
        })
    }

    if (error instanceof ClienteError) {
        return reply.status(400).send({
            mensage: error.message
        })
    }

    return reply.status(500).send({
        code: error,
        mensage: error.message,

    })
}