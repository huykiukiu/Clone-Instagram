import { useQuery } from "@tanstack/react-query";
import { postCacheKey } from "../cache/postCacheKey";
import PostCard from "../components/home/PostCard";
import { instance } from "../lib/httpRequest";
import RightBar from "../components/RightBar";
import { Spinner } from "../components/ui/spinner";
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

// const getPosts = async (): Promise<PostFeedResponse> => {
//   const response = await fetch(
//     `${import.meta.env.VITE_BASE_URL}/api/posts/feed`,
//   );
//   return response.json();
// };
const getPosts = async (): Promise<PostFeedResponse> => {
  const response = await instance.get("/posts/feed");
  return response.data;
};
export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: postCacheKey.list,
    queryFn: getPosts,
  });
  if (isLoading) {
    return (
      <div className="text-white absolute inset-0 top-1/2 left-1/2">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }
  if (!data) return null;
  return (
    <div className="flex-1 flex justify-center gap-32 text-white px-10 py-9">
      <div>
        <PostCard data={data?.data.posts} />
      </div>
      <RightBar />
    </div>
  );
}
