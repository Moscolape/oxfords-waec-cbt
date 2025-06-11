import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/protectedRoutes";
import initializeAOS from "./utils/aos-init";

const Login = lazy(() => import("./pages/login"));

const Dashboard = lazy(() => import("./components/dashboard"));
const LoginDetails = lazy(() => import("./components/passwords"));
const Scores = lazy(() => import("./components/scores"));
const Panel = lazy(() => import("./components/panel"));
const Questions = lazy(() => import("./components/allQuestions"));
const Test = lazy(() => import("./components/test"));

const Mathematics = lazy(() => import("./components/subjects/mathematics"));
const English = lazy(() => import("./components/subjects/english"));

function App() {
  useEffect(() => {
    initializeAOS();
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-[#14346f] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ToastContainer position="bottom-right" autoClose={2500} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protect Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/passwords" element={<LoginDetails />} />
            <Route path="/panel" element={<Panel />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/questions" element={<Questions />} />
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
