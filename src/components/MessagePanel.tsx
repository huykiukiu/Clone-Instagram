import { useAuth } from "../stores/authStore";
import { SquarePen } from "lucide-react";
export default function MessagePanel() {
  const user = useAuth((state) => state.user);
  return (
    <div className="min-h-dvh w-full max-w-80 border-r border-r-gray-800 py-9 px-4 fixed">
      <div className="text-xl font-bold text-white mb-5 flex items-center justify-between">
        {user?.username} <SquarePen className="cursor-pointer" />
      </div>
      <input
        type="search"
        className="w-full h-10 rounded-full bg-[#25292e] text-white placeholder:text-gray-400 px-3"
        placeholder="Tìm kiếm..."
      />
    </div>
  );
}
