import { fastify } from "fastify"
import { createTrip } from "./routes/create_trip"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmtrip } from "./routes/confirm-trip";
import { confirmParticipant } from "./routes/confirm-participant";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmtrip)
app.register(confirmParticipant)

app.listen({
    port: 3333
}).then(() => {
    console.log("HTTP Server running!")
})
