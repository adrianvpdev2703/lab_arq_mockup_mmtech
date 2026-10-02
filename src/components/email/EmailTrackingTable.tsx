import React, { useState } from "react";
import {
  Mail,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Paperclip,
  Flame,
  AlertCircle,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import type { EmailItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmailTrackingTableProps {
  emails: EmailItem[];
  onSelectEmail: (email: EmailItem) => void;
  onScheduleMeetingFromEmail: (email: EmailItem) => void;
  onToggleStatus: (emailId: string) => void;
  searchQuery: string;
}

export const EmailTrackingTable: React.FC<EmailTrackingTableProps> = ({
  emails,
  onSelectEmail,
  onScheduleMeetingFromEmail,
  onToggleStatus,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEmails = emails.filter((em) => {
    // 1. Text search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchSubject = em.subject.toLowerCase().includes(q);
      const matchSender =
        em.sender.name.toLowerCase().includes(q) ||
        em.sender.email.toLowerCase().includes(q) ||
        em.sender.department.toLowerCase().includes(q);
      const matchSnippet = em.snippet.toLowerCase().includes(q);
      if (!matchSubject && !matchSender && !matchSnippet) return false;
    }

    // 2. Status filter
    if (statusFilter !== "all" && em.status !== statusFilter) return false;

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "responded":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 font-medium text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
            Respondido
          </Badge>
        );
      case "waiting":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 font-medium text-xs">
            <Clock className="h-3 w-3 mr-1 text-blue-600" />
            En Espera
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 font-medium text-xs">
            <Clock className="h-3 w-3 mr-1 text-amber-600" />
            Pendiente
          </Badge>
        );
    }
  };

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return "Hace momentos";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffHours < 48) return "Ayer";
    return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  };

  const pendingCount = emails.filter((e) => e.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Top Filter and Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="font-medium hidden sm:inline">Filtrar Estado:</span>
          </div>

          <button
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#0078D4] text-white shadow-2xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos ({emails.length})
          </button>

          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Pendientes</span>
            <span className="ml-1 px-1 rounded bg-black/20 text-[10px]">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("responded")}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === "responded"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Respondidos
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Buzón sincronizado vía Exchange Online API
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40 text-xs">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-[38%]">Asunto & Resumen</TableHead>
              <TableHead className="w-[24%]">Remitente</TableHead>
              <TableHead className="w-[14%]">Recepción</TableHead>
              <TableHead className="w-[14%]">Estado</TableHead>
              <TableHead className="w-[10%] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <TableRow
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className={`group cursor-pointer transition-colors hover:bg-muted/50 ${
                    email.status === "pending" ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                  }`}
                >
                  {/* Priority icon */}
                  <TableCell className="pl-4 pr-1">
                    <div className="flex items-center justify-center">
                      {email.priority === "critical" ? (
                        <Flame className="h-4 w-4 text-red-600 animate-pulse" />
                      ) : email.priority === "high" ? (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      ) : (
                        <Mail className="h-4 w-4 text-muted-foreground/60 group-hover:text-[#0078D4]" />
                      )}
                    </div>
                  </TableCell>

                  {/* Subject & snippet */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-[#0078D4] transition-colors line-clamp-1">
                          {email.subject}
                        </span>
                        {email.hasAttachments && (
                          <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                        {email.internalNotes.length > 0 && (
                          <span className="inline-flex items-center text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950 px-1 rounded">
                            {email.internalNotes.length} notas
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {email.snippet}
                      </p>
                    </div>
                  </TableCell>

                  {/* Sender */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          email.sender.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            email.sender.name
                          )}&background=0078D4&color=fff`
                        }
                        alt={email.sender.name}
                        className="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-border"
                      />
                      <div className="truncate">
                        <p className="text-xs font-medium text-foreground truncate">
                          {email.sender.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {email.sender.department}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Received Date */}
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      <p className="font-medium text-foreground">
                        {formatRelativeDate(email.receivedDate)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(email.receivedDate).toLocaleTimeString(
                          "es-ES",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                    </div>
                  </TableCell>

                  {/* Response status */}
                  <TableCell>{getStatusBadge(email.status)}</TableCell>

                  {/* Quick actions */}
                  <TableCell className="text-right pr-4">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        onClick={() => onScheduleMeetingFromEmail(email)}
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-[#0078D4] hover:bg-muted cursor-pointer"
                        title="Agendar reunión desde este correo"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={() => onToggleStatus(email.id)}
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-emerald-600 hover:bg-muted cursor-pointer"
                        title={
                          email.status === "responded"
                            ? "Marcar como pendiente"
                            : "Marcar como respondido"
                        }
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={() => onSelectEmail(email)}
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                        title="Ver detalle"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Mail className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      No se encontraron correos para este filtro
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Intenta buscar con otros términos o ajusta los filtros de estado o prioridad.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
