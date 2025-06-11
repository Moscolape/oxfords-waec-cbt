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

const subjects = [
  "mathematics",
  "english",
  "biology",
  "chemistry",
  "physics",
  "government",
  "crs",
  "economics",
  "literature",
  "fmaths",
  "fishery",
  "civic",
];

const AllQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("mathematics");

  const fetchQuestions = async (subject: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://oxfords-waec-cbt-backend.onrender.com/api/v1/questions?subject=${subject}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch questions");
      }

      setQuestions(data.questions);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedSubject);
  }, [selectedSubject]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  return (
    <DashboardWrapper>
      <div className="w-full m-auto font-Inter p-5 pt-25">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}{" "}
            Questions
          </h1>
          <div>
            <span>Change subject:</span>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="border border-gray-300 rounded-md p-2 text-sm ml-2"
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj.charAt(0).toUpperCase() + subj.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
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

        {!loading && (
          <div className="grid gap-6">
            {questions.map((q, index) => (
              <div key={q._id} className="rounded-2xl p-5 shadow-sm bg-white">
                {q.promptType === "text" ? (
                  <p className="text-lg font-medium mb-2">
                    {index + 1}. {q.prompt}
                  </p>
                ) : (
                  <div className="flex">
                    <span className="block mr-2">{index + 1}.)</span>
                    <img
                      src={`${q.prompt}`}
                      alt="Question"
                      className="w-[90%] mb-2"
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
        )}
      </div>
    </DashboardWrapper>
  );
};

export default AllQuestions;
