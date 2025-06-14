import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/protectedRoutes";
import initializeAOS from "./utils/aos-init";
import { HashLoader } from "react-spinners";

const Login = lazy(() => import("./pages/login"));

const Dashboard = lazy(() => import("./components/dashboard"));
const LoginDetails = lazy(() => import("./components/passwords"));
const Scores = lazy(() => import("./components/scores"));
const Panel = lazy(() => import("./components/panel"));
const Questions = lazy(() => import("./components/allQuestions"));
const Test = lazy(() => import("./components/test"));

const Mathematics = lazy(() => import("./components/subjects/mathematics"));
const English = lazy(() => import("./components/subjects/english"));
const Physics = lazy(() => import("./components/subjects/physics"));
const Chemistry = lazy(() => import("./components/subjects/chemistry"));
const Biology = lazy(() => import("./components/subjects/biology"));
const Government = lazy(() => import("./components/subjects/government"));
const CRS = lazy(() => import("./components/subjects/crs"));
const Literature = lazy(() => import("./components/subjects/literature"));
const Civic = lazy(() => import("./components/subjects/civic"));
const Economics = lazy(() => import("./components/subjects/economics"));
const Fishery = lazy(() => import("./components/subjects/fishery"));
const FMaths = lazy(() => import("./components/subjects/fmaths"));

function App() {
  useEffect(() => {
    initializeAOS();
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <HashLoader
            color="#dc117b"
            aria-label="Loading Spinner"
            data-testid="loader"
          />{" "}
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
            <Route path="/take-test/physics" element={<Physics />} />
            <Route path="/take-test/chemistry" element={<Chemistry />} />
            <Route path="/take-test/biology" element={<Biology />} />
            <Route path="/take-test/government" element={<Government />} />
            <Route path="/take-test/crs" element={<CRS />} />
            <Route path="/take-test/literature" element={<Literature />} />
            <Route path="/take-test/civic" element={<Civic />} />
            <Route path="/take-test/economics" element={<Economics />} />
            <Route path="/take-test/fishery" element={<Fishery />} />
            <Route path="/take-test/fmaths" element={<FMaths />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
