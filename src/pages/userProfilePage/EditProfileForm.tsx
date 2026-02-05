import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import SelectGenderForm from "../../components/SelectGenderForm";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../stores/authStore";
import { instance } from "../../lib/httpRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userCacheKey } from "../../cache/userCacheKey";
import { Spinner } from "../../components/ui/spinner";
import { useState, useEffect } from "react";

const getCurrentUserProfile = async () => {
  const res = await instance.get("/users/profile");
  return res.data;
};

const updateProfile = async (formData: FormData) => {
  const res = await instance.patch("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export default function EditProfileForm() {
  const user = useAuth((state) => state.user);
  const updateUser = useAuth((state) => state.updateUser);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: userCacheKey.userCurrentProfile,
    queryFn: getCurrentUserProfile,
  });
  const currentUser = data?.data;

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    website: "",
    gender: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || "",
        bio: currentUser.bio || "",
        website: currentUser.website || "",
        gender: currentUser.gender || "",
      });
      setPreviewImage(
        `${import.meta.env.VITE_BASE_URL}${currentUser.profilePicture}`,
      );
    }
  }, [currentUser]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      // Update authStore với dữ liệu mới từ response
      if (response?.data) {
        updateUser(response.data);
      }
      queryClient.invalidateQueries({
        queryKey: userCacheKey.userCurrentProfile,
      });
      alert("Cập nhật profile thành công!");
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Cập nhật thất bại!");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitFormData = new FormData();
    if (formData.fullName) submitFormData.append("fullName", formData.fullName);
    if (formData.bio) submitFormData.append("bio", formData.bio);
    if (formData.website) submitFormData.append("website", formData.website);
    if (formData.gender) submitFormData.append("gender", formData.gender);
    if (profilePicture) submitFormData.append("profilePicture", profilePicture);

    mutation.mutate(submitFormData);
  };

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
      <form onSubmit={handleSubmit} className="bg-[#18181b] rounded-md">
        <div className="flex justify-between items-center px-4 bg-gray-900 py-3 rounded-md mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div>
              <img
                src={previewImage}
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
            className="bg-blue-500 text-white px-5 py-1 rounded-md cursor-pointer"
          >
            Đổi ảnh
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Họ và tên</label>
          <Input
            name="fullName"
            className="text-white outline-none"
            placeholder="Họ và tên..."
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Tiểu sử</label>
          <Textarea
            name="bio"
            placeholder="Nhập tiểu sử..."
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Trang web</label>
          <Input
            name="website"
            className="text-white outline-none"
            placeholder="Trang web..."
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
        <div className="text-white px-4 mb-5">
          <label>Giới tính</label>
          <SelectGenderForm
            value={formData.gender}
            onValueChange={handleGenderChange}
          />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-blue-500 cursor-pointer"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
