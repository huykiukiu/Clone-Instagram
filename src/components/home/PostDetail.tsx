import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { instance } from "../../lib/httpRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postCacheKey } from "../../cache/postCacheKey";
import { Ellipsis, Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { formatInstagramTime } from "../../lib/helper";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { exploreCacheKey } from "../../cache/exploreCache";
import { Spinner } from "../ui/spinner";
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
  onLikePost: any;
};

type CommentUser = {
  _id: string;
  username: string;
  profilePicture: string | null;
};

type Comment = {
  _id: string;
  postId: string;
  userId: CommentUser;
  content: string;
  parentCommentId: string | null;
  likes: number;
  repliesCount: number;
  createdAt: string;
};

type CommentPagination = {
  currentPage: number;
  totalPages: number;
  totalComments: number;
  hasMore: boolean;
};

type GetPostCommentsResponse = {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    pagination: CommentPagination;
  };
};

const getPostComment = async (
  postId: string,
): Promise<GetPostCommentsResponse> => {
  const res = await instance.get<GetPostCommentsResponse>(
    `/posts/${postId}/comments`,
  );
  return res.data;
};
const createComment = async ({ postId, content, parentCommentId }) => {
  const res = await instance.post(`/posts/${postId}/comments`, {
    content,
    parentCommentId,
  });
  return res.data;
};
const likeComment = async ({ postId, commentId }) => {
  const res = await instance.post(
    `/posts/${postId}/comments/${commentId}/like`,
  );
  return res.data;
};
export default function PostDetail({
  post,
  openPostDetail,
  onSetOpenPostDetail,
  onLikePost,
}: PostDetailProps) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const handleCreateComment = (e, postId: string) => {
    e.preventDefault();
    mutation.mutate({
      postId: postId,
      content: comment,
      parentCommentId: null,
    });
  };
  const { data: comments, isLoading } = useQuery({
    queryKey: [...postCacheKey.comment, post._id],
    queryFn: () => getPostComment(post._id),
    enabled: openPostDetail,
  });
  const likeCommentMutation = useMutation({
    mutationFn: likeComment,
    onSuccess: (data, variables) => {
      console.log("like bình luận thành công");
      queryClient.invalidateQueries({
        queryKey: [`${postCacheKey.comment}`, variables.postId],
      });
    },
    onError: (error) => {
      console.log("like bình luận thất bại", error);
    },
  });
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      console.log("Comment bài viết thành công");
      queryClient.invalidateQueries({
        queryKey: [...postCacheKey.comment, variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: [postCacheKey.list],
      });
      setComment("");
    },
    onError: () => {
      console.log("Comment thất bại");
    },
  });

  return (
    <Dialog open={openPostDetail} onOpenChange={onSetOpenPostDetail}>
      <DialogContent className="flex !max-w-[1000px] h-[90%] m-0 p-0 gap-0 border-0 overflow-hidden [&>button]:text-white">
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
        {/* end media file post detail */}
        <div className="flex flex-col flex-1 bg-[#212328] py-3">
          <div className="flex items-center justify-between gap-3 text-white mt-10 px-4 mb-7">
            <div className="flex items-center gap-3">
              <img
                src="https://picsum.photos/200"
                alt="user avatar"
                className="w-9 h-9 rounded-full cursor-pointer object-cover"
              />
              <span className="font-bold cursor-pointer">
                {post.userId?.username}
              </span>
            </div>
            <Ellipsis className="cursor-pointer" />
          </div>
          <div className="flex-1 px-4 overflow-y-auto mb-5">
            <div className="flex items-center justify-between gap-3 mb-7">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://picsum.photos/200"
                    alt="user avatar"
                    className="w-8 h-8 rounded-full cursor-pointer object-cover"
                  />
                  <span className="text-sm text-white font-semibold cursor-pointer">
                    {post.userId?.username}
                  </span>
                </div>
                <p className="text-white font-light">{post.caption}</p>
              </div>
            </div>
            {/* end user and caption post detail */}
            {isLoading ? (
              <Spinner className="text-white w-10 h-10" />
            ) : (
              comments?.data.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-center justify-between gap-3 mb-7"
                >
                  <div className="group">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://picsum.photos/200"
                          alt="user avatar"
                          className="w-8 h-8 rounded-full cursor-pointer object-cover"
                        />
                        <span className="text-sm text-white font-semibold cursor-pointer">
                          {comment?.userId?.username}
                        </span>
                      </div>
                      <p className="text-white font-light">{comment.content}</p>
                    </div>
                    <div className="flex gap-3 ml-12">
                      <p className="text-gray-400 text-xs">
                        {formatInstagramTime(comment.createdAt)}
                      </p>
                      <p className="text-gray-400 text-xs cursor-pointer">
                        Trả lời
                      </p>
                    </div>
                  </div>
                  <Heart
                    size={17}
                    className="text-white cursor-pointer"
                    onClick={() =>
                      likeCommentMutation.mutate({
                        postId: post._id,
                        commentId: comment._id,
                      })
                    }
                  />
                </div>
              ))
            )}

            {/* {comments?.data.comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-center justify-between gap-3 mb-7"
              >
                <div className="group">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://picsum.photos/200"
                        alt="user avatar"
                        className="w-8 h-8 rounded-full cursor-pointer object-cover"
                      />
                      <span className="text-sm text-white font-semibold cursor-pointer">
                        {comment.userId?.username}
                      </span>
                    </div>
                    <p className="text-white font-light">{comment.content}</p>
                  </div>
                  <div className="flex gap-3 ml-12">
                    <p className="text-gray-400 text-xs">
                      {formatInstagramTime(comment.createdAt)}
                    </p>
                    <p className="text-gray-400 text-xs cursor-pointer">
                      Trả lời
                    </p>
                  </div>
                </div>
                <Heart
                  size={17}
                  className="text-white cursor-pointer"
                  onClick={() =>
                    likeCommentMutation.mutate({
                      postId: post._id,
                      commentId: comment._id,
                    })
                  }
                />
              </div>
            ))} */}
            {/* end list post detail */}
          </div>
          <div className="mb-2">
            <div className="text-white flex items-center justify-between px-4 mb-3">
              <div className="text-white flex items-center gap-5">
                <Heart
                  className={cn(
                    post.isLiked
                      ? "text-red-500 fill-red-500 cursor-pointer"
                      : "text-white cursor-pointer",
                  )}
                  onClick={() => onLikePost.mutate(post._id)}
                />
                <MessageCircle />
                <Send />
              </div>
              <Bookmark />
            </div>
            <p className="text-white text-sm px-4 mb-1">
              {post.likes} lượt thích
            </p>
            <p className="text-gray-400 text-xs px-4">
              {formatInstagramTime(post.createdAt)}
            </p>
          </div>
          {/* end action post detail */}
          <form
            onSubmit={(e) => handleCreateComment(e, post._id)}
            className="flex items-center px-2"
          >
            <input
              type="text"
              className="px-3 text-white w-full h-8 outline-none placeholder:text-sm"
              placeholder="Bình luận..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <button className="text-blue-500 font-bold cursor-pointer">
              Đăng
            </button>
          </form>
          {/* end input comment post detail */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
