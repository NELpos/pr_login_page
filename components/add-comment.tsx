"use client";

import { useForm } from "react-hook-form";
import Input from "./input";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentType } from "@/lib/schema";
import { uploadTweet } from "@/app/actions";
import FormButton from "./button";
import { uploadComment } from "@/app/tweets/[id]/actions";

interface commentProps {
  tweetId: number;
}

export default function AddComment({ tweetId }: commentProps) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = handleSubmit(async (data: CommentType) => {
    const formData = new FormData();
    formData.append("comment", data.comment);

    const errors = await uploadComment(formData, tweetId);
    if (errors) {
      //setError
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-row gap-5 rounded-lg m-5">
        <Input
          required
          placeholder="내용"
          type="comment"
          {...register("comment")}
          errors={[errors.comment?.message ?? ""]}
        />
        <FormButton text="추가" />
      </form>
    </div>
  );
}
