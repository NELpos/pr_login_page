"use client";

import FormButton from "@/components/button";
import Input from "@/components/input";
import Image from "next/image";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Confirm from "@/components/confirm";


export default function Home() {
  const [state, dispatch] = useFormState(login, null);


  return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-md p-6 bg-neutral-200 rounded-lg shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-black">Login</h1>
          <form action={dispatch} className="flex flex-col  justify-center gap-2">
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
            {Object.keys(state!.fieldErrors).length === 0 ? <Confirm text = "Welcome Back"/> : null }
            
          </form>
        </div>
      </div>
  )
}
