import { ReactNode } from "react";
import Sidebar from "./sidebar";
import TopNavbar from "./navbar";

type DashboardWrapperProps = {
  children: ReactNode;
};

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="ml-[20%] w-4/5">
        <TopNavbar />
        <div>{children}</div>
      </div>
    </>
  );
};

export default DashboardWrapper;
