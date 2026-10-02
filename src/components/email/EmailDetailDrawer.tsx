import React, { useState } from "react";
import {
  CalendarPlus,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  ShieldCheck,
  Flame,
  AlertCircle,
} from "lucide-react";
import type { EmailItem } from "@/types";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EmailDetailDrawerProps {
  email: EmailItem | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleMeetingFromEmail: (email: EmailItem) => void;
  onToggleStatus: (emailId: string) => void;
  onAddInternalNote: (emailId: string, noteContent: string) => void;
}

export const EmailDetailDrawer: React.FC<EmailDetailDrawerProps> = ({
  email,
  isOpen,
  onClose,
  onScheduleMeetingFromEmail,
  onToggleStatus,
  onAddInternalNote,
}) => {
  const [newNote, setNewNote] = useState("");

  if (!email) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddInternalNote(email.id, newNote.trim());
    setNewNote("");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return (
          <Badge className="bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200">
            <Flame className="h-3 w-3 mr-1 text-red-600" />
            Crítica
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200">
            <AlertCircle className="h-3 w-3 mr-1 text-orange-600" />
            Alta Prioridad
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Normal
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "responded":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300">
            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
            Respondido
          </Badge>
        );
      case "waiting":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300">
            <Clock className="h-3 w-3 mr-1 text-blue-600" />
            En Espera
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300">
            <Clock className="h-3 w-3 mr-1 text-amber-600" />
            Pendiente de Respuesta
          </Badge>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex flex-col h-full w-full sm:max-w-xl md:max-w-2xl p-0 overflow-hidden bg-background"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b bg-card space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(email.status)}
            {getPriorityBadge(email.priority)}
            <Badge
              variant="outline"
              className="text-[11px] text-muted-foreground border-border flex items-center gap-1"
            >
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Verificado por Defender M365
            </Badge>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
            {email.subject}
          </h2>

          {/* Sender & Metadata Info Card */}
          <div className="flex items-start justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <img
                src={
                  email.sender.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    email.sender.name
                  )}&background=0078D4&color=fff`
                }
                alt={email.sender.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {email.sender.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {email.sender.email}
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  {email.sender.role} · {email.sender.department}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-muted-foreground">
              <p className="font-medium">Recibido:</p>
              <p>{new Date(email.receivedDate).toLocaleString("es-ES")}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content: Body + Attachments + Team Notes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Email Body */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mensaje Original
            </h4>
            <div className="p-4 rounded-xl bg-card border text-sm text-foreground whitespace-pre-line leading-relaxed font-sans shadow-2xs">
              {email.body}
            </div>
          </div>

          {/* Attachments Section */}
          {email.hasAttachments && email.attachments && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Archivos Adjuntos ({email.attachments.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {email.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/40 hover:bg-muted/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-[#0078D4] shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {file.size}
                        </p>
                      </div>
                    </div>
                    <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Team Notes Section */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#0078D4]" />
                <span>Notas Internas del Equipo ({email.internalNotes.length})</span>
              </h4>
              <span className="text-[11px] text-muted-foreground">
                Visible sólo para miembros internos
              </span>
            </div>

            {/* Existing Notes Thread */}
            {email.internalNotes.length > 0 ? (
              <div className="space-y-2.5">
                {email.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-[#0078D4] text-white text-[10px] font-bold flex items-center justify-center">
                          {note.authorInitials}
                        </span>
                        <span className="font-semibold text-foreground">
                          {note.author}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({note.authorRole})
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {note.createdAt}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 pl-7">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-dashed text-center">
                Aún no hay notas internas registradas para este correo.
              </p>
            )}

            {/* Add New Note Input */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-1">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribe una nota interna para seguimiento del equipo..."
                rows={2}
                className="text-xs resize-none bg-card focus:bg-background"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!newNote.trim()}
                  size="sm"
                  className="h-8 text-xs bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Agregar Nota
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Drawer Bottom Actions: Schedule meeting, Toggle response */}
        <div className="p-4 border-t bg-card flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <Button
            onClick={() => onToggleStatus(email.id)}
            variant="outline"
            className="w-full sm:w-auto h-9 text-xs rounded-lg border-muted-foreground/30 cursor-pointer"
          >
            {email.status === "responded" ? (
              <>
                <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                Marcar como Pendiente
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                Marcar como Respondido
              </>
            )}
          </Button>

          <Button
            onClick={() => onScheduleMeetingFromEmail(email)}
            className="w-full sm:w-auto h-9 text-xs font-semibold bg-[#0078D4] hover:bg-[#106EBE] active:bg-[#005A9E] text-white rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Agendar reunión a partir de este correo</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
