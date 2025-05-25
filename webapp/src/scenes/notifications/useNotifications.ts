import { SessionContext } from "@/components/auth-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import {
  getNotifications,
  updateNotification,
} from "./notifications.repository";

export default function useNotifications() {
  const { session } = useContext(SessionContext);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", session?.user?.id],
    queryFn: () => getNotifications(session?.user?.id!),
    enabled: !!session?.user?.id,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (notificationId: string) =>
      updateNotification(notificationId, { status: "read" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications,
    markAsRead,
  };
}
