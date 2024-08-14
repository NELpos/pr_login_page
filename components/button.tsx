"use client";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function FormButton({ text }: ButtonProps) {
    const { pending } = useFormStatus();
    return (
        <button
          disabled={pending}
          className="primary-btn h-10 bg-cyan-400 rounded-lg disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
          {pending ? "로딩 중" : text}
        </button>
      );

}