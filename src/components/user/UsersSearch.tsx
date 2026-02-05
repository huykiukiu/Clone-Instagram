import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userCacheKey } from "../../cache/userCacheKey";
import { instance } from "../../lib/httpRequest";

const addSearchHistory = async ({ searchedUserId, searchQuery }) => {
  const res = await instance.post("/search-history", {
    searchedUserId: searchedUserId,
    searchQuery: searchQuery,
  });
  return res.data;
};

export default function UsersSearch({ user, searchQuery }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addSearchHistoryMutation = useMutation({
    mutationFn: addSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userCacheKey.usersHistory });
      navigate(`/user/${user._id}`);
    },
    onError: (error) => {
      console.log("lỗi rồi", error);
    },
  });

  const handleSaveHistory = () => {
    addSearchHistoryMutation.mutate({
      searchedUserId: user._id,
      searchQuery: searchQuery,
    });
  };

  return (
    <div key={user?._id} className="flex items-center justify-between">
      <div className="flex gap-3 mb-3">
        <div>
          <img
            src={
              user?.profilePicture
                ? `${import.meta.env.VITE_BASE_URL}${user.profilePicture}`
                : "https://i.pinimg.com/1200x/b7/50/6a/b7506a538ae7017bd815d1ab26f59a76.jpg"
            }
            alt="user avatar"
            className="w-11 h-11 rounded-full object-cover select-none cursor-pointer"
            onClick={handleSaveHistory}
          />
        </div>
        <div className="text-white text-sm">
          <p>{user?.username}</p>
          <p className="text-gray-400">{user?.fullName}</p>
        </div>
      </div>
    </div>
  );
}
