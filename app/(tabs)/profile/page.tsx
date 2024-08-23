import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/button";
import FormButton from "@/components/button";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="flex w-full h-screen items-center justify-center bg-neutral-800">
      <div className="flex flex-col gap-10 py-14 px-10 bg-neutral-600 rounded-md p-10">
        <div className="flex flex-col items-center gap-5">
          <span> Welcome! {user?.username} to your profile</span>
          <form action={logOut} className="flex">
            <FormButton text="Logout" />
          </form>
        </div>
      </div>
    </div>
  );
}
