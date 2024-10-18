import { ChatAnthropic } from "@langchain/anthropic";

export const modelSonnent = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0.2,
  verbose: true,
  apiKey: process.env.API_KEY,
});

export const modelHaiku = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
  temperature: 0,
  // verbose: true,
  apiKey: process.env.API_KEY,
});
