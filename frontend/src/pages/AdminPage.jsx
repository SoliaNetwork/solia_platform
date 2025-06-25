import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function AdminPage() {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-64 z-10">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 p-6 bg-gray-950 min-h-screen text-white">
        <Outlet />
      </div>
    </div>
  );
}
