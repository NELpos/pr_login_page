"use client";

import FormButton from "@/components/button";
import Input from "@/components/input";
import Image from "next/image";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Confirm from "@/components/confirm";
import Link from "next/link";

export default function Login() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 bg-neutral-200 rounded-lg shadow-lg">
        <span className="mb-4 text-2xl font-bold text-black flex justify-center">
          Login
        </span>
        <form action={dispatch} className="flex flex-col justify-center gap-2">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            errors={state?.fieldErrors.email}
          />
          <Input
            name="username"
            type="username"
            placeholder="Username"
            required
            errors={state?.fieldErrors.username}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            errors={state?.fieldErrors.password}
          />

          <FormButton text="Log in" />
          {/* {state!.success ? <Confirm text = "Welcome Back"/> : null } */}
          {/* <span className="text-black flex justify-center">계정이 없다면 계정 만들기</span> */}
        </form>
        <Link
          href="/create-account"
          className="flex justify-center text-black underline text-lg py-2.5"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
