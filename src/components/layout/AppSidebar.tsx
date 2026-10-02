import React, { useState } from "react";
import {
  LayoutDashboard,
  Video,
  Mail,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  MinusCircle,
  HelpCircle,
  Settings,
} from "lucide-react";
import type { ViewType, Participant } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AppSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  meetingsCount: number;
  emailsCount: number;
  currentUser: Participant;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onViewChange,
  meetingsCount,
  emailsCount,
  currentUser,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [userPresence, setUserPresence] = useState<"available" | "busy" | "dnd" | "away">("available");

  const presenceConfig = {
    available: { label: "Disponible", color: "bg-emerald-500", icon: CheckCircle },
    busy: { label: "En reunión", color: "bg-red-500", icon: MinusCircle },
    dnd: { label: "No molestar", color: "bg-rose-600", icon: MinusCircle },
    away: { label: "Vuelvo enseguida", color: "bg-amber-500", icon: Clock },
  };

  const navItems = [
    {
      id: "hub" as ViewType,
      label: "Centro Operativo",
      icon: LayoutDashboard,
      count: meetingsCount + emailsCount,
      countColor: "bg-muted text-foreground",
    },
    {
      id: "meetings" as ViewType,
      label: "Reuniones de Teams",
      icon: Video,
      count: meetingsCount,
      countColor: "bg-[#5B5FC7]/15 text-[#5B5FC7] dark:bg-[#5B5FC7]/30 dark:text-[#a8aafd]",
    },
    {
      id: "emails" as ViewType,
      label: "Bandeja de Correos",
      icon: Mail,
      count: emailsCount,
      countColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      id: "metrics" as ViewType,
      label: "Métricas & SLAs",
      icon: BarChart3,
      count: null,
      countColor: "",
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={`relative flex flex-col border-r bg-card/60 backdrop-blur-xs transition-all duration-300 ease-in-out shrink-0 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle Collapse Button on side border */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3.5 top-6 z-40 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-xs hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Workspace Brand / Header in Sidebar */}
        <div className="flex h-16 items-center px-4 border-b">
          {isCollapsed ? (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#0078D4] text-white font-bold shadow-xs">
              <span className="text-base">M</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-tr from-[#0078D4] to-[#5B5FC7] text-white shadow-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Power Apps Enterprise
                </p>
                <p className="text-xs font-semibold text-foreground truncate">
                  Contoso Corporation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          <div className="px-2 mb-2">
            {!isCollapsed && (
              <p className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                Módulos Centrales
              </p>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            const buttonContent = (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer relative ${
                  isActive
                    ? "bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/20 dark:text-[#50a9ff] font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                } ${isCollapsed ? "justify-center px-2" : "justify-between"}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-[#0078D4] dark:text-[#50a9ff]" : "text-muted-foreground"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.count !== null && (
                  <span
                    className={`ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.countColor}`}
                  >
                    {item.count}
                  </span>
                )}

                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#0078D4]" />
                )}
              </button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium text-xs">
                    {item.label}
                    {item.count !== null && ` (${item.count})`}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </div>

        {/* Integrations & Help links */}
        {!isCollapsed && (
          <div className="p-3 mx-2 my-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900 text-[#0078D4] shrink-0">
                <HelpCircle className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px] space-y-0.5">
                <p className="font-semibold text-foreground">Sincronización M365</p>
                <p className="text-muted-foreground leading-tight">
                  Reuniones Teams y buzón de Exchange conectados en tiempo real.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Card at Bottom */}
        <div className="border-t p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/70 text-left cursor-pointer ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-border"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background ${
                      presenceConfig[userPresence].color
                    }`}
                  />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {currentUser.name}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {currentUser.role}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" side="top" className="w-64 p-1.5 shadow-xl border">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                    {currentUser.department}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase px-2 py-1 font-semibold">
                Estado de presencia Teams
              </DropdownMenuLabel>
              {(Object.keys(presenceConfig) as Array<keyof typeof presenceConfig>).map((key) => {
                const item = presenceConfig[key];
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setUserPresence(key)}
                    className="flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                    {userPresence === key && (
                      <span className="ml-auto text-xs text-[#0078D4] font-semibold">✓</span>
                    )}
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-xs cursor-pointer">
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Configuración de cuenta M365</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
};
