"use client";

import {
  deleteComments,
  getInitialComments,
  getUser,
  InitialComments,
  uploadComment,
} from "@/app/tweets/[id]/actions";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import ListComment from "./list-comment";
import Input from "./input";
import FormButton from "./button";
import { useForm } from "react-hook-form";
import { commentSchema, CommentType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface commentListProps {
  tweetId: number;
}

interface newComment {
  payload: string;
  created_at: Date;
  user: {
    username: string;
  };
}

export default function CommentList({ tweetId }: commentListProps) {
  const [comments, setComments] = useState<InitialComments>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    const getComments = async () => {
      const newComments = await getInitialComments(tweetId);
      setComments(newComments);
    };
    getComments();
  }, [isLoading]);

  const [optComments, reducerFn] = useOptimistic<InitialComments, newComment>(
    comments,
    (prevComments, newComment) => [...prevComments, newComment]
  );

  const onSubmit = handleSubmit(async (data: CommentType) => {
    setIsLoading(true);
    const user = await getUser();
    if (!user) return;
    reducerFn({
      payload: data.comment,
      user,
      created_at: new Date(),
    });
    const formData = new FormData();
    formData.append("comment", data.comment);
    const errors = await uploadComment(formData, tweetId);
    if (errors) {
      //setError
    }
    setIsLoading(false);
  });

  const onValid = async () => {
    await onSubmit();
  };

  const onDelete = async () => {
    await deleteComments(tweetId);
  };

  const onTest = () => {
    startTransition(() => {
      reducerFn({
        payload: "11111",
        user: {
          username: "nelpos",
        },
        created_at: new Date(),
      });
    });
    console.log(optComments);
  };

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-row gap-5 rounded-lg m-5">
        <Input
          required
          placeholder="내용"
          type="comment"
          {...register("comment")}
        />
        <FormButton text="추가" />
      </form>
      {/* <button onClick={onDelete}>All Deletes</button> <br></br>
      <button onClick={onTest}>test</button> */}
      <div className="p-5 flex flex-col gap-5">
        {optComments!.map((comment, index) => (
          <ListComment
            key={index}
            payload={comment.payload}
            username={comment.user.username}
            created_at={comment.created_at}
          />
        ))}
      </div>
    </div>
  );
}
