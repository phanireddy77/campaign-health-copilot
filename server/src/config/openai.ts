import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn("OPENAI_API_KEY is not configured.");
    throw new Error('Open AI key is not configured');
}
export const openai = new OpenAI({
    apiKey
});

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'openai-gpt5.6-terra';