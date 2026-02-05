import { Grid3x3, Bookmark, ListVideo } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userCacheKey } from "../cache/userCacheKey";
import { instance } from "../lib/httpRequest";
import { useParams } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import { Spinner } from "../components/ui/spinner";

const getUserByID = async (id) => {
  const res = await instance.get(`/users/${id}`);
  return res.data;
};

const followUser = async (userId) => {
  const res = await instance.post(`/follow/${userId}/follow`);
  return res.data;
};

export default function ProfilePage() {
  const myProfile = useAuth((state) => state.user);
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: [...userCacheKey.userProfile, id],
    queryFn: () => getUserByID(id),
    enabled: !!id,
  });
  const userData = user?.data;
  console.log(userData);

  const queryClient = useQueryClient();
  const followUserMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userCacheKey.userProfile });
    },
    onError: (error) => {
      console.log("lỗi khi thực hiện follow người dùng", error);
    },
  });

  if (isLoading) {
    return (
      <div className="text-white absolute inset-0 top-1/2 left-1/2">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto">
      <div className="w-[70%] mx-auto flex items-center gap-10 pt-10 mb-6">
        <div>
          <img
            src={
              userData?.profilePicture
                ? `${import.meta.env.VITE_BASE_URL}${userData.profilePicture}`
                : "https://i.pinimg.com/1200x/b7/50/6a/b7506a538ae7017bd815d1ab26f59a76.jpg"
            }
            alt="User avatar"
            className="w-40 h-40 max-w-full object-cover rounded-full"
          />
        </div>
        <div className="text-white space-y-2">
          <h3 className="text-xl font-bold">{userData?.username}</h3>
          <p>{userData?.fullName}</p>
          <div className="text-white flex gap-5">
            <p>{userData?.postsCount} bài viết</p>
            <p>
              <span className="font-extrabold cursor-pointer">
                {userData?.followersCount}
              </span>{" "}
              người theo dõi
            </p>
            <p>
              Đang theo dõi{" "}
              <span className="font-extrabold cursor-pointer">
                {userData?.followingCount}
              </span>{" "}
              người dùng
            </p>
          </div>
          <p>{userData?.bio}</p>
          <a
            href={`${userData?.website}`}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {userData?.website}
          </a>
        </div>
      </div>
      {/* end user infor */}
      {userData?.isFollowing ? (
        <div className="w-[70%] mx-auto flex gap-2 text-white mb-12">
          <button className="bg-[#25292E] flex-1 py-2 rounded-xl cursor-pointer">
            Chỉnh sửa trang cá nhân
          </button>
          <button className="bg-[#25292E] flex-1 py-2 rounded-xl cursor-pointer">
            Xem kho lưu trữ
          </button>
        </div>
      ) : myProfile?._id === userData._id ? (
        <div className="w-[70%] mx-auto flex gap-2 text-white mb-12">
          <button className="bg-[#25292E] flex-1 py-2 rounded-xl cursor-pointer">
            Chỉnh sửa trang cá nhân
          </button>
          <button className="bg-[#25292E] flex-1 py-2 rounded-xl cursor-pointer">
            Xem kho lưu trữ
          </button>
        </div>
      ) : (
        <div className="w-[70%] mx-auto flex gap-2 text-white mb-12">
          <button
            className="bg-blue-500 flex-1 py-2 rounded-xl cursor-pointer"
            onClick={() => followUserMutation.mutate(id)}
          >
            Theo dõi
          </button>
        </div>
      )}
      {/* end user action */}
      <div className="w-[70%] mx-auto text-white flex justify-around mb-3">
        <Grid3x3 className="cursor-pointer" />
        <Bookmark className="cursor-pointer" />
        <ListVideo className="cursor-pointer" />
      </div>
      <hr className="border-gray-800" />
      {/* end user post */}
    </div>
  );
}
