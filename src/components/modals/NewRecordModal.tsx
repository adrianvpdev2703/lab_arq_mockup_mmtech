import React, { useState, useEffect } from "react";
import {
  Video,
  Mail,
  Users,
  Bell,
  Sparkles,
  X,
  Check,
  Building2,
  ShieldCheck,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  OperationalItem,
  OperationalStatus,
  Participant,
  PriorityLevel,
  EventType,
  TIUnit,
} from "@/types";
import { teamMembers, currentUser } from "@/mock/data";

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newItem: Partial<OperationalItem>) => void;
  initialData?: Partial<OperationalItem> | null;
  defaultStatus?: OperationalStatus;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultStatus = "pending",
}) => {
  const [eventType, setEventType] = useState<EventType>("meeting");
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState<TIUnit>("Infraestructura");
  const [date, setDate] = useState("2026-10-02");
  const [startTime, setStartTime] = useState("10:00");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [status, setStatus] = useState<OperationalStatus>(defaultStatus);
  const [notes, setNotes] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([
    currentUser,
  ]);
  const [participantSearch, setParticipantSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Reminders config (aligned with filled form: 1:1 chat card in Teams)
  const [reminderEmail, setReminderEmail] = useState(true);
  const [reminderTeams, setReminderTeams] = useState(true);
  const [emailTime, setEmailTime] = useState("24h antes");
  const [teamsTime, setTeamsTime] = useState("15m antes");

  // Simulated saving loading state
  const [isSaving, setIsSaving] = useState(false);

  // Reset or fill data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setEventType(initialData.type || "meeting");
        setTitle(initialData.title || "");
        setUnit((initialData.unit as TIUnit) || "Infraestructura");
        setPriority(initialData.priority || "medium");
        setStatus(initialData.status || defaultStatus);
        setNotes(initialData.notes || initialData.description || "");
        if (initialData.attendees && initialData.attendees.length > 0) {
          setSelectedParticipants(initialData.attendees);
        } else {
          setSelectedParticipants([currentUser]);
        }
      } else {
        setEventType("meeting");
        setTitle("");
        setUnit("Infraestructura");
        setDate("2026-10-02");
        setStartTime("10:00");
        setDurationMinutes("30");
        setPriority("medium");
        setStatus(defaultStatus);
        setNotes("");
        setSelectedParticipants([currentUser]);
      }
      setIsSaving(false);
    }
  }, [isOpen, initialData, defaultStatus]);

  const toggleParticipant = (member: Participant) => {
    if (selectedParticipants.some((p) => p.id === member.id)) {
      if (member.id === currentUser.id) return;
      setSelectedParticipants((prev) => prev.filter((p) => p.id !== member.id));
    } else {
      setSelectedParticipants((prev) => [...prev, member]);
    }
  };

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(participantSearch.toLowerCase()) ||
      m.department.toLowerCase().includes(participantSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);

    const formattedDate =
      date === "2026-10-02"
        ? `Hoy, ${startTime}`
        : date === "2026-10-03"
        ? `Mañana, ${startTime}`
        : `${date}, ${startTime}`;

    const tag =
      eventType === "meeting"
        ? "Reunión Teams"
        : eventType === "email_followup"
        ? "Correo Prioritario"
        : "Revisión Operativa";

    setTimeout(() => {
      onSave({
        title,
        description: notes || "Sin descripción adicional.",
        type: eventType,
        status,
        tag,
        unit,
        priority,
        scheduledDate: formattedDate,
        time: `${startTime} (${durationMinutes} min)`,
        durationMinutes: parseInt(durationMinutes, 10),
        attendees: selectedParticipants,
        reminder: {
          hasEmailAlert: reminderEmail,
          hasTeamsAlert: reminderTeams,
          emailAlertTime: emailTime,
          teamsAlertTime: teamsTime,
          isManualSent: false,
        },
        notes,
        teamsLink:
          eventType === "meeting"
            ? `https://teams.microsoft.com/l/meetup-join/${encodeURIComponent(title)}`
            : undefined,
      });
      setIsSaving(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-background">
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b bg-card">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-6 w-6 rounded-md bg-[#0078D4] text-white flex items-center justify-center text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              {initialData?.title ? "Editar Registro GSIC" : "Nuevo Registro en SharePoint GSIC"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Registra una reunión de Teams o un seguimiento de correo para la alineación semanal de TI.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form
          id="new-record-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-4"
        >
          {/* 1. Event Type Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Tipo de Registro
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEventType("meeting")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  eventType === "meeting"
                    ? "border-[#5B5FC7] bg-[#5B5FC7]/10 text-[#5B5FC7] ring-1 ring-[#5B5FC7]"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <Video className="h-4 w-4" />
                <span>Reunión de Microsoft Teams</span>
              </button>

              <button
                type="button"
                onClick={() => setEventType("email_followup")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  eventType === "email_followup"
                    ? "border-[#0078D4] bg-[#0078D4]/10 text-[#0078D4] ring-1 ring-[#0078D4]"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Seguimiento de Correo / Tarea</span>
              </button>
            </div>
          </div>

          {/* 2. Title & Unit */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-foreground">
              {eventType === "meeting" ? "Título de la Convocatoria" : "Asunto del Correo"} *
            </Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                eventType === "meeting"
                  ? "Ej. Revisión Bloqueador: Certificados SSL de Integración"
                  : "Ej. Notificación urgente: Vencimiento de Certificados SSL"
              }
              className="h-9 text-xs sm:text-sm bg-card"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Layers className="h-3 w-3 text-[#0078D4]" />
                <span>Unidad de TI Responsable</span>
              </Label>
              <Select value={unit} onValueChange={(val) => setUnit(val as TIUnit)}>
                <SelectTrigger className="h-9 text-xs bg-card">
                  <SelectValue placeholder="Unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infraestructura">Infraestructura</SelectItem>
                  <SelectItem value="Arquitectura">Arquitectura</SelectItem>
                  <SelectItem value="Redes">Redes</SelectItem>
                  <SelectItem value="Ciberseguridad">Ciberseguridad</SelectItem>
                  <SelectItem value="Bases de Datos">Bases de Datos</SelectItem>
                  <SelectItem value="Integración">Integración</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Nivel de Prioridad
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as PriorityLevel)}
              >
                <SelectTrigger className="h-9 text-xs bg-card">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja - Informativo</SelectItem>
                  <SelectItem value="medium">Media - Regular</SelectItem>
                  <SelectItem value="high">Alta - Importante</SelectItem>
                  <SelectItem value="critical">Crítica - Bloqueador Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Fecha
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 text-xs bg-card"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Hora de Inicio
              </Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-9 text-xs bg-card"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Duración Estimada
              </Label>
              <Select
                value={durationMinutes}
                onValueChange={(val) => setDurationMinutes(val)}
              >
                <SelectTrigger className="h-9 text-xs bg-card">
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min (Quick Sync)</SelectItem>
                  <SelectItem value="30">30 min (Estándar)</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 hora (Revisión técnica)</SelectItem>
                  <SelectItem value="90">1.5 horas (Alineación Semanal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Estado de la Sesión
            </Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as OperationalStatus)}
            >
              <SelectTrigger className="h-9 text-xs bg-card">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Por Agendar</SelectItem>
                <SelectItem value="scheduled">Programada / Confirmada</SelectItem>
                <SelectItem value="completed">Finalizada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Participants with simulated autocomplete */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#0078D4]" />
                <span>Participantes Convocados ({selectedParticipants.length})</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                Directorio Azure Entra ID GSIC
              </span>
            </div>

            {/* Selected chips */}
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border bg-muted/30 min-h-11">
              {selectedParticipants.map((participant) => (
                <span
                  key={participant.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-card border text-xs font-medium text-foreground shadow-2xs"
                >
                  <img
                    src={
                      participant.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        participant.name
                      )}&background=0078D4&color=fff`
                    }
                    alt={participant.name}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <span>{participant.name}</span>
                  {participant.id !== currentUser.id && (
                    <button
                      type="button"
                      onClick={() => toggleParticipant(participant)}
                      className="text-muted-foreground hover:text-red-500 ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Quick selector dropdown */}
            <div className="space-y-1">
              <Input
                value={participantSearch}
                onChange={(e) => {
                  setParticipantSearch(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Buscar líder o especialista de TI por nombre o unidad..."
                className="h-8 text-xs bg-card"
              />

              {isSearchOpen && (
                <div className="rounded-lg border bg-card p-1 shadow-md max-h-36 overflow-y-auto space-y-0.5">
                  {filteredMembers.map((member) => {
                    const isSelected = selectedParticipants.some(
                      (p) => p.id === member.id
                    );
                    return (
                      <div
                        key={member.id}
                        onClick={() => toggleParticipant(member)}
                        className={`flex items-center justify-between p-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/40 text-[#0078D4]"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-5 w-5 rounded-full object-cover shrink-0"
                          />
                          <div className="truncate">
                            <p className="font-medium truncate">{member.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {member.role} · {member.department}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 6. Reminder Settings (Conforme a la respuesta 5.3 del formulario: chat 1:1) */}
          <div className="p-3 rounded-xl border bg-muted/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-[#0078D4]" />
                <span>Alertas en Teams y Outlook (Power Automate)</span>
              </Label>
              <Badge variant="outline" className="text-[10px] font-normal">
                Chat 1:1 con Bot
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder-teams"
                    checked={reminderTeams}
                    onCheckedChange={(c) => setReminderTeams(!!c)}
                  />
                  <label
                    htmlFor="reminder-teams"
                    className="text-xs font-medium leading-none cursor-pointer"
                  >
                    Enviar tarjeta adaptativa por chat privado 1:1 en Teams ({teamsTime})
                  </label>
                </div>
                <Select
                  value={teamsTime}
                  onValueChange={setTeamsTime}
                  disabled={!reminderTeams}
                >
                  <SelectTrigger className="h-7 w-28 text-[11px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m antes">15m antes</SelectItem>
                    <SelectItem value="30m antes">30m antes</SelectItem>
                    <SelectItem value="1h antes">1h antes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder-email"
                    checked={reminderEmail}
                    onCheckedChange={(c) => setReminderEmail(!!c)}
                  />
                  <label
                    htmlFor="reminder-email"
                    className="text-xs font-medium leading-none cursor-pointer"
                  >
                    Enviar resumen previo por correo Outlook ({emailTime})
                  </label>
                </div>
                <Select
                  value={emailTime}
                  onValueChange={setEmailTime}
                  disabled={!reminderEmail}
                >
                  <SelectTrigger className="h-7 w-28 text-[11px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2h antes">2h antes</SelectItem>
                    <SelectItem value="24h antes">24h antes (Martes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 7. Notes / Objective */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold text-foreground">
              Puntos Críticos, Agenda o Bloqueadores
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalla los puntos a tratar en la reunión semanal de TI o los acuerdos del correo..."
              rows={3}
              className="text-xs resize-none bg-card"
            />
          </div>
        </form>

        {/* Footer */}
        <DialogFooter className="p-4 border-t bg-card flex items-center justify-between sm:justify-between">
          <div className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1">
            <Building2 className="h-3 w-3 text-emerald-600" />
            <span>Destino: Lista SharePoint "Seguimiento_Semanal_GSIC"</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 text-xs cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              form="new-record-form"
              disabled={isSaving || !title.trim()}
              className="h-8 text-xs font-semibold bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sincronizando con SharePoint...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Guardar en SharePoint</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
