"use client";

import { useActionState, useEffect, useRef } from "react";
import { createAccountUser } from "@/lib/actions/account-users";

const initialState = { success: false, message: "" };

export default function CreateAccountUserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createAccountUser,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="mt-5 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto]">
        <input
          name="name"
          type="text"
          required
          className="h-11 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="ชื่อผู้ใช้ เช่น พี่หนึ่ง"
        />
        <input
          name="role"
          type="text"
          className="h-11 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="หน้าที่"
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isPending ? "กำลังเพิ่ม..." : "เพิ่มผู้ใช้"}
        </button>
      </div>

      {state.message ? (
        <p
          className={`text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
