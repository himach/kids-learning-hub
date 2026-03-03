import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "kids-learning-hub",
  version: "1.0.0",
});

// ── Data ─────────────────────────────────────────────────────────────────────

const activities = [
  {
    id: "math",
    name: "Math Activities",
    description: "Fun math problems and exercises",
    path: "/timer/math",
    types: ["basic", "measurement", "time"],
  },
  {
    id: "game",
    name: "Educational Games",
    description: "Interactive learning games",
    path: "/timer/game",
    games: ["Memory Match", "Space Defender"],
  },
  {
    id: "reading",
    name: "Reading & Spelling",
    description: "Reading comprehension and spelling practice",
    path: "/timer/reading",
  },
];

const stories = [
  {
    title: "The Friendly Dragon",
    content:
      "Once upon a time, there was a friendly dragon named Sparky. Unlike other dragons, Sparky didn't like to breathe fire. Instead, he loved to help others and make new friends. One day, he met a little rabbit who was lost in the forest. Sparky used his warm breath to keep the rabbit cozy and helped him find his way home.",
    questions: [
      {
        question: "What was special about Sparky the dragon?",
        options: [
          "He was the biggest dragon",
          "He didn't like to breathe fire",
          "He could fly the highest",
          "He had the longest tail",
        ],
        correctAnswer: 1,
      },
      {
        question: "How did Sparky help the rabbit?",
        options: [
          "He gave the rabbit food",
          "He kept the rabbit warm and helped him home",
          "He taught the rabbit to fly",
          "He built a house for the rabbit",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: "The Magic Garden",
    content:
      "In a small town, there was a magical garden where flowers could talk and trees could dance. The garden was cared for by a kind old woman named Mrs. Green. Every morning, she would water the plants and sing to them. The flowers would bloom brighter, and the trees would sway to her songs.",
    questions: [
      {
        question: "What was special about the garden?",
        options: [
          "It had the biggest flowers",
          "The flowers could talk and trees could dance",
          "It had the most colors",
          "It was the oldest garden",
        ],
        correctAnswer: 1,
      },
      {
        question: "What did Mrs. Green do every morning?",
        options: [
          "She picked flowers",
          "She danced with the trees",
          "She watered plants and sang to them",
          "She talked to the flowers",
        ],
        correctAnswer: 2,
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateBasicProblem() {
  const operations = ["+", "-", "*"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  if (operation === "-" && num2 > num1) [num1, num2] = [num2, num1];
  const answer =
    operation === "+" ? num1 + num2 : operation === "-" ? num1 - num2 : num1 * num2;
  return { question: `${num1} ${operation} ${num2} = ?`, answer, type: "basic" };
}

function generateMeasurementProblem() {
  const measurements = [
    { unit: "cm", min: 1, max: 50 },
    { unit: "m", min: 1, max: 10 },
    { unit: "kg", min: 1, max: 20 },
    { unit: "L", min: 1, max: 10 },
  ];
  const m = measurements[Math.floor(Math.random() * measurements.length)];
  const num1 = Math.floor(Math.random() * (m.max - m.min + 1)) + m.min;
  const num2 = Math.floor(Math.random() * (m.max - m.min + 1)) + m.min;
  const add = Math.random() < 0.5;
  return {
    question: `What is ${num1} ${m.unit} ${add ? "+" : "-"} ${num2} ${m.unit}?`,
    answer: add ? num1 + num2 : Math.abs(num1 - num2),
    type: "measurement",
    unit: m.unit,
  };
}

function generateTimeProblem() {
  const hours = Math.floor(Math.random() * 12) + 1;
  const minutes = Math.floor(Math.random() * 60);
  const addHours = Math.floor(Math.random() * 5) + 1;
  const addMinutes = Math.floor(Math.random() * 60);
  const startTime = `${hours}:${String(minutes).padStart(2, "0")}`;
  const totalMinutes = hours * 60 + minutes + addHours * 60 + addMinutes;
  const newHours = Math.floor(totalMinutes / 60) % 12 || 12;
  return {
    question: `If it's ${startTime} and you add ${addHours} hours and ${addMinutes} minutes, what time will it be? (Answer in hours only)`,
    answer: newHours,
    type: "time",
  };
}

// ── Tools ─────────────────────────────────────────────────────────────────────

server.tool(
  "get_math_problem",
  "Generate a random math problem for kids. Returns the question and the correct answer.",
  {
    type: z
      .enum(["basic", "measurement", "time"])
      .optional()
      .describe(
        'Problem type: "basic" (arithmetic), "measurement" (units), or "time" (clock). Omit for a random type.'
      ),
  },
  ({ type }) => {
    const problemType =
      type ?? ["basic", "measurement", "time"][Math.floor(Math.random() * 3)];
    const problem =
      problemType === "measurement"
        ? generateMeasurementProblem()
        : problemType === "time"
          ? generateTimeProblem()
          : generateBasicProblem();
    return { content: [{ type: "text", text: JSON.stringify(problem, null, 2) }] };
  }
);

server.tool(
  "get_reading_story",
  "Retrieve a reading story with comprehension questions for kids.",
  {
    index: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe(
        `Story index (0-${stories.length - 1}). Omit for a random story.`
      ),
  },
  ({ index }) => {
    const story = stories[index ?? Math.floor(Math.random() * stories.length)];
    if (!story) {
      return {
        content: [
          {
            type: "text",
            text: `Story not found. Valid indices: 0-${stories.length - 1}`,
          },
        ],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(story, null, 2) }] };
  }
);

server.tool(
  "get_activity_list",
  "List all available learning activities in the Kids Learning Hub.",
  {},
  () => ({
    content: [{ type: "text", text: JSON.stringify(activities, null, 2) }],
  })
);

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
