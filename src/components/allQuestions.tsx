import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import DashboardWrapper from "./dashboardWrapper";
import Pagination from "./pagination";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const itemsPerPage = 10;

  const fetchQuestions = async (subject: string, page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://oxfords-waec-cbt-backend.onrender.com/api/v1/questions?subject=${subject}&page=${page}&limit=${itemsPerPage}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch questions");

      setQuestions(data.questions);
      setTotalItems(data.totalCount);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching questions");
      toast.error("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject]);

  useEffect(() => {
    fetchQuestions(selectedSubject, currentPage);
  }, [selectedSubject, currentPage]);

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

        {error && <p className="text-red-500">{error}</p>}

        {!loading && (
          <>
            {questions.length > 0 ? (
              <div className="grid gap-6 animate-fadeUp">
                {questions.map((q, index) => (
                  <div
                    key={q._id}
                    className="rounded-2xl p-5 shadow-sm bg-white"
                  >
                    {q.promptType === "text" ? (
                      <p className="text-lg font-medium mb-2">
                        {(currentPage - 1) * itemsPerPage + index + 1}.{" "}
                        {q.prompt}
                      </p>
                    ) : (
                      <div className="flex">
                        <span className="block mr-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}.
                        </span>
                        <img
                          src={q.prompt}
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
                      <span className="font-semibold">Correct Answer:</span>{" "}
                      {q.correctAnswer}
                    </p>
                    <p className="text-sm text-blue-600">
                      <span className="font-semibold">Points:</span> {q.points}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-red-500 flex justify-center items-center min-h-[400px] text-xl">No questions!</span>
            )}

            {questions.length !== 0 && (
              <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default AllQuestions;
