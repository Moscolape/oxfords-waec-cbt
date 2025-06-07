import { useState } from "react";
import DashboardWrapper from "./dashboardWrapper";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const [name, setName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [testType, setTestType] = useState("");
  const [routing, setRouting] = useState(false);

  const navigate = useNavigate();

  const takeTest = () => {
    setRouting(true);
    localStorage.setItem("candidateName", name);
    localStorage.setItem("selectedSubject", selectedSubject);
    localStorage.setItem("testType", testType);

    setTimeout(() => {
      navigate(`/take-test/${selectedSubject}`);
    }, 3000);
  };

  const isFormValid =
    name.trim() !== "" && selectedSubject !== "" && testType !== "";

  return (
    <DashboardWrapper>
      <div className="w-full m-auto font-Inter p-10">
        <div className="w-full mx-auto">
          <h2 className="text-xl font-semibold mb-2">Enter Your Name</h2>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-8 focus:outline-1"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <h2 className="text-xl font-semibold mb-2">Select A Subject</h2>
          <select
            className="w-full p-2 border border-gray-300 rounded mb-8 focus:outline-1"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select a subject</option>
            <option value="english">English</option>
            <option value="mathematics">Mathematics</option>
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
          <h2 className="text-xl font-semibold mb-2">Pick A Type</h2>
          <select
            className="w-full p-2 border border-gray-300 rounded mb-8 focus:outline-1"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="">Choose test type</option>
            <option value="A">Type A</option>
            <option value="B">Type B</option>
            <option value="C">Type C</option>
            <option value="D">Type D</option>
          </select>
          <button
            disabled={!isFormValid || routing}
            className={`${
              !isFormValid || routing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#14346f] hover:bg-[#1a4aa3] cursor-pointer"
            } text-white py-2 px-4 gap-2 rounded flex items-center justify-center`}
            onClick={takeTest}
          >
            {routing && (
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
            Start Test
          </button>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Test;
