import z from "zod";

const encSchema = z.object({
    DATABASE_URL: z.string().url(),
    API_BASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3333)
})
export const env = encSchema.parse(process.env)