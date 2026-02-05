import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../lib/httpRequest";
import { postCacheKey } from "../../cache/postCacheKey";
import { useParams } from "react-router-dom";
import PostDetail from "../../components/home/PostDetail";
import { useState } from "react";
import { Spinner } from "../../components/ui/spinner";

const getUserSaved = async (userId) => {
  const res = await instance.get(`/posts/user/${userId}`, {
    params: {
      filter: "saved",
    },
  });
  return res.data;
};

const likePostAPI = async (postId: string): Promise<LikePostResponse> => {
  const response = await instance.post(`/posts/${postId}/like`);
  return response.data;
};

export default function UserSavePost() {
  const [openPostId, setOpenPostId] = useState("");
  const { id } = useParams();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (postId: string) => likePostAPI(postId),
    onSuccess: () => {
      console.log("Like thành công");
      queryClient.invalidateQueries({ queryKey: postCacheKey.userSaved });
    },
    onError: () => {
      console.log("like thất bại");
    },
  });
  const { data: userSaved, isLoading } = useQuery({
    queryKey: [...postCacheKey.userSaved, id],
    queryFn: () => getUserSaved(id),
  });
  const allUserPost = userSaved?.data.posts;
  console.log(userSaved);

  if (isLoading) {
    return (
      <div className="text-white absolute inset-0 top-1/2 left-1/2">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="text-white flex flex-wrap">
      {allUserPost?.map((userPost) => (
        <>
          {userPost.mediaType === "image" ? (
            <div className="basis-1/4">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${userPost.image}`}
                alt="image"
                className="w-full h-77 object-cover cursor-pointer"
                onClick={() => setOpenPostId(userPost._id)}
              />
              <PostDetail
                post={userPost}
                openPostDetail={openPostId === userPost._id}
                onSetOpenPostDetail={() => setOpenPostId(null)}
                onLikePost={mutation}
              />
            </div>
          ) : (
            <div className="basis-1/4">
              <video
                src={`${import.meta.env.VITE_BASE_URL}${userPost.video}`}
                className="w-full h-77 object-cover cursor-pointer"
                onClick={() => setOpenPostId(userPost._id)}
              ></video>
              <PostDetail
                post={userPost}
                openPostDetail={openPostId === userPost._id}
                onSetOpenPostDetail={() => setOpenPostId(null)}
                onLikePost={mutation}
              />
            </div>
          )}
        </>
      ))}
    </div>
  );
}
