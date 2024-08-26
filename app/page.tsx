import AddTweet from "@/components/add-tweet";
import Tweetlist from "@/components/tweet-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Home",
};

async function getInitialTweets() {
  const tweets = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,
      created_at: true,
    },
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });

  return tweets;
}

export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

interface IParams {
  params: Record<string, any>;
  searchParams: { page?: string }; // page는 선택적 필드로 정의
}

export default async function Tweets() {
  return (
    <div className="flex flex-col justify-center items-center">
      <AddTweet />
      <Tweetlist key="tweet" />
    </div>
  );
}
