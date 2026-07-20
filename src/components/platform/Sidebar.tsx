"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Rocket,
  Package,
  FolderOpen,
  MessagesSquare,
  Mail,
  Award,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { platformLogoutAction } from "@/lib/actions/platformAuth";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bootcamp", label: "Bootcamp", icon: BookOpen },
  { href: "/sprint-room", label: "Sprint Room", icon: Rocket },
  { href: "/my-product", label: "My Product", icon: Package, roles: ["STUDENT"] },
  { href: "/resources", label: "Resources", icon: FolderOpen },
  { href: "/community", label: "Community", icon: MessagesSquare },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/certificates", label: "Certificates", icon: Award, roles: ["STUDENT"] },
  {
    href: "/manage",
    label: "Manage",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN", "PROGRAM_MANAGER"],
  },
  { href: "/profile", label: "Profile", icon: Settings },
];

export function Sidebar({ userEmail, role }: { userEmail: string; role: string }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-light-gray bg-white">
      <div className="border-b border-light-gray px-5 py-5">
        <span className="flex items-center gap-2 font-mono text-sm font-medium tracking-tight text-graphite">
          <Image src="/logo-icon.png" alt="" width={20} height={20} className="h-5 w-5" />
          Teqxure<span className="text-blue">.</span>
        </span>
        <p className="mt-0.5 text-xs text-slate">Workspace</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-blue/10 text-blue" : "text-slate hover:bg-soft-white hover:text-graphite",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-light-gray p-3">
        <p className="truncate px-3 py-1 text-xs text-slate">{userEmail}</p>
        <form action={platformLogoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate transition-colors hover:bg-soft-white hover:text-graphite cursor-pointer"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
