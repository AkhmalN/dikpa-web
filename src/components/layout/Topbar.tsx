import { useLocation } from "react-router-dom";
import { Bell, LogOut, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Executive Dashboard",
  "/shifts": "Shifts",
  "/checkpoints": "Checkpoints",
  "/assignments": "Assignments",
  "/incidents": "Incidents",
  "/scan-analytics": "Scan Analytics",
  "/users": "Users",
};

export function Topbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const title = PAGE_TITLES[location.pathname] ?? "Dashboard";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <header className="h-[60px] flex items-center border-b border-border bg-background px-4 gap-3">
      <SidebarTrigger className="size-8 shrink-0" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-muted-foreground text-[14px]">SmartPatrol</span>
        <ChevronRight className="size-3 text-muted-foreground" />
        <span className="text-[14px] font-semibold text-foreground truncate">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative size-8 rounded-full bg-[#F5F5F5] hover:bg-[#E5E5E5]"
        >
          <Bell className="size-4 text-[#404040]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-[4px] px-2 py-1.5 hover:bg-[#F5F5F5] transition-colors outline-none">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-bold">
                  {user ? getInitials(user.username) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-[12px] font-medium text-foreground leading-tight">
                  {user?.username}
                </span>
                <span className="text-[11px] text-muted-foreground capitalize leading-tight">
                  {user?.role?.replace("_", " ")}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-[13px] font-medium text-foreground">
                {user?.username}
              </p>
              <p className="text-[12px] text-muted-foreground truncate">
                {user?.username}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-[#FB2C36] focus:bg-[rgba(251,44,54,0.08)] focus:text-[#FB2C36] cursor-pointer"
            >
              <LogOut className="size-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
