import { Link } from "react-router-dom";
import { instance } from "../lib/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { userCacheKey } from "../cache/userCacheKey";
import UserSuggested from "./user/UserSuggested";
const getSuggestedUsers = async () => {
  const res = await instance.get("/users/suggested", {
    params: {
      limit: 5,
    },
  });
  return res.data;
};
export default function Suggested() {
  const { data: suggestedUser } = useQuery({
    queryKey: userCacheKey.suggestedUsers,
    queryFn: getSuggestedUsers,
  });
  console.log(suggestedUser);
  return (
    <div>
      <div className="text-white flex justify-between mb-3">
        <h1>Gợi ý cho bạn</h1>
        <Link>Xem tất cả</Link>
      </div>
      <div>
        {suggestedUser?.data.map((user) => (
          <UserSuggested
            username={user.username}
            fullName={user.fullName}
            userPicture={user.profilePicture}
          />
        ))}
      </div>
    </div>
  );
}
