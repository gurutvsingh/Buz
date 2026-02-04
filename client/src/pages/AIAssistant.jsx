import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa6";

import FeatureWorkspace from "../components/common/FeatureWorkspace";
import { useBusiness } from "../hooks/useBusiness";
import { askAiAssistant } from "../services/module.service";

const AIAssistant = () => {
  const { currentBusiness } = useBusiness();

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    setLoading(true);

    try {
      const response =
        await askAiAssistant(
          currentBusiness.id,
          question
        );

      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer(
        "Unable to get response from AI."
      );
    }

    setLoading(false);
  };

  return (
    <FeatureWorkspace
      eyebrow="AI"
      title="BUZ Business Copilot"
      description="Ask questions about your business and get AI-powered insights."
      icon={<FaRobot />}
      tone="blue"
      stats={[
        {
          label: "Mode",
          value: "Chat",
        },
        {
          label: "AI",
          value: "GPT",
        },
        {
          label: "Status",
          value: "Live",
        },
      ]}
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form
            onSubmit={handleAsk}
            className="space-y-4"
          >
            <textarea
              rows={4}
              placeholder="Ask something about your business..."
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={
                loading ||
                !currentBusiness
              }
              className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700"
            >
              <FaPaperPlane />
              {loading
                ? "Thinking..."
                : "Ask AI"}
            </button>
          </form>
        </div>

        {answer && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-black">
              AI Response
            </h3>

            <p className="whitespace-pre-wrap text-slate-700">
              {answer}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button
            onClick={() =>
              setQuestion(
                "How can I improve profit?"
              )
            }
            className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
          >
            How can I improve profit?
          </button>

          <button
            onClick={() =>
              setQuestion(
                "Analyze my business performance."
              )
            }
            className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
          >
            Analyze my business performance
          </button>

          <button
            onClick={() =>
              setQuestion(
                "How can I reduce expenses?"
              )
            }
            className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
          >
            How can I reduce expenses?
          </button>

          <button
            onClick={() =>
              setQuestion(
                "Give growth suggestions."
              )
            }
            className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
          >
            Give growth suggestions
          </button>
        </div>
      </div>
    </FeatureWorkspace>
  );
};

export default AIAssistant;