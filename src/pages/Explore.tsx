import { useQuery } from "@tanstack/react-query";
import { instance } from "../lib/httpRequest";
import ExplorePost from "../components/explore/ExplorePost";
import { exploreCacheKey } from "../cache/exploreCache";
import { Spinner } from "../components/ui/spinner";

const getExplorePosts = async () => {
  const res = await instance.get("/posts/explore");
  return res.data;
};
export default function Explore() {
  const { data, isLoading } = useQuery({
    queryKey: exploreCacheKey.explore,
    queryFn: getExplorePosts,
  });
  const posts = data?.data?.posts;
  if (isLoading) {
    return (
      <div className="text-white absolute inset-0 top-1/2 left-1/2">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }
  return (
    <div className="w-[90vw] flex flex-wrap py-10">
      {posts?.map((post) => (
        <ExplorePost post={post} />
      ))}
    </div>
  );
}
