import { redirect } from "next/navigation";

export default function ManageIndexPage() {
  redirect("/platform/manage/users");
}
