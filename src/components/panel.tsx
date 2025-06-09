import { useNavigate, useParams } from "react-router-dom";
import DashboardWrapper from "./dashboardWrapper";
import { ChangeEvent, useState } from "react";

interface FormState {
  question: string;
  questionImage: File | null;
  options: string[];
  correctAnswer: string;
  points: number;
}

const AdminPanel = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionType, setQuestionType] = useState<"text" | "image">("text");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    question: "",
    questionImage: null,
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionsChange = (idx: number, value: string) => {
    setForm((prev) => {
      const opts = [...prev.options];
      opts[idx] = value;
      return { ...prev, options: opts };
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, questionImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subject", selectedSubject);
    formData.append("questionType", questionType);
    formData.append("options", JSON.stringify(form.options));
    formData.append("correctAnswer", form.correctAnswer);
    formData.append("points", String(form.points));

    if (questionType === "text") {
      formData.append("question", form.question);
    } else if (form.questionImage) {
      formData.append("questionImage", form.questionImage);
    }

    navigate("/scores");
  };

  return (
    <DashboardWrapper>
      <div className="w-full m-auto font-Inter p-5 pt-25">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            {id ? "Edit" : "Set"} Question
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block">Select Subject</label>
              <select
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">-- Choose Subject --</option>
                <option value="mathematics">Mathematics</option>
                <option value="english">English</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Question Type</label>
              <div className="flex space-x-4 mb-4">
                <label>
                  <input
                    type="radio"
                    name="questionType"
                    value="text"
                    checked={questionType === "text"}
                    onChange={() => setQuestionType("text")}
                  />
                  <span className="ml-2">Text</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="questionType"
                    value="image"
                    checked={questionType === "image"}
                    onChange={() => setQuestionType("image")}
                  />
                  <span className="ml-2">Screenshot</span>
                </label>
              </div>

              {questionType === "text" ? (
                <>
                  <label className="block">Question</label>
                  <textarea
                    name="question"
                    value={form.question}
                    onChange={handleChange}
                    className="w-full border p-2 mb-4"
                  />
                </>
              ) : (
                <>
                  <label className="block">Upload Screenshot</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border p-2 mb-2"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 mt-2 border rounded"
                    />
                  )}
                </>
              )}
            </div>

            <div>
              <label className="block">Options</label>
              {form.options.map((opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) => handleOptionsChange(i, e.target.value)}
                  className="w-full border p-2 mb-2"
                  placeholder={`Option ${i + 1}`}
                />
              ))}
              <label className="block mt-4">Correct Answer</label>
              <input
                name="correctAnswer"
                value={form.correctAnswer}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
              />
            </div>

            <div>
              <label className="block">Points</label>
              <input
                name="points"
                type="number"
                value={form.points}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#14346f] hover:bg-[#1a4aa3] cursor-pointer text-white rounded"
            >
              {id ? "Update" : "Add"} Question
            </button>
          </form>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default AdminPanel;
