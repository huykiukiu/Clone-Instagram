import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import SelectGenderForm from "../../components/SelectGenderForm";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../stores/authStore";
import { instance } from "../../lib/httpRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userCacheKey } from "../../cache/userCacheKey";
import { Spinner } from "../../components/ui/spinner";

const getCurrentUserProfile = async ({
  fullName,
  bio,
  website,
  gender,
  profilePicture,
}) => {
  const formData = new FormData();
  const res = await instance.patch("/users/profile");
  return res.data;
};

const updateProfile = async () => {
  const res = await instance.get("/users/profile");
  return res.data;
};

export default function EditProfileForm() {
  const user = useAuth((state) => state.user);
  const { data, isLoading } = useQuery({
    queryKey: userCacheKey.userCurrentProfile,
    queryFn: getCurrentUserProfile,
  });
  const currentUser = data?.data;

  if (isLoading) {
    return (
      <div className="text-white absolute inset-0 top-1/2 left-1/2">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-175">
      <h1 className="text-white text-xl font-bold my-10">
        Chỉnh sửa trang cá nhân
      </h1>
      <form className="bg-[#18181b] rounded-md">
        <div className="flex justify-between items-center px-4 bg-gray-900 py-3 rounded-md mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div>
              <img
                src={`${import.meta.env.VITE_BASE_URL}${currentUser?.profilePicture}`}
                alt="user avatar"
                className="w-15 h-15 rounded-full object-cover select-none cursor-pointer"
              />
            </div>
            <div className="text-white text-sm">
              <p className="font-bold">{currentUser?.username}</p>
              <p className="text-gray-400">{currentUser?.fullName}</p>
            </div>
          </div>
          <label
            htmlFor="file"
            className="bg-blue-500 text-white px-5 py-1 rounded-md"
          >
            Đổi ảnh
          </label>
          <input id="file" type="file" className="hidden" />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Họ và tên</label>
          <Input
            className="text-white outline-none"
            placeholder="Họ và tên..."
            value={user?.fullName}
          />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Tiểu sử</label>
          <Textarea placeholder="Nhập tiểu sử..." value={currentUser?.bio} />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Trang web</label>
          <Input
            className="text-white outline-none"
            placeholder="Trang web..."
            value={currentUser?.website}
          />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Giới tính</label>
          <SelectGenderForm value={currentUser?.gender} />
        </div>
        <div className="flex justify-center">
          <Button className="bg-blue-500 cursor-pointer">Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  );
}
