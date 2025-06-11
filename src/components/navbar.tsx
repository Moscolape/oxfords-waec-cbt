import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import Logout from "./logout";

export default function TopNavbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="fixed w-4/5 h-20 shadow sidebar z-50">
      <div className="flex items-center justify-between relative p-4">
        <h1 className="text-2xl font-bold font-Montserrat text-white" data-aos="fade-left">
          OXFORDS CBT PRACTICE FOR PROSPECTIVE WAEC STUDENTS
        </h1>

        <div
          className="rounded-full bg-[#dc117b] hover:bg-[#ab0c5e] p-2 cursor-pointer hover:rotate-[360deg] transition-transform"
          title="Log out"
          onClick={() => setShowModal(true)}
        >
          <LogOutIcon className="text-white w-5 h-5" />
        </div>
      </div>

      {showModal && <Logout close={() => setShowModal(false)} />}
    </div>
  );
}
