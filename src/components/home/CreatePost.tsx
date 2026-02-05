import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image, SquarePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { instance } from "../../lib/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCacheKey } from "../../cache/postCacheKey";

const createPost = async ({ file, caption }) => {
  const formData = new FormData();
  formData.append("file", file);
  if (caption) {
    formData.append("caption", caption);
  }
  const res = await instance.post("/posts", formData);
  return res.data;
};

export function CreatePost({ openAddPostModal, onSetOpenPostModal }) {
  const [file, setFile] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  console.log(previewUrl);

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postCacheKey.list });
      onSetOpenPostModal(false);
    },
    onError: (error) => {
      console.log("lỗi khi tạo bài viết", error);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    createPostMutation.mutate({
      file: file,
      caption: value,
    });
  };

  const handleCancelPosting = () => {
    setFile("");
    setPreviewUrl("");
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // revoke blob cũ trước khi tạo blob mới
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const previewLink = URL.createObjectURL(file);
    setFile(file);
    setPreviewUrl(previewLink);
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      setFile("");
    };
  }, [openAddPostModal]);
  return (
    <Dialog open={openAddPostModal} onOpenChange={onSetOpenPostModal}>
      <DialogContent className="bg-[#212328] text-white">
        <DialogHeader>
          <DialogTitle className="border-b border-b-gray-500">
            Tạo bài viết mới
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {previewUrl ? (
          <div>
            <div className="flex justify-center mb-3">
              {file.type.includes("image") ? (
                <img
                  src={previewUrl}
                  alt="image upload"
                  className="object-cover"
                />
              ) : file.type.includes("video") ? (
                <video
                  src={previewUrl}
                  className="max-h-96"
                  autoPlay
                  controls
                ></video>
              ) : null}
            </div>
            {/* end display file-video */}
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="flex justify-between items-center gap-5"
            >
              <div className="flex-1">
                <input
                  type="text"
                  className="outline-none w-full px-4 h-10"
                  placeholder="Viết caption..."
                  onChange={(e) => setValue(e.target.value.trim())}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-red-500 cursor-pointer"
                  onClick={handleCancelPosting}
                >
                  Hủy
                </button>
                <button className="text-blue-500 cursor-pointer">Đăng</button>
              </div>
            </form>
            {/* end action form*/}
          </div>
        ) : (
          <div className="min-h-[70vh] flex flex-col justify-center">
            <div className="mx-auto flex">
              <Image size={70} />
              <SquarePlay size={70} />
            </div>
            <p className="mx-auto mb-5">Tải ảnh và video vào đây</p>
            <div className="mx-auto">
              <label
                htmlFor="updateFile"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
              >
                Chọn từ máy tính
              </label>
              <input
                id="updateFile"
                type="file"
                className="hidden"
                onChange={(e) => handleUploadFile(e)}
              />
            </div>
          </div>
          // End choose file
        )}
      </DialogContent>
    </Dialog>
  );
}
