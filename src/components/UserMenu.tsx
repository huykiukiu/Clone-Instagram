import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bookmark, LogOut, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../stores/authStore";
type SidebarPanel = "search" | "notification" | "message" | null;
export default function UserMenu({
  activePanel,
  onSetActivePanel,
}: {
  activePanel: string | null;
  onSetActivePanel: React.Dispatch<React.SetStateAction<SidebarPanel>>;
}) {
  const navigate = useNavigate();
  const logoutRequest = useAuth((state) => state.logout);
  const handleLogout = async () => {
    await logoutRequest();
    navigate("/login");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={() => onSetActivePanel(null)}>
        {activePanel ? (
          <div className="ml-3">
            <Menu className="text-white cursor-pointer" />
          </div>
        ) : (
          <div className="flex items-center gap-3 text-white cursor-pointer px-2 py-2 rounded-md hover:bg-gray-900 w-fit focus-visible:ring-0 select-none">
            <Menu />
            <span>Xem thêm</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52"
        align="right"
        sideOffset={8}
        alignOffset={50}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Bookmark /> <span>Bài viết đã lưu</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Sun /> <span>Chuyển chế độ</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onSelect={handleLogout}>
            <LogOut className="text-red-500" />
            <span className="text-red-500">Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
