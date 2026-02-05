import { useEffect, useState } from "react";
import { instance } from "../lib/httpRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userCacheKey } from "../cache/userCacheKey";
import UsersSearch from "./user/UsersSearch";
import UsersHistory from "./user/UsersHistory";
import { Spinner } from "./ui/spinner";

const getSearchHistory = async () => {
  const res = await instance.get(`/search-history`);
  return res.data;
};

const deleteAllSearchHistory = async () => {
  const res = await instance.delete(`/search-history`);
  return res.data;
};

const searchUsers = async (debounceValue) => {
  const res = await instance.get("/users/search", {
    params: {
      q: debounceValue,
    },
  });
  return res.data;
};
export default function SearchPanel() {
  const [value, setValue] = useState("");
  const [debounceValue, setDebounceValue] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  const queryClient = useQueryClient();
  const deleteHistoryMutation = useMutation({
    mutationFn: deleteAllSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userCacheKey.usersHistory });
    },
    onError: (error) => {
      console.log("lỗi khi xóa tất cả lịch sử tìm kiếm", error);
    },
  });

  const { data: history, isLoading } = useQuery({
    queryKey: userCacheKey.usersHistory,
    queryFn: getSearchHistory,
  });
  const usersHistory = history?.data;
  console.log(usersHistory);

  const { data: users } = useQuery({
    queryKey: [userCacheKey.usersSearch, debounceValue],
    queryFn: () => searchUsers(debounceValue),
    enabled: debounceValue.trim().length > 0,
  });
  const usersSearch = users?.data;

  return (
    <div className="min-h-dvh w-full max-w-80 border-r border-r-gray-800 px-4 py-9 fixed">
      <h1 className="text-xl font-bold text-white mb-5">Tìm kiếm</h1>
      <input
        type="search"
        className="w-full h-10 rounded-full bg-[#25292e] text-white placeholder:text-gray-400 px-3 mb-5"
        placeholder="Tìm kiếm..."
        onChange={(e) => setValue(e.target.value)}
      />
      {/* end search input */}

      <div className="search-block max-h-[500px] overflow-y-auto">
        {usersSearch?.map((user) => (
          <UsersSearch user={user} searchQuery={debounceValue} />
        ))}
      </div>
      {/* end result search */}

      {usersSearch ? (
        ""
      ) : (
        <div>
          <div className="flex justify-between items-center text-white mb-5">
            <p>Mới đây</p>
            <p
              className="text-blue-500 text-sm hover:underline cursor-pointer"
              onClick={() => deleteHistoryMutation.mutate()}
            >
              Xóa tất cả
            </p>
          </div>
          {usersHistory?.map((item) => (
            <UsersHistory key={item._id} history={item} searchQuery={value} />
          ))}
        </div>
      )}

      {/* end history search */}
    </div>
  );
}
