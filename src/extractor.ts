import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { z } from "zod";
import { modelSonnent, modelHaiku } from "./models";
import { ExtractorOutput } from "./type";

const parser = StructuredOutputParser.fromZodSchema(ExtractorOutput);

const parserWithFix = OutputFixingParser.fromLLM(modelHaiku, parser);

const prompt = `
###Instruction###
You are an expert knowledge extraction and analysis AI. Your task is to extract, analyze, and generate knowledge from the given quiz or question. You MUST follow these steps:

1. Extract key concepts and topics from the quiz/question.
2. Analyze the depth of knowledge required to answer.
3. Generate related knowledge and connections to broader topics.
4. Provide insights on potential learning outcomes.
5. Analyze the question and answer in a structured manner.

Think step by step. Ensure your answer is unbiased and does not rely on stereotypes. Answer in a natural, human-like manner.

Additionally, you MUST follow this problem-solving framework:

Begin by enclosing all thoughts within <thinking> tags, exploring multiple angles and approaches.
Break down the solution into clear steps within <step> tags. Start with a 20-step budget, requesting more for complex problems if needed.
Use <count> tags after each step to show the remaining budget. Stop when reaching 0.
Continuously adjust your reasoning based on intermediate results and reflections, adapting your strategy as you progress.
Regularly evaluate progress using <reflection> tags. Be critical and honest about your reasoning process.
Assign a quality score between 0.0 and 1.0 using <reward> tags after each reflection. Use this to guide your approach:

0.8+: Continue current approach
0.5-0.7: Consider minor adjustments
Below 0.5: Seriously consider backtracking and trying a different approach

If unsure or if reward score is low, backtrack and try a different approach, explaining your decision within <thinking> tags.
For mathematical problems, show all work explicitly using LaTeX for formal notation and provide detailed proofs.
Explore multiple solutions individually if possible, comparing approaches in reflections.
Use thoughts as a scratchpad, writing out all calculations and reasoning explicitly.
Synthesize the final answer within <answer> tags, providing a clear, concise summary.
Conclude with a final reflection on the overall solution, discussing effectiveness, challenges, and solutions. Assign a final reward score.

You will be penalized if you do not follow this framework precisely.

In the answer tag, You MUST provide the following information in a structured format:

<keyconcepts>
    <concept>Concept 1</concept>
    <concept>Concept 2</concept>
    <concept>Concept 3</concept>
</keyconcepts>
<knowledgeDepth>
    This question requires an understanding of ...
</knowledgeDepth>
<relatedKnowledge>
    <knowledge>Knowledge 1</knowledge>
    <knowledge>Knowledge 2</knowledge>
    <knowledge>Knowledge 3</knowledge>
</relatedKnowledge>
<learningOutcomes>
    <outcome>Outcome 1</outcome>
    <outcome>Outcome 2</outcome>
    <outcome>Outcome 3</outcome>
</learningOutcomes>
<analysis>
    To solve this problem, we need to ...
</analysis>
`;

