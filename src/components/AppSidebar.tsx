import { Home, Target, ClipboardList, BarChart3, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Daily Goals", url: "/goals", icon: Target },
  { title: "Tasks", url: "/tasks", icon: ClipboardList },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // Classes for the expanded navigation links
  const expandedNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center h-12 text-base px-4 rounded-md",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    );

  // [FIXED] Separate classes for the collapsed icon buttons
  const collapsedNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center justify-center h-12 w-10 rounded-md",
      isActive
        ? "bg-primary/10 text-primary"
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    );

  return (
    <Sidebar
      className={cn("transition-all duration-300", collapsed ? "w-14" : "w-64")}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sm">Daily Effectiveness</h2>
                <p className="text-xs text-muted-foreground">Logger</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-sm font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title} className="flex justify-center">
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink to={item.url} end={item.url === "/"} className={collapsedNavCls}>
                          <item.icon className="h-5 w-5" />
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right"><p>{item.title}</p></TooltipContent>
                    </Tooltip>
                  ) : (
                    <NavLink to={item.url} end={item.url === "/"} className={expandedNavCls}>
                      <item.icon className="mr-3 h-5 w-5" />
                      <span className="text-base">{item.title}</span>
                    </NavLink>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className={cn("p-2", collapsed && "flex justify-center")}>
        <ThemeToggle collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}
