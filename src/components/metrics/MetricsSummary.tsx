import React from "react";
import {
  Calendar,
  Clock,
  Mail,
  TrendingUp,
  Flame,
  ShieldCheck,
} from "lucide-react";
import type { OperationalItem, EmailItem } from "@/types";

interface MetricsSummaryProps {
  operationalItems: OperationalItem[];
  emails: EmailItem[];
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  operationalItems,
  emails,
}) => {
  const pendingCount = operationalItems.filter((i) => i.status === "pending").length;
  const todayMeetings = operationalItems.filter(
    (i) => i.scheduledDate.toLowerCase().includes("hoy") && i.status !== "completed"
  ).length;
  const pendingEmails = emails.filter((e) => e.status === "pending").length;
  const criticalItems = operationalItems.filter(
    (i) => i.priority === "critical" && i.status !== "completed"
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
      {/* Metric 1 */}
      <div className="rounded-xl border bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Sesiones por Agendar
          </span>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            {pendingCount}
          </span>
          <span className="text-[11px] font-medium text-amber-600 flex items-center">
            Requieren fecha
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Pendientes antes del miércoles
        </p>
      </div>

      {/* Metric 2 */}
      <div className="rounded-xl border bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Reuniones Teams Hoy
          </span>
          <div className="h-8 w-8 rounded-lg bg-[#5B5FC7]/10 text-[#5B5FC7] flex items-center justify-center">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            {todayMeetings}
          </span>
          <span className="text-[11px] font-medium text-[#5B5FC7]">
            Próxima: 15:30
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Convocatorias activas
        </p>
      </div>

      {/* Metric 3 */}
      <div className="rounded-xl border bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Correos por Atender
          </span>
          <div className="h-8 w-8 rounded-lg bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center">
            <Mail className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            {pendingEmails}
          </span>
          {criticalItems > 0 && (
            <span className="text-[11px] font-semibold text-red-600 flex items-center gap-0.5">
              <Flame className="h-3 w-3" />
              {criticalItems} bloqueador
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Buzón de seguimiento GSIC
        </p>
      </div>

      {/* Metric 4 */}
      <div className="rounded-xl border bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Cumplimiento Semanal
          </span>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            96.8%
          </span>
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +2.4%
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Objetivo previo a alineación
        </p>
      </div>
    </div>
  );
};
