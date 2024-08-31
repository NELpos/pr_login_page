"use server";

import db from "@/lib/db";
import { commentSchema } from "@/lib/schema";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function likePost(tweetId: number) {
  // await new Promise((r) => setTimeout(r, 10000));

  const session = await getSession();
  try {
    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {}
}
export async function dislikePost(tweetId: number) {
  // await new Promise((r) => setTimeout(r, 10000));

  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          tweetId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {}
}

export async function uploadComment(formdata: FormData, tweetId: number) {
  const data = {
    comment: formdata.get("comment"),
  };

  const result = commentSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const comment = await db.comment.create({
        data: {
          payload: result.data.comment,
          user: {
            connect: {
              id: session.id,
            },
          },
          tweet: {
            connect: {
              id: tweetId,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidateTag(`comment-status-${tweetId}`);
    }
  }
}

export async function getUser() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
    },
  });
  return user;
}

export async function deleteComments(tweetId: number) {
  const session = await getSession();
  try {
    await db.comment.deleteMany({
      where: {
        userId: session.id!,
        tweetId: tweetId!,
      },
    });
  } catch (e) {}
  revalidatePath(`/tweets/${tweetId}`);
}

// export async function getMoreComments(tweetId: number) {
//   const comments = await db.comment.findMany({
//     where: {
//       tweetId,
//     },
//     select: {
//       id: true,
//       payload: true,
//       created_at: true,
//       user: {
//         select: {
//           username: true,
//         },
//       },
//     },
//     orderBy: {
//       created_at: "desc",
//     },
//   });
//   return comments;
// }

export async function getInitialComments(tweetId: number) {
  const comments = await db.comment.findMany({
    where: {
      tweetId,
    },
    select: {
      payload: true,
      created_at: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });
  if (comments) return comments;
  else return [];
}

export type InitialComments = Prisma.PromiseReturnType<
  typeof getInitialComments
>;
