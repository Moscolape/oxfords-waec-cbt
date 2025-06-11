import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import DashboardWrapper from "./dashboardWrapper";

interface Question {
  _id: string;
  subject: string;
  type: string;
  promptType: "text" | "image";
  prompt: string;
  options: string[];
  correctAnswer: string;
  points: number;
  createdAt: string;
}

const AllQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://oxfords-waec-cbt-backend.onrender.com/api/v1/questions"
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch questions");
        }

        setQuestions(data.questions);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <DashboardWrapper>
      <div className="w-full m-auto font-Inter p-5 pt-25">
        <h1 className="text-2xl font-semibold mb-4">All Questions</h1>

        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <ScaleLoader
              color="#dc117b"
              loading={loading}
              barCount={5}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}

        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="grid gap-6">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="rounded-2xl p-5 shadow-sm"
            >
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Subject:</span> {q.subject}
              </p>

              {q.promptType === "text" ? (
                <p className="text-lg font-medium mb-2">{index + 1}{".) "} {q.prompt}</p>
              ) : (
                <div className="flex">
                  <span className="block mr-2">{index + 1}.)</span>            
                  <img
                    src={`${q.prompt}`}
                    alt="Question"
                    className="w-full mb-2"
                  />
                </div>
              )}

              <div className="mb-2">
                <p className="font-medium">Options:</p>
                <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-green-600">
                <span className="font-medium">Correct Answer:</span>{" "}
                {q.correctAnswer}
              </p>
              <p className="text-sm text-blue-600">
                <span className="font-medium">Points:</span> {q.points}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default AllQuestions;
