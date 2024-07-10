import { fastify } from "fastify"
import { createTrip } from "./routes/create_trip"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmtrip } from "./routes/confirm-trip";
import { confirmParticipant } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activiti";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participant";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmtrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)


app.listen({
    port: 3333
}).then(() => {
    console.log("HTTP Server running!")
})
