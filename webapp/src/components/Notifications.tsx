import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useState } from "react";

type Notification = {
  id: string;
  author_id?: string;
  // recipient_id: string,
  title: string;
  description: string;
  url: string;
  time: string;
  status: "read" | "unread";
};

const data: Notification[] = [
  {
    id: "1",
    title: "New message",
    description: "You have 1 unread message",
    url: "/blabla",
    time: "2m ago",
    status: "unread",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(data);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            setNotification={(notification) => {
              setNotifications(
                notifications.map((n) =>
                  n.id === notification.id ? notification : n,
                ),
              );
            }}
          />
        ))}
        <DropdownMenuItem className="p-4">View all</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Notification({
  notification,
  setNotification,
}: {
  notification: Notification;
  setNotification: (notification: Notification) => void;
}) {
  function handleClick() {
    setNotification({ ...notification, status: "read" });
  }
  return (
    <DropdownMenuItem onClick={handleClick} className="p-4">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h3 className="text-lg font-semibold">{notification.title}</h3>
          <p className="text-muted-foreground text-sm">
            {notification.description}
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          {notification.time}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
