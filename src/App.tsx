import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/protectedRoutes";

const Login = lazy(() => import("./pages/login"));

const Dashboard = lazy(() => import("./components/dashboard"));
const Scores = lazy(() => import("./components/scores"));
const Test = lazy(() => import("./components/test"));

const Mathematics = lazy(() => import("./components/subjects/mathematics"));
const English = lazy(() => import("./components/subjects/english"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-[#be202f] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protect Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scores" element={<Scores />} />

            <Route path="/take-test" element={<Test />} />
            <Route path="/take-test/mathematics" element={<Mathematics />} />
            <Route path="/take-test/english" element={<English />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
