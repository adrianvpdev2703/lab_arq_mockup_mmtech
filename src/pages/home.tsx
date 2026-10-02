import { useState } from "react";
import { toast } from "sonner";
import type {
  OperationalItem,
  EmailItem,
  ViewType,
  QuickFilterType,
  OperationalStatus,
} from "@/types";
import {
  currentUser,
  initialOperationalItems,
  initialEmails,
} from "@/mock/data";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UnifiedHubView } from "@/components/dashboard/UnifiedHubView";
import { EmailTrackingTable } from "@/components/email/EmailTrackingTable";
import { EmailDetailDrawer } from "@/components/email/EmailDetailDrawer";
import { MeetingListView } from "@/components/meetings/MeetingListView";
import { MetricsSummary } from "@/components/metrics/MetricsSummary";
import { NewRecordModal } from "@/components/modals/NewRecordModal";

export default function HomePage() {
  // State for items & data
  const [operationalItems, setOperationalItems] = useState<OperationalItem[]>(
    initialOperationalItems
  );
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);

  // Navigation & View state (Default: Unified Hub)
  const [currentView, setCurrentView] = useState<ViewType>("hub");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>("all");

  // Modals & Drawers state
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OperationalItem | null>(null);
  const [newRecordDefaultStatus, setNewRecordDefaultStatus] =
    useState<OperationalStatus>("scheduled");
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [prefilledData, setPrefilledData] =
    useState<Partial<OperationalItem> | null>(null);

  // Handlers for Operational Meeting status
  const handleMoveStatus = (id: string, newStatus: OperationalStatus) => {
    setOperationalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const statusLabels: Record<OperationalStatus, string> = {
            pending: "Por Agendar",
            scheduled: "Programada / Confirmada",
            completed: "Finalizada",
            cancelled: "Cancelada",
          };
          toast.success("Estado actualizado en SharePoint", {
            description: `"${item.title.substring(0, 32)}..." ahora está en estado ${statusLabels[newStatus]}`,
          });
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleMarkMeetingCompleted = (id: string) => {
    handleMoveStatus(id, "completed");
  };

  // Handler for sending manual reminder (Chat 1:1 in Teams)
  const handleSendManualReminder = (item: OperationalItem) => {
    setOperationalItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) {
          return {
            ...i,
            reminder: {
              ...i.reminder,
              isManualSent: true,
              lastManualSentDate: new Date().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          };
        }
        return i;
      })
    );

    toast.info("Recordatorio enviado por Teams (Chat 1:1)", {
      description: `Se disparó la tarjeta interactiva al chat privado de los ${item.attendees.length} líderes convocados.`,
    });
  };

  // Handler for editing an item
  const handleEditItem = (item: OperationalItem) => {
    setEditingItem(item);
    setPrefilledData(item);
    setNewRecordDefaultStatus(item.status);
    setIsNewRecordOpen(true);
  };

  // Handler for saving New or Edited record
  const handleSaveRecord = (itemData: Partial<OperationalItem>) => {
    if (editingItem) {
      setOperationalItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id ? ({ ...i, ...itemData } as OperationalItem) : i
        )
      );
      toast.success("Registro modificado en SharePoint", {
        description: `Los cambios para "${itemData.title}" fueron sincronizados en la lista GSIC.`,
      });
    } else {
      const newItem: OperationalItem = {
        id: `op-${Date.now()}`,
        title: itemData.title || "Sin título",
        description: itemData.description || "",
        type: itemData.type || "meeting",
        status: itemData.status || newRecordDefaultStatus,
        tag:
          itemData.tag ||
          (itemData.type === "meeting" ? "Reunión Teams" : "Correo Prioritario"),
        unit: itemData.unit || "Infraestructura",
        priority: itemData.priority || "medium",
        scheduledDate: itemData.scheduledDate || "Próximamente",
        time: itemData.time,
        durationMinutes: itemData.durationMinutes || 30,
        attendees: itemData.attendees || [currentUser],
        reminder: itemData.reminder || {
          hasEmailAlert: true,
          hasTeamsAlert: true,
          isManualSent: false,
        },
        notes: itemData.notes,
        teamsLink: itemData.teamsLink,
        sourceEmailId: itemData.sourceEmailId,
        createdAt: new Date().toISOString(),
      };

      setOperationalItems((prev) => [newItem, ...prev]);
      toast.success("Guardado en SharePoint Lists", {
        description: `Se registró exitosamente en la lista "Seguimiento_Semanal_GSIC".`,
      });
    }

    setIsNewRecordOpen(false);
    setEditingItem(null);
    setPrefilledData(null);
  };

  // Handler for selecting email to view slide-over drawer
  const handleSelectEmail = (email: EmailItem) => {
    setSelectedEmail(email);
    setIsEmailDrawerOpen(true);
  };

  // Handler for scheduling meeting directly from an email (1-clic)
  const handleScheduleMeetingFromEmail = (email: EmailItem) => {
    setIsEmailDrawerOpen(false);
    setEditingItem(null);
    setPrefilledData({
      title: `Seguimiento: ${email.subject}`,
      description: `Reunión operativa derivada del correo de ${email.sender.name} (${email.sender.department}).\n\nResumen:\n${email.snippet}`,
      type: "meeting",
      unit: email.unit || "Infraestructura",
      priority: email.priority,
      status: "scheduled",
      tag: "Reunión Teams",
      attendees: [currentUser, email.sender],
      sourceEmailId: email.id,
      notes: `Referencia: Correo recibido el ${new Date(
        email.receivedDate
      ).toLocaleDateString("es-ES")}.`,
    });
    setNewRecordDefaultStatus("scheduled");
    setIsNewRecordOpen(true);

    toast.info("Formulario pre-cargado desde correo", {
      description: `Se importaron asunto, remitente (${email.sender.name}) y notas para agendar en Teams.`,
    });
  };

  // Handler to toggle email status (pending <-> responded)
  const handleToggleEmailStatus = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          const nextStatus = e.status === "responded" ? "pending" : "responded";
          if (nextStatus === "responded") {
            toast.success("Correo marcado como atendido", {
              description: `"${e.subject.substring(0, 35)}..." actualizado.`,
            });
          } else {
            toast.info("Correo devuelto a pendientes", {
              description: `"${e.subject.substring(0, 35)}..." requiere seguimiento.`,
            });
          }
          const updated = { ...e, status: nextStatus as "pending" | "responded" };
          if (selectedEmail && selectedEmail.id === emailId) {
            setSelectedEmail(updated);
          }
          return updated;
        }
        return e;
      })
    );
  };

  // Handler to add internal team note to an email
  const handleAddEmailNote = (emailId: string, noteContent: string) => {
    const newNote = {
      id: `nt-${Date.now()}`,
      author: currentUser.name,
      authorRole: currentUser.role,
      authorInitials: currentUser.initials,
      content: noteContent,
      createdAt: "Hace un momento",
    };

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          const updated = {
            ...e,
            internalNotes: [...e.internalNotes, newNote],
          };
          if (selectedEmail && selectedEmail.id === emailId) {
            setSelectedEmail(updated);
          }
          return updated;
        }
        return e;
      })
    );

    toast.success("Nota interna guardada", {
      description: "La anotación es visible confidencialmente para el equipo GSIC.",
    });
  };

  // Count helper
  const pendingCount = operationalItems.filter((i) => i.status === "pending").length;
  const meetingsCount = operationalItems.filter((i) => i.type === "meeting").length;
  const emailsCount = emails.filter((e) => e.status === "pending").length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* 1. Collapsible Sidebar */}
      <AppSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        meetingsCount={meetingsCount}
        emailsCount={emailsCount}
        currentUser={currentUser}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <AppHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          quickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
          onOpenNewRecord={() => {
            setEditingItem(null);
            setPrefilledData(null);
            setNewRecordDefaultStatus("scheduled");
            setIsNewRecordOpen(true);
          }}
          pendingCount={pendingCount}
        />

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/20">
          <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
            {/* Top KPI Metrics Bar */}
            <MetricsSummary
              operationalItems={operationalItems}
              emails={emails}
            />

            {/* View Switching */}
            {currentView === "hub" && (
              <div className="flex-1 min-h-0">
                <UnifiedHubView
                  operationalItems={operationalItems}
                  emails={emails}
                  onOpenNewRecord={() => {
                    setEditingItem(null);
                    setPrefilledData({ type: "meeting" });
                    setNewRecordDefaultStatus("scheduled");
                    setIsNewRecordOpen(true);
                  }}
                  onSelectEmail={handleSelectEmail}
                  onScheduleMeetingFromEmail={handleScheduleMeetingFromEmail}
                  onSendManualReminder={handleSendManualReminder}
                  onMarkMeetingCompleted={handleMarkMeetingCompleted}
                  onToggleEmailStatus={handleToggleEmailStatus}
                  searchQuery={searchQuery}
                  quickFilter={quickFilter}
                />
              </div>
            )}

            {currentView === "meetings" && (
              <div className="flex-1 min-h-0">
                <MeetingListView
                  items={operationalItems}
                  onMoveStatus={handleMoveStatus}
                  onSendManualReminder={handleSendManualReminder}
                  onOpenNewRecord={() => {
                    setEditingItem(null);
                    setPrefilledData({ type: "meeting" });
                    setNewRecordDefaultStatus("scheduled");
                    setIsNewRecordOpen(true);
                  }}
                  onSelectMeeting={handleEditItem}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {currentView === "emails" && (
              <div className="flex-1 min-h-0">
                <EmailTrackingTable
                  emails={emails}
                  onSelectEmail={handleSelectEmail}
                  onScheduleMeetingFromEmail={handleScheduleMeetingFromEmail}
                  onToggleStatus={handleToggleEmailStatus}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {currentView === "metrics" && (
              <div className="flex-1 min-h-0 space-y-4">
                <div className="p-6 rounded-2xl bg-card border shadow-2xs space-y-4">
                  <h2 className="text-lg font-bold text-foreground">
                    Reporte Ejecutivo Semanal GSIC (Reunión de Miércoles)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Métricas de resolución operativa, mitigación de bloqueadores y efectividad de convocatorias en Teams.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                        Conversión Correo ➔ Reunión
                      </h4>
                      <p className="text-2xl font-bold text-[#0078D4]">92%</p>
                      <p className="text-xs text-muted-foreground">
                        Correos con bloqueadores convertidos en sesiones Teams en menos de 2h.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                        Efectividad de Alertas Teams
                      </h4>
                      <p className="text-2xl font-bold text-emerald-600">97.5%</p>
                      <p className="text-xs text-muted-foreground">
                        Líderes que confirmaron asistencia tras el recordatorio privado 1:1.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                        Resolución de Bloqueadores
                      </h4>
                      <p className="text-2xl font-bold text-[#5B5FC7]">89.4%</p>
                      <p className="text-xs text-muted-foreground">
                        Temas críticos resueltos antes del cierre de la semana.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. Slide-over / Drawer for Email Details */}
      <EmailDetailDrawer
        email={selectedEmail}
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        onScheduleMeetingFromEmail={handleScheduleMeetingFromEmail}
        onToggleStatus={handleToggleEmailStatus}
        onAddInternalNote={handleAddEmailNote}
      />

      {/* 4. Modal for New / Edit Record */}
      <NewRecordModal
        isOpen={isNewRecordOpen}
        onClose={() => {
          setIsNewRecordOpen(false);
          setEditingItem(null);
          setPrefilledData(null);
        }}
        onSave={handleSaveRecord}
        initialData={prefilledData}
        defaultStatus={newRecordDefaultStatus}
      />
    </div>
  );
}