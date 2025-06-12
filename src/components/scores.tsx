import { useEffect, useState } from "react";
import DashboardWrapper from "./dashboardWrapper";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import Pagination from "./pagination";

type Score = {
  name: string;
  subject: string;
  testType: string;
  percentage: number;
  submittedAt: string;
};

const Scores = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const itemsPerPage = 10;

  const fetchScores = async (page: number, subject: string) => {
    setLoading(true);
    setError("");

    const subjectQuery =
      subject === "All" ? "" : `&subject=${encodeURIComponent(subject)}`;

    try {
      const response = await fetch(
        `https://oxfords-waec-cbt-backend.onrender.com/api/v1/testSubmissions?page=${page}&limit=${itemsPerPage}${subjectQuery}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch scores");
      }

      setScores(data.submissions || []);
      setTotalItems(data.totalCount); // Backend must return total count for filtered results
    } catch (err) {
      console.error(err);
      setError("Error fetching scores.");
      toast.error("Error fetching scores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(currentPage, selectedSubject);
  }, [currentPage, selectedSubject]);

  const subjects = [
  "mathematics", "english", "biology", "chemistry", "physics",
  "government", "crs", "economics", "literature", "fmaths", "fishery", "civic"
];

  const filteredScores =
    selectedSubject === "All"
      ? scores
      : scores.filter((s) => s.subject === selectedSubject);

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
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border rounded"
          >
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <ScaleLoader color="#dc117b" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto animate-fadeUp">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border">Name</th>
                  <th className="px-4 py-2 text-left border">Subject</th>
                  <th className="px-4 py-2 text-left border">Test Type</th>
                  <th className="px-4 py-2 text-left border">Score</th>
                  <th className="px-4 py-2 text-left border">Submitted At</th>
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
                      <td className="px-4 py-2 border">
                        {score.subject.charAt(0).toUpperCase() +
                          score.subject.slice(1)}
                      </td>
                      <td className="px-4 py-2 border">{score.testType}</td>
                      <td className="px-4 py-2 border">{score.percentage}%</td>
                      <td className="px-4 py-2 border">
                        {new Date(score.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {filteredScores.length > 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardWrapper>
  );
};

export default Scores;
