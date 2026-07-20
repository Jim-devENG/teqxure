"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  BookOpen,
  HelpCircle,
  MessageSquareQuote,
  ClipboardList,
  Inbox,
  ImageIcon,
  Mail,
  Settings,
  LogOut,
  CalendarDays,
  Info,
  Gem,
  Sparkles,
  Users,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/homepage", label: "Homepage", icon: FileText },
  { href: "/about", label: "About Page", icon: Info },
  { href: "/core-values", label: "Core Values", icon: Gem },
  { href: "/differentiators", label: "Differentiators", icon: Sparkles },
  { href: "/team", label: "Team", icon: Users },
  { href: "/products", label: "Products", icon: Package },
  { href: "/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/waitlist-form", label: "Waitlist Form", icon: ClipboardList },
  { href: "/waitlist-submissions", label: "Submissions", icon: Inbox },
  { href: "/media", label: "Media", icon: ImageIcon },
  { href: "/email-templates", label: "Email Templates", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-light-gray bg-white">
      <div className="border-b border-light-gray px-5 py-5">
        <span className="flex items-center gap-2 font-mono text-sm font-medium tracking-tight text-graphite">
          <Image src="/logo-icon.png" alt="" width={20} height={20} className="h-5 w-5" />
          Teqxure<span className="text-blue">.</span>
        </span>
        <p className="mt-0.5 text-xs text-slate">Admin</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
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
        <form action={logoutAction}>
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
