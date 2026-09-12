import OpenAI from "openai";
import { env } from "./env";

const apiKey = env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn("OPENAI_API_KEY is not configured.");
    throw new Error('Open AI key is not configured');
}
export const openai = new OpenAI({
    apiKey
});

export const OPENAI_MODEL = env.OPENAI_MODEL;