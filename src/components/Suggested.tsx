import { Link } from "react-router-dom";
import { instance } from "../lib/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { userCacheKey } from "../cache/userCacheKey";
import UserSuggested from "./user/UserSuggested";
import { Spinner } from "./ui/spinner";
const getSuggestedUsers = async () => {
  const res = await instance.get("/users/suggested", {
    params: {
      limit: 5,
    },
  });
  return res.data;
};
export default function Suggested() {
  const { data: suggestedUser, isLoading } = useQuery({
    queryKey: userCacheKey.suggestedUsers,
    queryFn: getSuggestedUsers,
  });
  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  return (
    <div>
      <div className="text-white flex justify-between mb-3">
        <h1>Gợi ý cho bạn</h1>
        <Link>Xem tất cả</Link>
      </div>
      <div>
        {suggestedUser?.data.map((user) => (
          <UserSuggested
            key={user._id}
            userId={user._id}
            username={user.username}
            fullName={user.fullName}
            userPicture={user.profilePicture}
          />
        ))}
      </div>
    </div>
  );
}
