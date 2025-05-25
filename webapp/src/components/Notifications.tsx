import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useNotifications from "@/scenes/notifications/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell } from "lucide-react";

export default function Notifications() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRead={() => markAsRead(notification.id)}
          />
        ))}
        <DropdownMenuItem className="p-4">View all</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Notification({
  notification,
  onRead,
}: {
  notification: {
    id: string;
    title: string;
    description: string;
    url: string | null;
    created_at: string;
    status: "read" | "unread";
  };
  onRead: () => void;
}) {
  return (
    <DropdownMenuItem onClick={onRead} className="p-4">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h3 className="text-lg font-semibold">{notification.title}</h3>
          <p className="text-muted-foreground text-sm">
            {notification.description}
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
            locale: fr,
          })}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
