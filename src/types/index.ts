export type OperationalStatus = "pending" | "scheduled" | "completed" | "cancelled";

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type EventType = "meeting" | "email_followup" | "review" | "approval";

export type TIUnit =
  | "Infraestructura"
  | "Arquitectura"
  | "Redes"
  | "Ciberseguridad"
  | "Bases de Datos"
  | "Integración";

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  department: TIUnit | string;
  avatar?: string;
  initials: string;
}

export interface ReminderConfig {
  hasEmailAlert: boolean;
  hasTeamsAlert: boolean;
  emailAlertTime?: string;
  teamsAlertTime?: string;
  isManualSent?: boolean;
  lastManualSentDate?: string;
}

export interface OperationalItem {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: OperationalStatus;
  tag: string;
  unit: TIUnit | string;
  priority: PriorityLevel;
  scheduledDate: string;
  time?: string;
  durationMinutes?: number;
  isOverdue?: boolean;
  isDueSoon?: boolean;
  attendees: Participant[];
  reminder: ReminderConfig;
  notes?: string;
  teamsLink?: string;
  sourceEmailId?: string;
  createdAt: string;
}

export interface EmailNote {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  authorInitials: string;
  content: string;
  createdAt: string;
}

export interface EmailItem {
  id: string;
  subject: string;
  sender: Participant;
  recipients: string[];
  receivedDate: string;
  status: "pending" | "responded" | "waiting";
  priority: PriorityLevel;
  unit?: TIUnit | string;
  snippet: string;
  body: string;
  hasAttachments: boolean;
  attachments?: { name: string; size: string; type: string }[];
  internalNotes: EmailNote[];
  relatedMeetingId?: string;
}

export type ViewType = "hub" | "meetings" | "emails" | "metrics";

export type QuickFilterType = "all" | "my_pending" | "this_week" | "high_priority";
