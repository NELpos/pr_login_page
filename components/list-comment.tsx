import { formatToTimeAgo } from "@/lib/util";
import Image from "next/image";
import Link from "next/link";

interface ListCommentProps {
  payload: string;
  created_at: Date;
  username: string;
}

export default function ListComment({
  payload,
  created_at,
  username,
}: ListCommentProps) {
  return (
    <div className="flex flex-col gap-1 *:text-white">
      <div className="flex flex-row gap-3">
        <span className="text-sm text-orange-500 ">{username}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
      </div>
      <span className="text-lg">{payload}</span>
    </div>
  );
}