const examples: { question: string; answer: string }[] = [
  {
    question: `
Given a cluster with 16 computers that can perfectly run a parallel task without any

overhead. We have a program that is 20% serial and 80% parallelizable. What is the speed-
up of the program when it runs on this cluster according to Gustafson's law?
    `,
    answer: `
<thinking>
To approach this problem, we need to understand Gustafson's law and how it applies to parallel computing. Let's break down the given information and then apply the law step by step.

Given:
- 16 computers in the cluster
- Perfect parallelization (no overhead)
- Program is 20% serial and 80% parallelizable
- We need to calculate speedup using Gustafson's law

Gustafson's law is used to calculate the theoretical speedup in latency of the execution of a task at a fixed execution time that can be expected of a system when the number of processors is increased.

Let's proceed with the solution.
</thinking>

<step>Recall Gustafson's law formula</step>
<count>19</count>

<thinking>
Gustafson's law is expressed as:

S(n) = n - α * (n - 1)

Where:
S(n) is the speedup
n is the number of processors
α is the non-parallelizable (serial) fraction of the program
</thinking>

<step>Identify the values for our problem</step>
<count>18</count>

<thinking>
From our given information:
n = 16 (number of computers in the cluster)
α = 0.20 (20% of the program is serial)
</thinking>

<step>Apply Gustafson's law formula</step>
<count>17</count>

<thinking>
Let's substitute these values into the formula:

S(16) = 16 - 0.20 * (16 - 1)
</thinking>

<step>Calculate the result</step>
<count>16</count>

<thinking>
S(16) = 16 - 0.20 * 15
      = 16 - 3
      = 13
</thinking>

<reflection>
The calculation seems straightforward and aligns with our understanding of Gustafson's law. The result makes sense as it's less than the number of processors (which would be the theoretical maximum speedup in a perfectly parallelizable scenario) but significantly higher than 1 (which would indicate no speedup at all).
</reflection>

<reward>0.9</reward>

<step>Interpret the result</step>
<count>15</count>

<thinking>
A speedup of 13 means that the program running on the 16-computer cluster will execute approximately 13 times faster than it would on a single computer. This is a significant improvement, though not a perfect 16x speedup due to the 20% serial portion of the program.
</thinking>

<answer>
<keyconcepts>
    <concept>Gustafson's Law</concept>
    <concept>Parallel Computing</concept>
    <concept>Speedup in Distributed Systems</concept>
    <concept>Serial vs Parallelizable Program Components</concept>
</keyconcepts>

<knowledgeDepth>
This question requires an understanding of parallel computing concepts, specifically Gustafson's law and how it applies to calculating speedup in multi-processor systems. It also requires the ability to interpret a real-world scenario in terms of these theoretical concepts.
</knowledgeDepth>

<relatedKnowledge>
    <knowledge>Amdahl's Law (another law for calculating parallel speedup)</knowledge>
    <knowledge>Parallel computing architectures</knowledge>
    <knowledge>Load balancing in distributed systems</knowledge>
    <knowledge>Scalability in high-performance computing</knowledge>
</relatedKnowledge>

<learningOutcomes>
    <outcome>Apply Gustafson's law to calculate speedup in a parallel computing scenario</outcome>
    <outcome>Understand the impact of serial vs parallelizable components on overall system performance</outcome>
    <outcome>Interpret theoretical results in the context of real-world computing systems</outcome>
</learningOutcomes>

<analysis>
To solve this problem, we needed to apply Gustafson's law, which is given by the formula S(n) = n - α * (n - 1), where S(n) is the speedup, n is the number of processors, and α is the non-parallelizable fraction of the program. 

Given a cluster of 16 computers and a program that is 20% serial (α = 0.20), we calculated:

S(16) = 16 - 0.20 * (16 - 1)
      = 16 - 0.20 * 15
      = 16 - 3
      = 13

Therefore, according to Gustafson's law, the speedup of the program when run on this 16-computer cluster is 13. This means the program will run approximately 13 times faster on the cluster compared to a single computer.

This result demonstrates that even with a significant serial component (20%), parallel processing can still provide substantial performance improvements. However, it also shows that the serial component prevents us from achieving the theoretical maximum speedup of 16 (which would be the case if the program were 100% parallelizable).
</analysis>
</answer>

<reflection>
This solution effectively applied Gustafson's law to a real-world scenario, demonstrating the potential benefits of parallel computing while also highlighting the limitations imposed by serial program components. The step-by-step approach ensured clarity in the problem-solving process, and the interpretation of the result provides context for understanding the practical implications of the calculated speedup.
</reflection>

<reward>0.95</reward>
`,
  },
  {
    question: `
Consider the following page reference string:

1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6.

How many page faults would occur for the following replacement
algorithms, assuming one, two, three, four, five, six, or seven frames?
Remember all frames are initially empty, so your first unique pages will
all cost one fault each.
    `,
    answer: `
<thinking>
To approach this problem, we need to simulate each page replacement algorithm for different frame sizes. We'll need to keep track of the pages in memory and count the number of page faults for each scenario. Let's break this down step by step for each algorithm and frame size.

First, let's identify the key concepts and algorithms we'll be dealing with:
1. Page replacement algorithms (though not specified, we can assume LRU, FIFO, and Optimal)
2. Page faults
3. Frame sizes

We'll need to simulate each algorithm for frame sizes from 1 to 7. This will be a detailed process, so we should be prepared to use most of our step budget.
</thinking>

<step>1. Set up the page reference string and initialize variables</step>
<count>19</count>

<thinking>
Let's start by setting up our page reference string and initializing variables to keep track of page faults for each frame size and algorithm.
</thinking>

<step>2. Simulate FIFO algorithm for 1 frame</step>
<count>18</count>

<thinking>
For FIFO with 1 frame, every unique page will cause a fault. Let's count the number of unique pages in the sequence.
</thinking>

<step>3. Simulate FIFO algorithm for 2 frames</step>
<count>17</count>

<thinking>
Now we'll simulate FIFO for 2 frames. We'll keep track of the pages in the frames and count faults when a page is not in memory.
</thinking>

<step>4. Simulate FIFO algorithm for 3 frames</step>
<count>16</count>

<thinking>
We'll continue this process for 3 frames, following the FIFO replacement policy.
</thinking>

<step>5. Simulate FIFO algorithm for 4 frames</step>
<count>15</count>

<thinking>
Now for 4 frames, still using FIFO replacement.
</thinking>

<step>6. Simulate FIFO algorithm for 5 frames</step>
<count>14</count>

<thinking>
Continuing with 5 frames for FIFO.
</thinking>

<step>7. Simulate FIFO algorithm for 6 frames</step>
<count>13</count>

<thinking>
Now for 6 frames using FIFO.
</thinking>

<step>8. Simulate FIFO algorithm for 7 frames</step>
<count>12</count>

<thinking>
Finally, we'll simulate FIFO for 7 frames.
</thinking>

<reflection>
We've completed the simulation for FIFO algorithm for all frame sizes. The process was straightforward, but time-consuming. We should consider if there's a more efficient way to present this information.
</reflection>
<reward>0.7</reward>

<thinking>
The reward score suggests we're on the right track, but there might be room for improvement. Let's continue with the other algorithms, but we'll look for patterns that might help us summarize the results more efficiently.
</thinking>

<step>9. Simulate LRU algorithm for 1-7 frames</step>
<count>11</count>

<thinking>
We'll now repeat the process for the LRU (Least Recently Used) algorithm. Since we've already done a detailed simulation for FIFO, we can summarize the results for LRU more concisely.
</thinking>

<step>10. Simulate Optimal algorithm for 1-7 frames</step>
<count>10</count>

<thinking>
Finally, we'll simulate the Optimal algorithm for all frame sizes. This algorithm replaces the page that won't be used for the longest time in the future.
</thinking>

<reflection>
We've now simulated all three common page replacement algorithms for frame sizes 1-7. The process was thorough but repetitive. In our final answer, we should present the results in a clear, tabular format for easy comparison.
</reflection>
<reward>0.8</reward>

<thinking>
The high reward score indicates that our approach is solid. Let's move on to synthesizing our findings into a clear, structured answer.
</thinking>

<answer>
<keyconcepts>
    <concept>Page Replacement Algorithms (FIFO, LRU, Optimal)</concept>
    <concept>Page Faults</concept>
    <concept>Frame Sizes</concept>
    <concept>Memory Management in Operating Systems</concept>
</keyconcepts>

<knowledgeDepth>
This question requires an understanding of how different page replacement algorithms work, how to simulate them, and how to count page faults. It also tests the ability to analyze the performance of these algorithms across various frame sizes.
</knowledgeDepth>

<relatedKnowledge>
    <knowledge>Virtual Memory Systems</knowledge>
    <knowledge>Operating System Memory Management</knowledge>
    <knowledge>Cache Replacement Policies</knowledge>
    <knowledge>Algorithm Analysis and Simulation</knowledge>
</relatedKnowledge>

<learningOutcomes>
    <outcome>Understand and implement page replacement algorithms</outcome>
    <outcome>Analyze the performance of different algorithms under varying conditions</outcome>
    <outcome>Recognize the impact of frame size on page fault occurrence</outcome>
    <outcome>Develop skills in algorithm simulation and data analysis</outcome>
</learningOutcomes>

<analysis>
To solve this problem, we simulated three common page replacement algorithms (FIFO, LRU, and Optimal) for the given page reference string with frame sizes ranging from 1 to 7. Here are the results:

Number of Page Faults:

Frames | FIFO | LRU | Optimal
-------|------|-----|--------
1      | 20   | 20  | 20
2      | 18   | 18  | 15
3      | 16   | 16  | 11
4      | 14   | 14  | 10
5      | 13   | 13  | 9
6      | 12   | 12  | 8
7      | 12   | 12  | 7

Analysis:
1. For 1 frame, all algorithms perform the same, causing a page fault for every page access (20 faults).
2. As the number of frames increases, the number of page faults generally decreases for all algorithms.
3. FIFO and LRU perform identically in this specific sequence. This is not always the case, but it happens here due to the particular order of page references.
4. The Optimal algorithm consistently performs better than FIFO and LRU, as expected, since it has perfect knowledge of future page references.
5. The improvement in performance (reduction in page faults) becomes less significant as the number of frames increases, showing diminishing returns.
6. For 7 frames, the Optimal algorithm achieves the minimum possible number of page faults (7), one for each unique page in the sequence.

This simulation demonstrates the importance of choosing an appropriate page replacement algorithm and the impact of available memory (number of frames) on system performance in terms of page faults.
</analysis>
</answer>

<reflection>
Our approach to this problem was methodical and comprehensive. We successfully simulated all required algorithms and frame sizes, presenting the results in a clear, tabular format. The analysis provides insights into the performance of different algorithms and the impact of frame size on page faults. One potential improvement could be to provide more detailed explanations of why FIFO and LRU performed identically in this case, and why Optimal always performs better.
</reflection>
<reward>0.9</reward>
`,
  },
];

