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
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTrip } from "./routes/get-trip-details";
import { getParticipantDetails } from "./routes/get-participant-details";
import { errorHandler } from "./error-handler";
import { env } from "./env";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler)

app.register(createTrip)
app.register(confirmtrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTrip)
app.register(getParticipantDetails)



app.listen({
    port: env.PORT
}).then(() => {
    console.log("HTTP Server running!")
})
