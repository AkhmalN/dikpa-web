import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  MapPin,
  ClipboardList,
  AlertTriangle,
  BarChart2,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import brandLogo from "/assets/garda-brand.jpeg";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Live Analytics", href: "/live-analytics", icon: BarChart2 },
  { label: "Master Shifts", href: "/shifts", icon: Clock },
  { label: "Master Checkpoints", href: "/checkpoints", icon: MapPin },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Incidents Report", href: "/incidents", icon: AlertTriangle },
  // { label: "Scan Analytics", href: "/scan-analytics", icon: BarChart2 },
  { label: "User Management", href: "/users", icon: Users },
  { label: "Atensi", href: "/atensi", icon: Users },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      {/* Header / Logo */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3 h-[60px] flex-row items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={brandLogo} alt="Garda" className="h-10 w-auto" />
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center mx-auto">
            <img src={brandLogo} alt="Garda" className="h-8 w-auto" />
          </div>
        )}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-2">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[11px] font-bold text-muted-foreground px-4 pb-1 h-7">
              MENU UTAMA
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  location.pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "px-4 py-3 rounded-none text-[14px] font-normal leading-[21px] transition-colors rounded-md",
                        isActive
                          ? "bg-accent text-accent-foreground border-l-[3px] border-primary pl-[calc(1rem-3px)]"
                          : "text-[#404040] hover:bg-[#F5F5F5] hover:text-foreground border-l-[3px] border-transparent pl-[calc(1rem-3px)]",
                      )}
                    >
                      <NavLink to={item.href}>
                        <Icon
                          className={cn(
                            "size-4",
                            isActive ? "text-primary" : "text-[#404040]",
                          )}
                        />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - User Info */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-1">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-bold">
                {user ? getInitials(user.username) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[12px] font-medium text-foreground truncate">
                {user?.username}
              </span>
              <span className="text-[11px] text-muted-foreground capitalize truncate">
                {user?.role?.replace("_", " ")}
              </span>
            </div>
          </div>
        ) : (
          <Avatar size="sm" className="mx-auto">
            <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-bold">
              {user ? getInitials(user.username) : "?"}
            </AvatarFallback>
          </Avatar>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
