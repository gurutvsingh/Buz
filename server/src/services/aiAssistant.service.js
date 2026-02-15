const Groq = require("groq-sdk");
const db = require("../config/db");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getSuggestions = async () => {
  return {
    suggestions: [
      {
        type: "AI",
        title: "Ask Anything",
        message:
          "Ask questions about profit, expenses, customers, reminders and business growth.",
      },
    ],
  };
};

const askAssistant = async (
  businessId,
  question
) => {
  const [income] = await db.execute(
    `
    SELECT COALESCE(SUM(amount),0) total
    FROM income
    WHERE business_id = ?
    `,
    [businessId]
  );

  const [expenses] = await db.execute(
    `
    SELECT COALESCE(SUM(amount),0) total
    FROM expenses
    WHERE business_id = ?
    `,
    [businessId]
  );

  const [customers] = await db.execute(
    `
    SELECT COUNT(*) total
    FROM customers
    WHERE business_id = ?
    `,
    [businessId]
  );

  const businessData = {
    income: Number(income[0].total || 0),
    expenses: Number(expenses[0].total || 0),
    customers: Number(customers[0].total || 0),
    profit:
      Number(income[0].total || 0) -
      Number(expenses[0].total || 0),
  };

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are BUZ AI Business Copilot.

Help business owners understand:
- profit
- expenses
- customers
- growth
- cashflow

Give practical, concise and actionable advice.
`,
        },
        {
          role: "user",
          content: `
Business Data:
${JSON.stringify(businessData, null, 2)}

Question:
${question}
`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

  return {
    answer:
      completion.choices[0].message.content,
    businessData,
  };
};

module.exports = {
  getSuggestions,
  askAssistant,
};