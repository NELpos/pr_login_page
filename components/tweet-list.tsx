"use client";

import { useEffect, useRef, useState } from "react";
import ListTweet from "./list-tweet";
import { getMoreTweets, getTweetsCount } from "@/app/actions";
import Link from "next/link";
import { generatePageList } from "@/lib/util";
import { InitialTweets } from "@/app/page";

export default function Tweetlist() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, setTweets] = useState<InitialTweets>([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState<number[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [total, setTotal] = useState(0);

  const onPrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const onNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const onSetPage = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    const getTweets = async () => {
      setIsLoading(true);

      const newTweets = await getMoreTweets(page);
      setTotal(Math.ceil((await getTweetsCount()) / 5));
      setPages(generatePageList(Math.ceil((await getTweetsCount()) / 5)));
      setTweets(newTweets);
      setIsLoading(false);
    };
    getTweets();
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {tweets.map((tweet) => (
        <ListTweet key={tweet.id} {...tweet} />
      ))}
      <ul className="inline-flex -space-x-px text-sm">
        {page > 0 ? (
          <li>
            <button
              onClick={onPrevPage}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>
        ) : null}

        {pages.map((page, index) => (
          <li key={index}>
            <button
              onClick={() => onSetPage(page)}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {page + 1}
            </button>
          </li>
        ))}
        {page < total - 1 ? (
          <li>
            <button
              onClick={onNextPage}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
