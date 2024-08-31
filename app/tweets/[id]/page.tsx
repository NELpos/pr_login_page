import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import LikeButton from "@/components/like-button";
import AddTweet from "@/components/add-tweet";
import AddComment from "@/components/add-comment";
import Tweetlist from "@/components/tweet-list";
import CommentList from "@/components/comment-list";
import { Prisma } from "@prisma/client";

async function getTweet(id: number) {
  const tweet = await db.tweet.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return tweet;
}

const getCachedTweet = nextCache(getTweet, ["tweet-detail"], {
  tags: ["tweet-detail"],
});

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getLikeStatus(tweetId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        tweetId,
        userId,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(tweetId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["tweet-like-status"], {
    tags: [`like-status-${tweetId}`],
  });
  return cachedOperation(tweetId, userId!);
}

// async function getCachedComments(tweetId: number) {
//   const getCahchedComments = nextCache(getComments, ["tweet-comment-status"], {
//     tags: [`comment-status-${tweetId}`],
//   });
//   return getCahchedComments(tweetId);
// }

export default async function TweetDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const tweet = await getCachedTweet(id);
  if (!tweet) {
    return notFound();
  }

  const isOwner = await getIsOwner(tweet.userId);
  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  return (
    <div className="p-5 flex flex-col justify-center items-center border-4">
      <div>
        <div className="block max-w-screen-md w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {tweet.tweet}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 mb-5">
            {tweet.user.username}
          </p>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>
      <div>
        {/* <AddComment tweetId={id} /> */}
        <CommentList tweetId={id} />
      </div>
    </div>
  );
}
