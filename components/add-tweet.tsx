"use client";

import { useForm } from "react-hook-form";
import Input from "./input";
import { zodResolver } from "@hookform/resolvers/zod";
import { tweetSchema, TweetType } from "@/lib/schema";
import { uploadTweet } from "@/app/actions";
import FormButton from "./button";

interface AddTweetProps {}

export default function AddTweet() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<TweetType>({
    resolver: zodResolver(tweetSchema),
  });

  const onSubmit = handleSubmit(async (data: TweetType) => {
    const formData = new FormData();
    formData.append("tweet", data.tweet);

    const errors = await uploadTweet(formData);
    if (errors) {
      //setError
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form
        action={onValid}
        className="p-5 flex flex-col gap-5 border-2 rounded-lg m-5 border-neutral-300"
      >
        <Input
          required
          placeholder="내용"
          type="tweet"
          {...register("tweet")}
          errors={[errors.tweet?.message ?? ""]}
        />
        <FormButton text="추가" />
      </form>
    </div>
  );
}
