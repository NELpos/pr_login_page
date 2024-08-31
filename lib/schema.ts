import { z } from "zod";

export const tweetSchema = z.object({
  tweet: z.string({
    required_error: "Tweet is required",
  }),
});

export const commentSchema = z.object({
  comment: z.string({
    required_error: "Comment is required",
  }),
});

export type TweetType = z.infer<typeof tweetSchema>;
export type CommentType = z.infer<typeof commentSchema>;
