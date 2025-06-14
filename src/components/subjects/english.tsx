import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardWrapper from "../dashboardWrapper";
import Lottie from "lottie-react";
import confettiAnimation from "../../utils/Animation - 1744283286259.json";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StopCircle } from "lucide-react";

const QUIZ_DURATION = 60 * 60 * 1000;

type Question = {
  _id: string;
  prompt: string;
  promptType: "text" | "image";
  options: string[];
  type: string;
};

const English = () => {
  const [quizTimeLeft, setQuizTimeLeft] = useState(QUIZ_DURATION);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    () => JSON.parse(localStorage.getItem("englishQuizAnswers") || "{}")
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scoreData, setScoreData] = useState<null | { score: number }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(() =>
    JSON.parse(localStorage.getItem("englishHasSubmitted") || "false")
  );
  const [error, setError] = useState("");
  const [showEndTestModal, setShowEndTestModal] = useState(false);

  const name = localStorage.getItem("candidateName");
  const subject = localStorage.getItem("selectedSubject");
  const testType = localStorage.getItem("testType");

  const fullAnswers = useMemo(() => {
    const result: { [key: string]: string | string[] } = {};
    for (const question of questions) {
      result[question._id] =
        answers[question._id] ||
        (question.type === "multiple-choice" ? [] : "");
    }
    return result;
  }, [questions, answers]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      navigate("/take-test");
    }
  }, [name, navigate]);

  const handleSubmit = useCallback(async () => {
    if (hasSubmitted) return;

    setHasSubmitted(true);
    setSubmitting(true);
    localStorage.setItem("englishHasSubmitted", "true");

    try {
      const response = await fetch(
        "https://oxfords-waec-cbt-backend.onrender.com/api/v1/questions/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: fullAnswers,
            subject,
            name,
            testType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit quiz");
      }

      setScoreData({ score: data.score });
      localStorage.removeItem("englishQuizAnswers");
      localStorage.removeItem("englishHasSubmitted");
      localStorage.removeItem("englishQuizStartTime");
    } catch (error) {
      console.error("Submission error:", error);
      setHasSubmitted(false);
      localStorage.setItem("englishHasSubmitted", "false");
      setError("Submission failed. Please try again.");
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [fullAnswers, hasSubmitted, name, subject, testType]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://oxfords-waec-cbt-backend.onrender.com/api/v1/questions?subject=${subject}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch questions");

      setQuestions(data.questions);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Error fetching questions.");
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    const storedStartTime = localStorage.getItem("englishQuizStartTime");
    let startTime: number;

    if (storedStartTime) {
      startTime = parseInt(storedStartTime, 10);
    } else {
      startTime = Date.now();
      localStorage.setItem("englishQuizStartTime", startTime.toString());
    }

    const endTime = startTime + QUIZ_DURATION;

    const timer = setInterval(() => {
      const timeLeft = endTime - Date.now();
      setQuizTimeLeft(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        const hasAnyAnswer = Object.values(answers).some((value) =>
          Array.isArray(value) ? value.length > 0 : value !== ""
        );

        if (hasAnyAnswer) {
          handleSubmit();
        } else {
          alert("Time's up. No answers submitted.");
        }

        localStorage.removeItem("englishQuizStartTime");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [answers, handleSubmit]);

  useEffect(() => {
    localStorage.setItem("englishQuizAnswers", JSON.stringify(answers));
  }, [answers]);

  const handleSelect = (questionId: string, option: string) => {
    const question = questions.find((q) => q._id === questionId);
    if (!question) return;

    if (question.type === "objective") {
      setAnswers({ ...answers, [questionId]: option });
    }
  };

  const formatTime = (ms: number) => {
    if (ms <= 0 || hasSubmitted) return "00:00";
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const clearMathQuizData = () => {
    localStorage.removeItem("englishQuizAnswers");
    localStorage.removeItem("englishHasSubmitted");
    localStorage.removeItem("englishQuizStartTime");
  };

  const handleEndTest = () => {
    clearMathQuizData();
    navigate("/take-test");
  };

  function renderPrompt(prompt: string) {
    const regex = /_([a-zA-Z]+)_/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(prompt)) !== null) {
      const [fullMatch, group] = match;
      const start = match.index;

      if (start > lastIndex) {
        parts.push(prompt.slice(lastIndex, start));
      }

      parts.push(
        <span key={start} className="underline">
          {group}
        </span>
      );

      lastIndex = start + fullMatch.length;
    }

    if (lastIndex < prompt.length) {
      parts.push(prompt.slice(lastIndex));
    }

    return parts;
  }

  return (
    <DashboardWrapper>
      <div className="w-full max-w-6xl mx-auto font-Inter p-5 pt-25">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">English Language Test</h1>
          <h1 className="text-2xl font-bold">Test Type: {testType}</h1>
        </div>{" "}
        <div className="flex justify-between items-center mb-5">
          <p className="text-xl mb-2">
            ⏳ Time Left -{" "}
            <span className="font-bold">{formatTime(quizTimeLeft)}</span>
          </p>
          <button
            onClick={() => setShowEndTestModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center cursor-pointer"
          >
            <StopCircle size={28} style={{ paddingRight: 5 }} />
            End Test
          </button>
        </div>
        {showEndTestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cb]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl animate-fadeDownFast font-Montserrat">
              <h2 className="text-lg font-semibold mb-4">End Test?</h2>
              <p className="mb-4">
                Are you sure you want to end the test? You won't be able to
                change your answers afterward.
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleEndTest()}
                  className="text-white bg-gray-900 px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
                >
                  Go Home
                </button>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowEndTestModal(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowEndTestModal(false);
                      handleSubmit();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                  >
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <ScaleLoader
              color="#dc117b"
              loading={loading}
              barCount={5}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : error ? (
          <div className="text-red-600 font-medium mt-4 text-center">
            {error}
          </div>
        ) : (
          <>
            {questions.length > 0 && (
              <div
                key={questions[currentQuestionIndex]._id}
                className="mb-6 mt-10 animate-fadeUp"
              >
                <div className="font-medium mb-3">
                  <span className="font-semibold">
                    {currentQuestionIndex + 1}.
                  </span>{" "}
                  {questions[currentQuestionIndex].promptType === "image" ? (
                    <img
                      src={questions[currentQuestionIndex].prompt}
                      alt={`Question ${currentQuestionIndex + 1}`}
                      className="mt-2 max-w-full h-auto rounded-md border"
                    />
                  ) : (
                    <span>
                      {renderPrompt(questions[currentQuestionIndex].prompt)}
                    </span>
                  )}
                </div>

                {questions[currentQuestionIndex].type === "multiple-choice" ? (
                  <div className="space-y-2">
                    {questions[currentQuestionIndex].options.map((option) => {
                      const selected =
                        (answers[
                          questions[currentQuestionIndex]._id
                        ] as string[]) || [];
                      return (
                        <label key={option} className="block cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selected.includes(option)}
                            disabled={hasSubmitted || submitting}
                            onChange={() =>
                              handleSelect(
                                questions[currentQuestionIndex]._id,
                                option
                              )
                            }
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {questions[currentQuestionIndex]?.options.map(
                      (option, index) => {
                        const isSelected =
                          answers[questions[currentQuestionIndex]._id] ===
                          option;

                        const optionLabels = ["A", "B", "C", "D"];

                        return (
                          <button
                            key={option}
                            disabled={hasSubmitted || submitting}
                            onClick={() =>
                              handleSelect(
                                questions[currentQuestionIndex]._id,
                                option
                              )
                            }
                            className={`flex items-center gap-2 w-full text-left p-2 border rounded ${
                              isSelected
                                ? "bg-[#dc117b] text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <span className="font-bold">
                              {optionLabels[index]}.
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={hasSubmitted || submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {submitting
                    ? "Submitting..."
                    : hasSubmitted
                    ? "Submitted"
                    : "Submit"}
                </button>
              ) : (
                <button
                  disabled={currentQuestionIndex >= questions.length - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-4 py-2 text-white rounded bg-[#dc117b] hover:bg-[#ab0c5e] disabled:opacity-50"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
        {scoreData && (
          <div className="fixed inset-0 bg-[#00000080] bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-md rounded-lg p-8 text-center relative">
              <Lottie
                animationData={confettiAnimation}
                loop
                autoplay
                style={{
                  height: 200,
                  position: "absolute",
                  top: -60,
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                }}
              />
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                🎉 Test Submitted!
              </h2>
              <button
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 cursor-pointer"
                onClick={() => {
                  navigate("/take-test", { replace: true });
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default English;
