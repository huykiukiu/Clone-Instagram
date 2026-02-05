import { useNavigate } from "react-router-dom";

export default function UserSuggested({
  username,
  fullName,
  userPicture,
  userId,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex gap-3 justify-between items-center">
        <div>
          <img
            src={
              userPicture
                ? `${import.meta.env.VITE_BASE_URL}${userPicture}`
                : `https://i.pinimg.com/1200x/b7/50/6a/b7506a538ae7017bd815d1ab26f59a76.jpg`
            }
            alt="user avatar"
            className="w-11 h-11 rounded-full object-cover select-none cursor-pointer"
            onClick={() => navigate(`/user/${userId}`)}
          />
        </div>
        <div className="text-white text-sm">
          <p>{username}</p>
          <p className="text-gray-400">{fullName}</p>
        </div>
      </div>
      <button className="text-blue-500 text-sm cursor-pointer">Theo dõi</button>
    </div>
  );
}
