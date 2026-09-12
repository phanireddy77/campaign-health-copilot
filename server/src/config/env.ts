import "dotenv/config";
import { z } from "zod";
import { OPENAI_MODEL } from "./openai";

const envConfigSchema = z.object({
    NODE_ENV: z
            .enum(["PROD", "STAGE", "DEVELOPMENT"])
            .default("DEVELOPMENT"),
    PORT: z.coerce
            .number()
            .int()
            .positive()
            .default(3001),
    DATABASE_HOST: z
                .string()
                .min(1),
    DATABASE_PORT: z.coerce
                .number()
                .int()
                .positive()
                .default(5432),
    DATABASE_NAME: z
                .string()
                .min(1),
    DATABASE_USER: z
                .string()
                .min(1),
    DATABASE_PASSWORD: z
                    .string()
                    .min(1),
    CORS_ORIGIN: z
            .string()
            .default("http://localhost:5173"),       
    OPENAI_API_KEY: z
                    .string()
                    .min(1),
    OPENAI_MODEL: z
                .string()
                .default('gpt-5.6-terra')
});

const parsed = envConfigSchema.safeParse(process.env);

if (!parsed.success) {
   console.error(
    "Invalid environment configuration:"
  );

  console.error(
    parsed.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = parsed.data;