"use server";
import { z } from "zod";
// import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { tweetSchema } from "@/lib/schema";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

const checkJodEmail = async (email: string) => {
  return email.includes("@zod.com");
};

const formSchema = z.object({
  username: z.string().min(5).toLowerCase(),
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkJodEmail, "Only @zod.com emails are allowed"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(10)
    .regex(/\d/, "Password must contain at least one number"),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return {
      success: false,
      ...result.error.flatten(),
    };
  } else {
    if (data.password === "12asdfasdf")
      return {
        success: true,
        fieldErrors: {},
      };
    else
      return {
        success: false,
        fieldErrors: {
          password: ["Wrong Password."],
          email: [],
          username: [],
        },
      };

    // find a user with the email
    // if the user is found, check password hash
    // const user = await db.user.findUnique({
    //   where: {
    //     email: result.data.email,
    //   },
    //   select: {
    //     id: true,
    //     password: true,
    //   },
    // });
    // const ok = await bcrypt.compare(
    //   result.data.password,
    //   user!.password ?? "xx"
    // );
    // log the user in
    // redirect "/profile"
    // if (ok) {
    //   const session = await getSession();
    //   session.id = user!.id;
    //   session.save();
    //   redirect("/profile");
    // } else {
    //   return {
    //     fieldErrors: {
    //       password: ["Wrong Password."],
    //       email: [],
    //     },
    //   };
    // }
  }
};

export async function getTweetsCount() {
  const count = await db.tweet.count();
  return count;
}

export async function getMoreTweets(page: number) {
  const products = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,
      created_at: true,
    },
    skip: page * 5,
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export async function uploadTweet(formdata: FormData) {
  const data = {
    tweet: formdata.get("tweet"),
  };

  const result = tweetSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.tweet.create({
        data: {
          tweet: result.data.tweet,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidatePath("/");
      redirect("/");
    }
  }
}
