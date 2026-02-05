import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../lib/httpRequest";
import { userCacheKey } from "../../cache/userCacheKey";
import { useNavigate } from "react-router-dom";

const deleteHistoryItem = async (historyId) => {
  const res = await instance.delete(`/search-history/${historyId}`);
  return res.data;
};

export default function UsersHistory({ history }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteHistoryItemMutation = useMutation({
    mutationFn: deleteHistoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userCacheKey.usersHistory });
    },
    onError: () => {},
  });

  const handleDeleteHistoryItem = (historyId) => {
    deleteHistoryItemMutation.mutate(historyId);
  };

  return (
    <div
      key={history?._id}
      className="flex items-center justify-between cursor-pointer hover:bg-gray-900 py-2"
    >
      <div className="flex gap-3 mb-3">
        <div>
          <img
            src={
              history?.searchedUserId.profilePicture
                ? `${import.meta.env.VITE_BASE_URL}${history.searchedUserId.profilePicture}`
                : "https://i.pinimg.com/1200x/b7/50/6a/b7506a538ae7017bd815d1ab26f59a76.jpg"
            }
            alt="user avatar"
            className="w-11 h-11 rounded-full object-cover select-none cursor-pointer"
            onClick={() => navigate(`/user/${history.searchedUserId._id}`)}
          />
        </div>
        <div className="text-white text-sm">
          <p>{history?.searchedUserId.username}</p>
          <p className="text-gray-400">{history?.searchedUserId.fullName}</p>
        </div>
      </div>
      <X
        className="text-white hover:text-red-500 cursor-pointer"
        onClick={() => handleDeleteHistoryItem(history?._id)}
      />
    </div>
  );
}
