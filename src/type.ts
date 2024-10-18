import { z } from "zod";

export const ExtractorOutput = z.object({
  keyconcepts: z.array(z.string()),
  knowledgeDepth: z.string(),
  relatedKnowledge: z.array(z.string()),
  learningOutcomes: z.array(z.string()),
  analysis: z.string(),
});

export type ExtractorOutput = z.infer<typeof ExtractorOutput>;