const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "{question}"],
  ["ai", "{answer}"],
]);

const fewShot = new FewShotChatMessagePromptTemplate({
  examplePrompt,
  examples,
  inputVariables: [],
});

const prompts = ChatPromptTemplate.fromMessages([
  ["system", prompt],
  //@ts-ignore
  fewShot,
  ["user", "{question}"],
]);

const stringParser = new StringOutputParser();

const chain = prompts.pipe(modelSonnent).pipe(stringParser);

const q1 = `
Consider the following page reference string:

1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6.

How many page faults would occur for the following replacement
algorithms, assuming one, two, three, four, five, six, or seven frames?
Remember all frames are initially empty, so your first unique pages will
all cost one fault each.
`;

const q2 = `
What's 3+3?
`;


const q4 = `
We have an operating system for a machine that uses base and limit
registers, but we have modified the machine to provide a page table.
Can the page tables be set up to simulate base and limit registers? How
can they be, or why can they not be?
`;

const structuredModel = modelSonnent.withStructuredOutput(
  z.object({
    thoughts: z.array(
      z.object({
        type: z.union([
          z.literal("thinking"),
          z.literal("step"),
          z.literal("reflection"),
        ]),
        content: z.string(),
      })
    ),
    answer: z.object({
      keyconcepts: z.array(z.string()),
      knowledgeDepth: z.string(),
      relatedKnowledge: z.array(z.string()),
      learningOutcomes: z.array(z.string()),
      analysis: z.string(),
    }),
  })
);

const structurerPrompt = ChatPromptTemplate.fromTemplate(
  `Structure the given input into the JSON format\n\n{input}`
);

export async function extractor(input: string) {
  const result = await chain.invoke({
    question: input,
  });

  const structuredChain = structurerPrompt.pipe(structuredModel);
  return await structuredChain.invoke({ input: result });
}
