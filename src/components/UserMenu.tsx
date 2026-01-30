import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bookmark, LogOut, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";
export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 text-white cursor-pointer px-2 py-2 rounded-md hover:bg-gray-900 w-fit focus-visible:ring-0 select-none">
          <Menu />
          <span>Xem thêm</span>
        </div>
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
          <DropdownMenuItem className="cursor-pointer">
            <LogOut className="text-red-500" />{" "}
            <span className="text-red-500">Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
