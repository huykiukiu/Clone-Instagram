import { useNavigate } from "react-router-dom";
import { useAuth } from "../../stores/authStore";

export default function UserInfor() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  return (
    <div className="flex gap-3 mb-3">
      <div>
        <img
          src={`${import.meta.env.VITE_BASE_URL}${user?.profilePicture}`}
          alt="user avatar"
          className="w-11 h-11 rounded-full object-cover select-none cursor-pointer"
          onClick={() => navigate(`user/${user?._id}`)}
        />
      </div>
      <div className="text-white text-sm">
        <p>{user?.username}</p>
        <p className="text-gray-400">{user?.fullName}</p>
      </div>
    </div>
  );
}
