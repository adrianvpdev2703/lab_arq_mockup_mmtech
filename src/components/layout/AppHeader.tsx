import React, { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "@/components/mode-toggle";
import type { QuickFilterType } from "@/types";
import { currentUser } from "@/mock/data";

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  quickFilter: QuickFilterType;
  onQuickFilterChange: (filter: QuickFilterType) => void;
  onOpenNewRecord: () => void;
  pendingCount: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchQuery,
  onSearchChange,
  quickFilter,
  onQuickFilterChange,
  onOpenNewRecord,
  pendingCount,
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState([
    {
      id: "notif-1",
      title: "Recordatorio: Sync Semanal en 15 minutos",
      desc: "Reunión programada con Mariana Rivas y David Torres en Microsoft Teams.",
      time: "Hace 5m",
      type: "meeting",
      urgent: true,
      read: false,
    },
    {
      id: "notif-2",
      title: "Nuevo correo crítico de Finanzas",
      desc: "Sofía Vergara envió reporte de capacidad al 92% en Dataverse.",
      time: "Hace 25m",
      type: "email",
      urgent: true,
      read: false,
    },
    {
      id: "notif-3",
      title: "Directiva DLP aprobada",
      desc: "Se completó la verificación de seguridad en SharePoint Legal.",
      time: "Hace 1h",
      type: "success",
      urgent: false,
      read: true,
    },
  ]);

  const unreadCount = unreadNotifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setUnreadNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card/95 px-4 backdrop-blur-md transition-colors sm:px-6">
      {/* Brand & Context */}
      <div className="flex items-center gap-3">
        {/* Microsoft App Launcher Waffle */}
        <div
          className="grid grid-cols-3 gap-0.5 p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
          title="Iniciador de aplicaciones Microsoft 365"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-xs bg-muted-foreground/70"
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-[#0078D4] to-[#106EBE] shadow-xs text-white font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                Secretario GSIC
              </span>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-normal py-0 h-4.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900"
              >
                <Building2 className="h-2.5 w-2.5" />
                SharePoint Lists · M365
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden md:block">
              Gestor de Seguimiento y Reunión Semanal de TI
            </p>
          </div>
        </div>
      </div>

      {/* Global Search & Quick Filters */}
      <div className="flex items-center gap-2.5 flex-1 max-w-xl mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por asunto, participante, etiqueta..."
            className="pl-9 pr-9 h-9 text-xs sm:text-sm bg-muted/40 hover:bg-muted/70 focus:bg-background transition-colors rounded-lg border-muted-foreground/20"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              Ctrl+K
            </kbd>
          )}
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="hidden lg:flex items-center gap-1 shrink-0 bg-muted/50 p-1 rounded-lg border">
          <button
            onClick={() => onQuickFilterChange("all")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              quickFilter === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onQuickFilterChange("my_pending")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1 ${
              quickFilter === "my_pending"
                ? "bg-background text-[#0078D4] shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mis pendientes
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center h-4 px-1 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onQuickFilterChange("this_week")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              quickFilter === "this_week"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Esta semana
          </button>
          <button
            onClick={() => onQuickFilterChange("high_priority")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              quickFilter === "high_priority"
                ? "bg-background text-red-600 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Alta prioridad
          </button>
        </div>
      </div>

      {/* Right Actions: New Record CTA, Notifications, Theme, User */}
      <div className="flex items-center gap-2">
        {/* CTA Button */}
        <Button
          onClick={onOpenNewRecord}
          className="h-9 px-3.5 bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white shadow-xs font-medium rounded-lg text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Registro</span>
        </Button>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 relative rounded-lg border-muted-foreground/20 hover:bg-muted"
            >
              <Bell className="h-4 w-4 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-xl shadow-lg border">
            <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  Notificaciones Operativas
                </span>
                <Badge variant="secondary" className="text-[11px] h-5">
                  {unreadCount} nuevas
                </Badge>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#0078D4] hover:underline font-medium"
                >
                  Marcar leídas
                </button>
              )}
            </div>

            <div className="divide-y max-h-80 overflow-y-auto">
              {unreadNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors hover:bg-muted/40 cursor-pointer ${
                    !notif.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {notif.type === "meeting" && (
                        <div className="h-6 w-6 rounded-md bg-[#5B5FC7]/15 text-[#5B5FC7] flex items-center justify-center">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {notif.type === "email" && (
                        <div className="h-6 w-6 rounded-md bg-amber-500/15 text-amber-600 flex items-center justify-center">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {notif.type === "success" && (
                        <div className="h-6 w-6 rounded-md bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-foreground leading-tight">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-2 text-center bg-muted/20">
              <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                Conectado con alertas de Teams & Outlook
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Profile Mini Indicator */}
        <div className="hidden sm:flex items-center pl-1">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-[#0078D4]/20"
            />
            <span
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background"
              title="Disponible en Teams"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
