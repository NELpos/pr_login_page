"use server";
import { z } from "zod";
// import getSession from "@/lib/session";
import { redirect } from "next/navigation";

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
