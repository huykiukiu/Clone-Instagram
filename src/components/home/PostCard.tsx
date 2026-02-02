import { Heart, MessageCircle, Send, Bookmark, Ellipsis } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCacheKey } from "../../cache/postCacheKey";
import { instance } from "../../lib/httpRequest";
export type PostUser = {
  _id: string;
  username: string;
} | null;

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

export type PostFeedData = {
  posts: Post[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type PostFeedResponse = {
  message: string;
  data: PostFeedData;
  success: boolean;
};
type PostCardProps = {
  data: Post[];
};
type LikePostResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    likes: number;
  };
};
// import { useAuth } from "../../stores/authStore";
import { cn } from "../../lib/utils";
import PostDetail from "./PostDetail";
import { useState } from "react";
// const likePostAPI = async (postId: string): Promise<LikePostResponse> => {
//   const token = useAuth.getState().token;
//   const response = await fetch(
//     `${import.meta.env.VITE_BASE_URL}/api/posts/${postId}/like`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );
//   return response.json();
// };
const likePostAPI = async (postId: string): Promise<LikePostResponse> => {
  const response = await instance.post(`/posts/${postId}/like`);
  return response.data;
};
export default function PostCard({ data }: PostCardProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (postId: string) => likePostAPI(postId),
    onSuccess: () => {
      console.log("Like thành công");
      queryClient.invalidateQueries({ queryKey: postCacheKey.list });
    },
    onError: () => {
      console.log("like thất bại");
    },
  });
  return (
    <>
      {data.map((post) => (
        <div key={post._id} className="w-full max-w-[500px] mb-10">
          <div className="flex justify-between items-center w-full max-w-[500px] mb-3">
            <div className="flex items-center gap-3">
              <img
                src="https://picsum.photos/200"
                alt="user avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-semibold">{post.userId?.username}</span>
            </div>

            <Ellipsis className="cursor-pointer" />
          </div>
          <div className="mb-3">
            {post.mediaType === "image" ? (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${post.image}`}
                alt="post image"
                className="max-w-full object-cover rounded-md cursor-pointer"
                onClick={() => setOpenPostId(post._id)}
              />
            ) : (
              <video
                src={`${import.meta.env.VITE_BASE_URL}${post.video}`}
                autoPlay
                muted
                className="max-w-full object-cover rounded-md cursor-pointer"
                onClick={() => setOpenPostId(post._id)}
              ></video>
            )}
          </div>
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Heart
                  className={cn(
                    post.isLiked
                      ? "text-red-500 fill-red-500 cursor-pointer"
                      : "text-white cursor-pointer",
                  )}
                  onClick={() => mutation.mutate(post._id)}
                />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle
                  className="text-white cursor-pointer"
                  onClick={() => setOpenPostId(post._id)}
                />
                <span>{post.comments}</span>
              </div>

              <Send className="text-white cursor-pointer" />
            </div>
            <Bookmark className="text-white cursor-pointer" />
          </div>
          <div className="text-white flex items-center gap-2">
            <span className="font-semibold">{post.userId?.username}</span>
            <p className="font-semibold">{post.caption}</p>
          </div>
          <PostDetail
            post={post}
            openPostDetail={openPostId === post._id}
            onSetOpenPostDetail={() => setOpenPostId(null)}
            // onLikePost={() => mutation.}
          />
        </div>
      ))}
    </>
  );
}
