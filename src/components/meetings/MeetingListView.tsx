import React from "react";
import {
  Video,
  Clock,
  Users,
  Send,
  CheckCircle2,
  Plus,
} from "lucide-react";
import type { OperationalItem, OperationalStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MeetingListViewProps {
  items: OperationalItem[];
  onMoveStatus: (id: string, newStatus: OperationalStatus) => void;
  onSendManualReminder: (item: OperationalItem) => void;
  onOpenNewRecord: () => void;
  onSelectMeeting?: (item: OperationalItem) => void;
  searchQuery: string;
}

export const MeetingListView: React.FC<MeetingListViewProps> = ({
  items,
  onMoveStatus,
  onSendManualReminder,
  onOpenNewRecord,
  onSelectMeeting,
  searchQuery,
}) => {
  // Only meetings or items with scheduled dates
  const meetingItems = items.filter((item) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.attendees.some((a) => a.name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const todayMeetings = meetingItems.filter(
    (i) => i.scheduledDate.toLowerCase().includes("hoy") && i.status !== "completed"
  );
  const upcomingMeetings = meetingItems.filter(
    (i) =>
      !i.scheduledDate.toLowerCase().includes("hoy") &&
      i.status !== "completed" &&
      i.status !== "cancelled"
  );
  const completedMeetings = meetingItems.filter((i) => i.status === "completed");

  const renderMeetingCard = (item: OperationalItem) => {
    return (
      <div
        key={item.id}
        onClick={() => onSelectMeeting && onSelectMeeting(item)}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/40 transition-colors shadow-2xs gap-4 cursor-pointer group"
      >
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-[#5B5FC7]/10 text-[#5B5FC7] flex items-center justify-center shrink-0">
            <Video className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground group-hover:text-[#0078D4] transition-colors">
                {item.title}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 h-4.5 bg-muted">
                {item.tag}
              </Badge>
              {item.isDueSoon && (
                <Badge className="text-[10px] py-0 h-4.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200">
                  Próxima a iniciar
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-1">
              {item.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Clock className="h-3.5 w-3.5 text-[#0078D4]" />
                {item.scheduledDate} {item.durationMinutes ? `(${item.durationMinutes} min)` : ""}
              </span>

              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{item.attendees.length} asistentes convocados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div
          className="flex items-center gap-2 self-end sm:self-center"
          onClick={(e) => e.stopPropagation()}
        >
          {item.teamsLink && (
            <Button
              onClick={() => window.open(item.teamsLink, "_blank")}
              size="sm"
              className="h-8 text-xs bg-[#5B5FC7] hover:bg-[#4F52B2] text-white rounded-lg cursor-pointer"
            >
              <Video className="h-3.5 w-3.5 mr-1" />
              <span>Unirse a Teams</span>
            </Button>
          )}

          <Button
            onClick={() => onSendManualReminder(item)}
            size="sm"
            variant="outline"
            className="h-8 text-xs rounded-lg cursor-pointer text-[#0078D4]"
            title="Enviar recordatorio manual a los asistentes por Teams"
          >
            <Send className="h-3 w-3 mr-1" />
            <span>Recordatorio</span>
          </Button>

          {item.status !== "completed" && (
            <Button
              onClick={() => onMoveStatus(item.id, "completed")}
              size="sm"
              variant="outline"
              className="h-8 text-xs rounded-lg text-emerald-600 hover:text-emerald-700 cursor-pointer"
              title="Marcar como completada"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              <span>Completar</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Agenda Operativa de Reuniones Teams
          </h2>
          <p className="text-xs text-muted-foreground">
            Sincronización en tiempo real con Microsoft Graph Calendar API.
          </p>
        </div>

        <Button
          onClick={onOpenNewRecord}
          size="sm"
          className="h-8 text-xs bg-[#0078D4] hover:bg-[#106EBE] text-white cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Agendar Reunión
        </Button>
      </div>

      {/* Group: Hoy */}
      {todayMeetings.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Reuniones de Hoy ({todayMeetings.length})
            </h3>
          </div>
          <div className="space-y-2">
            {todayMeetings.map(renderMeetingCard)}
          </div>
        </div>
      )}

      {/* Group: Próximas */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Próximas Sesiones Programadas ({upcomingMeetings.length})
        </h3>
        {upcomingMeetings.length > 0 ? (
          <div className="space-y-2">
            {upcomingMeetings.map(renderMeetingCard)}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic bg-muted/20 p-4 rounded-lg border text-center">
            No hay más reuniones pendientes en este momento.
          </p>
        )}
      </div>

      {/* Group: Completadas */}
      {completedMeetings.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Reuniones Finalizadas Recientemente ({completedMeetings.length})
          </h3>
          <div className="space-y-2">
            {completedMeetings.map(renderMeetingCard)}
          </div>
        </div>
      )}
    </div>
  );
};
