"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClientServer } from "@/lib/supabase/server";
import { FormState } from "@/lib/types";
import { isMissingSchemaTableError } from "@/lib/utils/supabase-errors";

const ACTIVE_ACCOUNT_USER_ID = "active_account_user_id";
const ACTIVE_ACCOUNT_USER_NAME = "active_account_user_name";

export type AccountUser = {
  id: number;
  account_id: string;
  name: string;
  role: string | null;
  created_at?: string;
};

async function getAuthUser() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function getAccountUsers(): Promise<AccountUser[]> {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("account_users")
    .select("id, account_id, name, role, created_at")
    .eq("account_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    if (isMissingSchemaTableError(error)) {
      return [];
    }

    console.error("Error fetching account users:", error.message);
    return [];
  }

  return data || [];
}

export async function getActiveAccountUser(): Promise<AccountUser | null> {
  const cookieStore = await cookies();
  const rawId = cookieStore.get(ACTIVE_ACCOUNT_USER_ID)?.value;

  if (!rawId) {
    return null;
  }

  const accountUserId = Number(rawId);
  if (!Number.isInteger(accountUserId)) {
    return null;
  }

  const { supabase, user } = await getAuthUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("account_users")
    .select("id, account_id, name, role, created_at")
    .eq("id", accountUserId)
    .eq("account_id", user.id)
    .maybeSingle();

  if (error) {
    if (!isMissingSchemaTableError(error)) {
      console.error("Error fetching active account user:", error.message);
    }

    return null;
  }

  return data;
}

export async function getActiveAccountUserId() {
  const activeUser = await getActiveAccountUser();
  return activeUser?.id ?? null;
}

export async function createAccountUser(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return { success: false, message: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  if (!name) {
    return { success: false, message: "กรุณากรอกชื่อผู้ใช้" };
  }

  const { error } = await supabase.from("account_users").insert({
    account_id: user.id,
    name,
    role: role || null,
  });

  if (error) {
    return {
      success: false,
      message: isMissingSchemaTableError(error)
        ? "ยังไม่มีตาราง account_users ใน Supabase ให้รันไฟล์ account_users_setup.sql ก่อน"
        : `เพิ่มผู้ใช้ไม่สำเร็จ: ${error.message}`,
    };
  }

  revalidatePath("/select-user");
  return { success: true, message: "เพิ่มผู้ใช้แล้ว" };
}

export async function selectAccountUser(formData: FormData) {
  const accountUserId = Number(formData.get("account_user_id"));
  const { supabase, user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!Number.isInteger(accountUserId)) {
    redirect("/select-user");
  }

  const { data, error } = await supabase
    .from("account_users")
    .select("id, name")
    .eq("id", accountUserId)
    .eq("account_id", user.id)
    .maybeSingle();

  if (error || !data) {
    redirect("/select-user");
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ACCOUNT_USER_ID, String(data.id), {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
  cookieStore.set(ACTIVE_ACCOUNT_USER_NAME, data.name, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function clearSelectedAccountUser() {
  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_ACCOUNT_USER_ID);
  cookieStore.delete(ACTIVE_ACCOUNT_USER_NAME);
}
