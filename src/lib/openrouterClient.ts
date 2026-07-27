import OpenAI from "openai";

export const orClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://ramsgen.co.uk",
    "X-Title": "RAMS Generator",
  },
});
