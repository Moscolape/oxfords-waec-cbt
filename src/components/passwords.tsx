import { useEffect, useState } from "react";
import DashboardWrapper from "./dashboardWrapper";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import Pagination from "./pagination";

type Student = {
  username: string;
  password: string;
};

const LoginDetails = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const itemsPerPage = 10;

  const fetchStudents = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://oxfords-waec-cbt-backend.onrender.com/api/v1/auth/getAllStudents?page=${page}&limit=${itemsPerPage}`
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch students");

      setStudents(data.students || []);
      setTotalItems(data.total || 0);
    } catch (error) {
      toast.error("Failed to load login details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleCopy = (username: string, password: string) => {
    const text = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <DashboardWrapper>
      <div className="w-full m-auto font-Inter p-5 pt-25">
        <h1 className="text-2xl font-semibold mb-6">Login Details</h1>

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
        ) : students.length === 0 ? (
          <p>No student login details found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-bounce">
              {students.map((student, index) => (
                <div
                  key={index}
                  className="p-4 border rounded shadow-sm bg-white flex flex-col gap-2 relative"
                >
                  <p>
                    <strong>Username:</strong> {student.username}
                  </p>
                  <p>
                    <strong>Password:</strong> {student.password}
                  </p>
                  <button
                    onClick={() => handleCopy(student.username, student.password)}
                    className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition absolute top-2 right-2"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>

            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default LoginDetails;
