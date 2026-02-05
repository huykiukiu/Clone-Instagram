import { useState } from "react";
import PostDetail from "../home/PostDetail";
import { instance } from "../../lib/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCacheKey } from "../../cache/postCacheKey";
import { exploreCacheKey } from "../../cache/exploreCache";
const likePostAPI = async (postId: string): Promise<LikePostResponse> => {
  const response = await instance.post(`/posts/${postId}/like`);
  return response.data;
};
export default function ExplorePost({ post }) {
  const [openPostId, setOpenPostId] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (postId: string) => likePostAPI(postId),
    onSuccess: () => {
      console.log("Like thành công");
      queryClient.invalidateQueries({ queryKey: exploreCacheKey.explore });
    },
    onError: () => {
      console.log("like thất bại");
    },
  });
  return (
    <div key={post._id} className="basis-1/5">
      {post.image ? (
        <div>
          <img
            src={`${import.meta.env.VITE_BASE_URL}${post.image}`}
            alt="image"
            className="w-full h-77 object-cover cursor-pointer"
            onClick={() => setOpenPostId(post._id)}
          />
          <PostDetail
            post={post}
            openPostDetail={openPostId === post._id}
            onSetOpenPostDetail={() => setOpenPostId(null)}
            onLikePost={mutation}
          />
        </div>
      ) : (
        <div>
          <video
            src={`${import.meta.env.VITE_BASE_URL}${post.video}`}
            className="w-full h-77 object-cover cursor-pointer"
            autoPlay
            muted
            onClick={() => setOpenPostId(post._id)}
          ></video>
          <PostDetail
            post={post}
            openPostDetail={openPostId === post._id}
            onSetOpenPostDetail={() => setOpenPostId(null)}
            onLikePost={mutation}
          />
        </div>
      )}
    </div>
  );
}
