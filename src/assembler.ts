import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { modelSonnent } from "./models";
import type { ExtractorOutput } from "./type";

const prompt = `
###Instruction###

Your task is to create examination questions based on given key concepts, topics, and learning outcomes. You MUST also provide steps to solve each question. As an expert exam taker, ensure that your questions are challenging yet fair, and cover the material comprehensively.

Follow these steps:

1. Analyze the provided key concepts, topics, and learning outcomes.
2. Create a variety of question types (multiple choice, short answer, essay, problem-solving).
3. Ensure questions align with the learning outcomes.
4. Provide a clear and concise step-by-step solution for each question.
5. Include a mix of difficulty levels to assess different levels of understanding.

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

###Example###

Given:
Key Concept: Photosynthesis
Topic: Plant Biology
Learning Outcome: Students will be able to explain the process of photosynthesis and its importance in ecosystems.

<thinking>
Let's approach this by creating a comprehensive essay question that covers both the process of photosynthesis and its ecological importance. We'll need to ensure that the question allows students to demonstrate their understanding of the key concept and meets the learning outcome.
</thinking>

<step>Create an essay question that covers both the process of photosynthesis and its ecological importance.</step>
<count>19</count>

Question:
Explain the process of photosynthesis and discuss its significance in maintaining ecological balance. (10 points)

<step>Outline the main points that should be covered in the answer.</step>
<count>18</count>

Steps to solve:
1. Define photosynthesis
2. Outline the main steps of the process
3. Identify key components (chlorophyll, light, water, carbon dioxide)
4. Explain the products of photosynthesis (glucose and oxygen)
5. Discuss the role of photosynthesis in food chains and oxygen production
6. Relate photosynthesis to carbon cycling in ecosystems
7. Conclude with the overall importance of photosynthesis for life on Earth

<reflection>
The question effectively addresses the key concept of photosynthesis and allows students to demonstrate their understanding of its ecological importance. The steps to solve provide a clear structure for a comprehensive answer. However, we could consider adding a more challenging element to the question.
</reflection>

<reward>0.8</reward>

<thinking>
Since the reward score is 0.8, we'll continue with this approach but add a slight modification to increase the complexity.
</thinking>

<step>Modify the question to include a more challenging element.</step>
<count>17</count>

Modified Question:
Explain the process of photosynthesis and discuss its significance in maintaining ecological balance. Additionally, predict the potential consequences of a 25% reduction in global photosynthetic activity on Earth's ecosystems. (15 points)

<step>Update the steps to solve to include the new element.</step>
<count>16</count>

Updated Steps to solve:
1. Define photosynthesis
2. Outline the main steps of the process
3. Identify key components (chlorophyll, light, water, carbon dioxide)
4. Explain the products of photosynthesis (glucose and oxygen)
5. Discuss the role of photosynthesis in food chains and oxygen production
6. Relate photosynthesis to carbon cycling in ecosystems
7. Conclude with the overall importance of photosynthesis for life on Earth
8. Predict consequences of a 25% reduction in global photosynthetic activity:
   a. Impact on oxygen levels
   b. Effect on food chains and biodiversity
   c. Implications for carbon cycling and climate change

<reflection>
The modified question now includes a more challenging element that requires students to apply their knowledge of photosynthesis to a hypothetical scenario. This addition enhances the question's ability to assess higher-order thinking skills while still covering the basic concepts.
</reflection>

<reward>0.9</reward>

<answer>
Final Examination Question:

Explain the process of photosynthesis and discuss its significance in maintaining ecological balance. Additionally, predict the potential consequences of a 25% reduction in global photosynthetic activity on Earth's ecosystems. (15 points)

Steps to solve:
1. Define photosynthesis
2. Outline the main steps of the process
3. Identify key components (chlorophyll, light, water, carbon dioxide)
4. Explain the products of photosynthesis (glucose and oxygen)
5. Discuss the role of photosynthesis in food chains and oxygen production
6. Relate photosynthesis to carbon cycling in ecosystems
7. Conclude with the overall importance of photosynthesis for life on Earth
8. Predict consequences of a 25% reduction in global photosynthetic activity:
   a. Impact on oxygen levels
   b. Effect on food chains and biodiversity
   c. Implications for carbon cycling and climate change
</answer>

<reflection>
The final question effectively addresses the key concept of photosynthesis, meets the learning outcome, and includes a challenging element that requires students to apply their knowledge to a hypothetical scenario. The question allows for a comprehensive assessment of students' understanding of photosynthesis and its ecological importance.

The steps to solve provide a clear structure for a thorough answer, guiding students through the basic concepts and then prompting them to engage in higher-order thinking by predicting potential consequences of reduced photosynthetic activity.

This question successfully balances testing factual knowledge with the application of concepts to novel situations, making it an effective tool for assessing students' mastery of the topic.
</reflection>

<reward>0.95</reward>

###Question###

Now, provide the key concepts, topics, and learning outcomes for which you want me to create examination questions.
`;

const template = `
Prototype Examination Question:
{question}

Key Concept:
{keyconcepts}

Knowledge Depth:
{knowledgeDepth}

Learning Outcomes:
{learningOutcomes}

Analysis:
{analysis}
`;

const prompts = ChatPromptTemplate.fromMessages([
  ["system", prompt],
  ["user", template],
]);

const stringParser = new StringOutputParser();

const chain = prompts.pipe(modelSonnent).pipe(stringParser);

export function assembler(question: string, params: ExtractorOutput) {
  return chain.invoke({
    question,
    keyconcepts: params.keyconcepts.join(",\n"),
    knowledgeDepth: params.knowledgeDepth,
    learningOutcomes: params.learningOutcomes.join(",\n"),
    analysis: params.analysis,
  });
}
