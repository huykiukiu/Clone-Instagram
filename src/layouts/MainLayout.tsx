import { useState } from "react";
import Sidebar from "../components/Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import MessagePanel from "../components/MessagePanel";
import { Outlet } from "react-router-dom";
import SearchPanel from "../components/SearchPanel";
type SidebarPanel = "search" | "notification" | "message" | null;
export default function MainLayout() {
  const [activePanel, setActivePanel] = useState<SidebarPanel>(null);
  return (
    <div className="min-h-dvh bg-black flex pl-20">
      <Sidebar activePanel={activePanel} onSetActivePanel={setActivePanel} />
      <div className="w-full max-w-80">
        {activePanel === "notification" && <NotificationPanel />}
        {activePanel === "search" && <SearchPanel />}
        {activePanel === "message" && <MessagePanel />}
      </div>
      <Outlet />
    </div>
  );
}
