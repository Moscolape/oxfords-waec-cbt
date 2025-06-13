import { useParams } from "react-router-dom";
import DashboardWrapper from "./dashboardWrapper";
import { ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormState {
  question: string;
  questionImage: File | null;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface SignUpData {
  username: string;
  password: string;
  role: string;
}

const AdminPanel = () => {
  const [selectedSubject, setSelectedSubject] = useState("english");
  const [questionType, setQuestionType] = useState<"text" | "image">("text");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });

  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormState>({
    question: "",
    questionImage: null,
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 2,
  });

  // Handlers for set question form
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
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

      const response = await fetch(
        "https://oxfords-waec-cbt-backend.onrender.com/api/v1/questions/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setForm({
        question: "",
        questionImage: null,
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 2,
      });
      setImagePreview(null);

      const fileInput = document.getElementById(
        "questionImageInput"
      ) as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Something went wrong while uploading the question.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitUser: SubmitHandler<SignUpData> = async (data) => {
    setIsCreating(true);

    try {
      const response = await fetch(
        "https://oxfords-waec-cbt-backend.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || result.message.toLowerCase().includes("error")) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset();
    } catch (error) {
      console.error("User creation error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const role = sessionStorage.getItem("oxfuserrole");

  return (
    <DashboardWrapper>
      <div className="flex w-full m-auto font-Inter p-5 pt-25 max-w-6xl">
        {/* Sidebar tabs */}
        <div className="flex flex-col w-48 border-r border-gray-300 pr-4">
          {role === "admin" && (
            <button
              className={`text-left px-4 py-2 mb-2 rounded cursor-pointer text-[#dc117b] font-semibold`}
            >
              Set Questions
            </button>
          )}
          {role === "principal" && (
            <button
              className={`text-left px-4 py-2 rounded cursor-pointer text-[#dc117b] font-semibold`}
            >
              Create Users
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pl-6">
          {role === "admin" && (
            <div data-aos="fade-up">
              <h1 className="text-2xl font-bold mb-4">
                {id ? "Edit" : "Set"} Question
              </h1>
              <form
                onSubmit={handleSubmitQuestion}
                className="space-y-4 max-w-lg mb-10"
              >
                <div>
                  <label className="block">Select Subject</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="mathematics">Mathematics</option>
                    <option value="english">English</option>
                    <option value="biology">Biology</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="physics">Physics</option>
                    <option value="government">Government</option>
                    <option value="crs">CRS</option>
                    <option value="economics">Economics</option>
                    <option value="literature">Literature-In-English</option>
                    <option value="fmaths">Further Mathematics</option>
                    <option value="fishery">Fishery</option>
                    <option value="civic">Civic Education</option>
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
                        id="questionImageInput"
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
                <div className="sm:col-span-2 flex justify-center mt-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-[#dc117b] text-white px-6 py-2 rounded hover:bg-[#ab0c5e] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed w-full"
                  >
                    {isUploading && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    )}
                    {isUploading
                      ? id
                        ? "Updating Question..."
                        : "Uploading Question..."
                      : id
                      ? "Update Question"
                      : "Upload Question"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {role === "principal" && (
            <div data-aos="fade-up">
              <h1 className="text-2xl font-bold mb-4">Create User</h1>
              <form
                onSubmit={handleSubmit(handleSubmitUser)}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label className="block mb-1">Username</label>
                  <input
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-[#dc117b] placeholder:text-sm"
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring focus:ring-[#dc117b] placeholder:text-sm"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1">Role</label>
                  <select
                    {...register("role", { required: "Role is required" })}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">-- Select Role --</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="principal">Principal</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 flex justify-center mt-4">
                  <button
                    type="submit"
                    disabled={isCreating || !isValid}
                    className="bg-[#dc117b] text-white px-6 py-2 rounded hover:bg-[#ab0c5e] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-30 disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
                  >
                    {isCreating && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    )}
                    {isCreating ? "Creating User..." : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default AdminPanel;
