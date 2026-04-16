"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Landmark,
  Target,
  ArrowLeftRight,
  Handshake,
  CalendarDays,
  LogOut,
  Wallet,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Accounts", href: "/accounts", icon: Landmark },
  { title: "Net Worth", href: "/net-worth", icon: TrendingUp },
  { title: "Cash Flow", href: "/cash-flow", icon: CalendarDays },
  { title: "Objectives", href: "/objectives", icon: Target },
  { title: "Loans", href: "/loans", icon: Handshake },
  { title: "Currencies", href: "/currencies", icon: ArrowLeftRight },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar>
      {/* Logo */}
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-sidebar-accent-foreground">
            Finance
          </span>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 pt-1">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                render={<a href={item.href} />}
                isActive={pathname === item.href}
                className="gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Sign out */}
      <SidebarFooter className="p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
