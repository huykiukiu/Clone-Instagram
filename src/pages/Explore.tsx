import { useQuery } from "@tanstack/react-query";
import { instance } from "../lib/httpRequest";
import ExplorePost from "../components/explore/ExplorePost";
import { exploreCacheKey } from "../cache/exploreCache";

const getExplorePosts = async () => {
  const res = await instance.get("/posts/explore");
  return res.data;
};
export default function Explore() {
  const { data } = useQuery({
    queryKey: exploreCacheKey.explore,
    queryFn: getExplorePosts,
  });
  const posts = data?.data?.posts;
  return (
    <div className="w-[90vw] flex flex-wrap py-10">
      {posts?.map((post) => (
        <ExplorePost post={post} />
      ))}
    </div>
  );
}
