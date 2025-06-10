import { useState } from "react";
import DashboardWrapper from "./dashboardWrapper";

const sampleScores = [
  {
    name: "Alice Johnson",
    subject: "Mathematics",
    score: 92,
    date: "2025-06-01",
    time: "30 mins",
  },
  {
    name: "Bob Smith",
    subject: "English",
    score: 85,
    date: "2025-06-02",
    time: "25 mins",
  },
  {
    name: "Charlie Lee",
    subject: "Chemistry",
    score: 78,
    date: "2025-06-01",
    time: "40 mins",
  },
  {
    name: "Alice Johnson",
    subject: "English",
    score: 88,
    date: "2025-06-03",
    time: "22 mins",
  },
  {
    name: "Bob Smith",
    subject: "Mathematics",
    score: 95,
    date: "2025-06-04",
    time: "28 mins",
  },
];

const Scores = () => {
  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = ["All", ...new Set(sampleScores.map((s) => s.subject))];

  const filteredScores =
    selectedSubject === "All"
      ? sampleScores
      : sampleScores.filter((s) => s.subject === selectedSubject);

  return (
    <DashboardWrapper>
      <div className="w-full m-auto font-Inter p-5 pt-25">
        <h1 className="text-2xl font-semibold mb-4">RESULTS</h1>

        <div className="mb-4">
          <label htmlFor="subject" className="mr-2 font-medium">
            Filter by Subject:
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 border rounded"
          >
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Name</th>
                <th className="px-4 py-2 text-left border">Subject</th>
                <th className="px-4 py-2 text-left border">Score</th>
                <th className="px-4 py-2 text-left border">Date Taken</th>
                <th className="px-4 py-2 text-left border">Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No results found.
                  </td>
                </tr>
              ) : (
                filteredScores.map((score, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 border">{score.name}</td>
                    <td className="px-4 py-2 border">{score.subject}</td>
                    <td className="px-4 py-2 border">{score.score}</td>
                    <td className="px-4 py-2 border">{score.date}</td>
                    <td className="px-4 py-2 border">{score.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Scores;
