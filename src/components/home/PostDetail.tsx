import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
export type Post = {
  _id: string;
  userId: PostUser;
  caption: string;
  image: string | null;
  video: string | null;
  mediaType: "image" | "video";
  likes: number;
  comments: number;
  likedBy: string[];
  savedBy: string[];
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
};
export type PostUser = {
  _id: string;
  username: string;
} | null;

type PostDetailProps = {
  post: Post;
  openPostDetail: boolean;
  onSetOpenPostDetail: (open: boolean) => void;
};

export default function PostDetail({
  post,
  openPostDetail,
  onSetOpenPostDetail,
}: PostDetailProps) {
  return (
    <Dialog open={openPostDetail} onOpenChange={onSetOpenPostDetail}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className="flex !max-w-[1000px] h-[80%] m-0 p-0 gap-0 border-0 overflow-hidden [&>button]:text-white">
        <DialogTitle></DialogTitle>
        <div className="flex-1 flex items-center justify-center bg-black">
          {post.mediaType === "image" ? (
            <div className="max-w-full h-full">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${post.image}`}
                alt="post image"
                className="max-w-full h-full object-cover"
              />
            </div>
          ) : (
            <video
              src={`${import.meta.env.VITE_BASE_URL}${post.video}`}
              autoPlay
              controls
              className="max-w-full h-full object-contain"
            ></video>
          )}
        </div>
        <div className="flex-1 bg-[#212328]"></div>
      </DialogContent>
    </Dialog>
  );
}
