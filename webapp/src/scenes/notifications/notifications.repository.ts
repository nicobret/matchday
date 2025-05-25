import supabase from "@/utils/supabase";
import { Tables, TablesUpdate } from "shared/types/supabase";

export type Notification = Tables<"notifications">;

export async function getNotifications(
  userId: string,
): Promise<Notification[]> {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .throwOnError();
  if (!data) return [];
  return data;
}

export async function updateNotification(
  notificationId: string,
  payload: TablesUpdate<"notifications">,
): Promise<Notification> {
  const { data } = await supabase
    .from("notifications")
    .update(payload)
    .eq("id", notificationId)
    .select()
    .single()
    .throwOnError();
  if (!data) throw new Error("Notification not found");
  return data;
}
