import { redirect } from "next/navigation";
import {
  getAccountUsers,
  selectAccountUser,
} from "@/lib/actions/account-users";
import { createClientServer } from "@/lib/supabase/server";
import CreateAccountUserForm from "@/components/features/account-users/CreateAccountUserForm";

export const dynamic = "force-dynamic";

export default async function SelectUserPage() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const accountUsers = await getAccountUsers();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-gray-900">
      <section className="mx-auto w-full max-w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-700">เลือกผู้ใช้งาน</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-950">
          วันนี้ใครกำลังใช้งานบัญชีนี้?
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          บัญชีหลักคือ {user.email} ส่วนรายชื่อด้านล่างคือคนในทีม/ครอบครัวที่ใช้คลังเดียวกัน
        </p>

        {accountUsers.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {accountUsers.map((accountUser) => (
              <form key={accountUser.id} action={selectAccountUser}>
                <input
                  type="hidden"
                  name="account_user_id"
                  value={accountUser.id}
                />
                <button
                  type="submit"
                  className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="block text-base font-semibold text-gray-950">
                    {accountUser.name}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    {accountUser.role || "ผู้ใช้งาน"}
                  </span>
                </button>
              </form>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            ยังไม่มีผู้ใช้ในบัญชีนี้ เพิ่มชื่อคนแรกก่อนเริ่มใช้งาน
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 pt-5">
          <h2 className="text-base font-semibold text-gray-950">
            เพิ่มผู้ใช้ในบัญชีนี้
          </h2>
          <CreateAccountUserForm />
        </div>
      </section>
    </main>
  );
}
