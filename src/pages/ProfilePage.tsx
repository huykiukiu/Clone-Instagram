import { Grid3x3, Bookmark, ListVideo } from "lucide-react";
export default function ProfilePage() {
  return (
    <div className="w-[90%] mx-auto">
      <div className="w-[70%] mx-auto flex items-center gap-10 pt-10 mb-6">
        <div>
          <img
            src="https://i.pinimg.com/1200x/b7/50/6a/b7506a538ae7017bd815d1ab26f59a76.jpg"
            alt="User avatar"
            className="w-40 h-40 max-w-full object-cover rounded-full"
          />
        </div>
        <div className="text-white space-y-2">
          <h3 className="text-xl font-bold">Username</h3>
          <p>fullName</p>
          <div className="text-white flex gap-5">
            <p>0 bài viết</p>
            <p>0 người theo dõi</p>
            <p>Đang theo dõi 2 người</p>
          </div>
          <p>Tiểu sử</p>
        </div>
      </div>
      {/* end user infor */}
      <div className="w-[70%] mx-auto flex gap-2 text-white mb-12">
        <button className="bg-[#25292E] flex-1 py-2 rounded-xl cursor-pointer">
          Chỉnh sửa trang cá nhân
        </button>
        <button className="bg-[#25292E] flex-1 py-2 rounded-xl cursor-pointer">
          Xem kho lưu trữ
        </button>
      </div>
      {/* end user action */}
      <div className="w-[70%] mx-auto text-white flex justify-around mb-3">
        <Grid3x3 />
        <Bookmark />
        <ListVideo />
      </div>
      <hr className="border-gray-800" />
      {/* end user post */}
    </div>
  );
}
