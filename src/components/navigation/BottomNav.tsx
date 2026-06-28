"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, Map, BookOpen, User, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Início", href: "/", icon: Home },
  { name: "Campanhas", href: "/campanhas", icon: Tag },
  { name: "Guia", href: "/guia", icon: Map },
  { name: "História", href: "/historia", icon: BookOpen },
  { name: "Utilidades", href: "/utilidades", icon: ShieldAlert },
  { name: "Conta", href: "/conta", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  // Ocultar a navegação inferior na área administrativa
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 glass border-t border-white/10 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
              isActive ? "text-brand-primary font-bold" : "text-brand-text/60 hover:text-brand-text"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "animate-slide-up")} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
