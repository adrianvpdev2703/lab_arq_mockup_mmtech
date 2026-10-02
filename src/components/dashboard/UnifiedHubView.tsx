import React from "react";
import {
  Video,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  CalendarPlus,
  Plus,
  Paperclip,
  Flame,
} from "lucide-react";
import type { OperationalItem, EmailItem, QuickFilterType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UnifiedHubViewProps {
  operationalItems: OperationalItem[];
  emails: EmailItem[];
  onOpenNewRecord: () => void;
  onSelectEmail: (email: EmailItem) => void;
  onScheduleMeetingFromEmail: (email: EmailItem) => void;
  onSendManualReminder: (item: OperationalItem) => void;
  onMarkMeetingCompleted: (id: string) => void;
  onToggleEmailStatus: (emailId: string) => void;
  searchQuery: string;
  quickFilter: QuickFilterType;
}

export const UnifiedHubView: React.FC<UnifiedHubViewProps> = ({
  operationalItems,
  emails,
  onOpenNewRecord,
  onSelectEmail,
  onScheduleMeetingFromEmail,
  onSendManualReminder,
  onMarkMeetingCompleted,
  onToggleEmailStatus,
  searchQuery,
  quickFilter,
}) => {
  // Filter meetings
  const filteredMeetings = operationalItems.filter((item) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.attendees.some((a) => a.name.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (quickFilter === "my_pending") {
      if (item.status !== "pending") return false;
    } else if (quickFilter === "high_priority") {
      if (item.priority !== "critical" && item.priority !== "high") return false;
    }
    return true;
  });

  // Filter emails
  const filteredEmails = emails.filter((em) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const match =
        em.subject.toLowerCase().includes(q) ||
        em.snippet.toLowerCase().includes(q) ||
        em.sender.name.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (quickFilter === "my_pending") {
      if (em.status !== "pending") return false;
    } else if (quickFilter === "high_priority") {
      if (em.priority !== "critical" && em.priority !== "high") return false;
    }
    return true;
  });

  const activeMeetings = filteredMeetings.filter((m) => m.status !== "completed");
  const pendingEmails = filteredEmails.filter((e) => e.status === "pending");

  return (
    <div className="space-y-6">
      {/* Central Hub Grid (2 Columns: Teams Meetings & Follow-up Emails) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================== */}
        {/* PANEL IZQUIERDO: REUNIONES DE TEAMS ACTIVAS (7 de 12 columnas) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#5B5FC7]/15 text-[#5B5FC7] flex items-center justify-center font-bold">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">
                    Reuniones de Microsoft Teams
                  </h3>
                  <Badge variant="secondary" className="text-xs h-5">
                    {activeMeetings.length} activas
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Sesiones programadas y convocatorias operativas
                </p>
              </div>
            </div>

            <Button
              onClick={onOpenNewRecord}
              size="sm"
              className="h-8 text-xs bg-[#5B5FC7] hover:bg-[#4F52B2] text-white shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Agendar Reunión</span>
            </Button>
          </div>

          {/* Lista de Reuniones */}
          <div className="space-y-3">
            {activeMeetings.length > 0 ? (
              activeMeetings.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border bg-card hover:border-[#5B5FC7]/40 hover:shadow-sm transition-all space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground hover:text-[#0078D4] transition-colors">
                          {item.title}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 h-4.5 bg-blue-50/50 text-[#0078D4] dark:bg-blue-950/40 dark:text-blue-300 border-blue-200"
                        >
                          {item.tag}
                        </Badge>
                        {item.priority === "critical" && (
                          <Badge className="text-[10px] py-0 h-4.5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200">
                            <Flame className="h-2.5 w-2.5 mr-0.5" />
                            Urgente
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                          item.isDueSoon
                            ? "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 font-semibold"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>{item.scheduledDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer de Tarjeta con Asistentes y Acciones Directas */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
                    {/* Avatares */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1.5 overflow-hidden">
                        {item.attendees.slice(0, 3).map((a) => (
                          <img
                            key={a.id}
                            src={
                              a.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                a.name
                              )}&background=0078D4&color=fff`
                            }
                            alt={a.name}
                            title={`${a.name} (${a.role})`}
                            className="inline-block h-6 w-6 rounded-full object-cover ring-2 ring-background"
                          />
                        ))}
                        {item.attendees.length > 3 && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
                            +{item.attendees.length - 3}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {item.attendees.length} convocados
                      </span>
                    </div>

                    {/* Botones de Acción de Teams */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        onClick={() => onSendManualReminder(item)}
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-[#0078D4] border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                        title="Enviar recordatorio interactivo por Teams"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        <span>Aviso Teams</span>
                      </Button>

                      {item.teamsLink && (
                        <Button
                          onClick={() => window.open(item.teamsLink, "_blank")}
                          size="sm"
                          className="h-8 text-xs bg-[#5B5FC7] hover:bg-[#4F52B2] text-white shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Unirse a Teams</span>
                        </Button>
                      )}

                      <Button
                        onClick={() => onMarkMeetingCompleted(item.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                        title="Marcar sesión como finalizada"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        <span>Finalizar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-card rounded-xl border border-dashed">
                <p className="text-xs font-semibold text-foreground">
                  No hay reuniones pendientes
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Todas las sesiones operativas se encuentran al día.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* PANEL DERECHO: CORREOS CRÍTICOS Y CONVERSIÓN (5 de 12 columnas) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#0078D4]/15 text-[#0078D4] flex items-center justify-center font-bold">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">
                    Buzón de Seguimiento
                  </h3>
                  <Badge variant="secondary" className="text-xs h-5">
                    {pendingEmails.length} por atender
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Correos prioritarios para seguimiento y agendamiento
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Correos con Conversión 1-Clic */}
          <div className="space-y-3">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`p-4 rounded-xl border bg-card hover:border-[#0078D4]/40 hover:shadow-sm transition-all space-y-2.5 shadow-2xs cursor-pointer group ${
                  email.status === "pending"
                    ? "bg-amber-50/20 dark:bg-amber-950/10"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {email.priority === "critical" ? (
                      <Flame className="h-4 w-4 text-red-600 shrink-0 animate-pulse" />
                    ) : (
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-[#0078D4]" />
                    )}
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-[#0078D4] transition-colors line-clamp-1">
                      {email.subject}
                    </h4>
                  </div>

                  {email.hasAttachments && (
                    <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {email.snippet}
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <img
                      src={email.sender.avatar}
                      alt={email.sender.name}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    <span className="font-medium text-foreground truncate">
                      {email.sender.name}
                    </span>
                    <span className="text-muted-foreground">
                      · {email.sender.department}
                    </span>
                  </div>

                  <span className="shrink-0 font-medium">
                    {new Date(email.receivedDate).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Botón Destacado: Agendar a Teams desde Correo */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-border/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={() => onToggleEmailStatus(email.id)}
                    size="sm"
                    variant="ghost"
                    className="h-7 text-[11px] text-muted-foreground hover:text-emerald-600 px-2 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    <span>
                      {email.status === "responded" ? "Respondido" : "Pendiente"}
                    </span>
                  </Button>

                  <Button
                    onClick={() => onScheduleMeetingFromEmail(email)}
                    size="sm"
                    className="h-7 text-xs bg-[#0078D4] hover:bg-[#106EBE] text-white shadow-xs rounded-md cursor-pointer flex items-center gap-1"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    <span>Agendar en Teams</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
