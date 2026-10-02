import type { Participant, OperationalItem, EmailItem } from "@/types";

export const currentUser: Participant = {
  id: "user-current",
  name: "Alejandro Silva",
  email: "alejandro.silva@empresa.com",
  role: "Coordinador de Integración & Plataformas",
  department: "Integración",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  initials: "AS",
};

export const teamMembers: Participant[] = [
  currentUser,
  {
    id: "user-1",
    name: "Sofía Vergara",
    email: "sofia.vergara@empresa.com",
    role: "Gerente de TI & GSIC",
    department: "Gerencia GSIC",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    initials: "SV",
  },
  {
    id: "user-2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@empresa.com",
    role: "Líder de Infraestructura Cloud",
    department: "Infraestructura",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    initials: "CM",
  },
  {
    id: "user-3",
    name: "Mariana Rivas",
    email: "mariana.rivas@empresa.com",
    role: "Líder de Ciberseguridad & SOC",
    department: "Ciberseguridad",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    initials: "MR",
  },
  {
    id: "user-4",
    name: "David Torres",
    email: "david.torres@empresa.com",
    role: "Líder de Arquitectura de TI",
    department: "Arquitectura",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    initials: "DT",
  },
  {
    id: "user-5",
    name: "Andrés Morales",
    email: "andres.morales@empresa.com",
    role: "Líder de Redes & Conectividad",
    department: "Redes",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    initials: "AM",
  },
  {
    id: "user-6",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@empresa.com",
    role: "Líder de Bases de Datos & DBA",
    department: "Bases de Datos",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    initials: "RS",
  },
];

export const initialOperationalItems: OperationalItem[] = [
  {
    id: "op-1",
    title: "Reunión de Alineación Semanal GSIC (Miércoles)",
    description: "Revisión ejecutiva de proyectos, bloqueadores críticos y compromisos con todos los líderes de unidad de TI.",
    type: "meeting",
    status: "scheduled",
    tag: "Reunión Teams",
    unit: "Gerencia GSIC",
    priority: "high",
    scheduledDate: "Próximo Miércoles, 10:00",
    time: "10:00 - 11:30",
    durationMinutes: 90,
    isDueSoon: true,
    attendees: [currentUser, teamMembers[1], teamMembers[2], teamMembers[3], teamMembers[4], teamMembers[5], teamMembers[6]],
    reminder: {
      hasEmailAlert: true,
      hasTeamsAlert: true,
      emailAlertTime: "Martes 09:00 (Resumen Pre-Reunión)",
      teamsAlertTime: "15m antes",
      isManualSent: false,
    },
    notes: "Presentar avances sin usar la hoja de cálculo. Cada unidad revisa sus puntos críticos antes del martes.",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/gsic-weekly-sync",
    createdAt: "2026-10-01T08:00:00Z",
  },
  {
    id: "op-2",
    title: "Bloqueador Crítico: Renovación Certificados SSL de Integración",
    description: "Vencimiento en 48h de los certificados de las pasarelas API Gateway que conectan el ERP.",
    type: "meeting",
    status: "scheduled",
    tag: "Reunión Teams",
    unit: "Integración",
    priority: "critical",
    scheduledDate: "Hoy, 15:30",
    time: "15:30 - 16:15",
    durationMinutes: 45,
    isDueSoon: true,
    attendees: [currentUser, teamMembers[2], teamMembers[3]],
    reminder: {
      hasEmailAlert: true,
      hasTeamsAlert: true,
      emailAlertTime: "2h antes",
      teamsAlertTime: "15m antes",
      isManualSent: true,
      lastManualSentDate: "11:20",
    },
    notes: "Reunión urgente derivada del correo del proveedor de PKI. Carlos Mendoza coordinará la instalación.",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/ssl-renewal-blocker",
    sourceEmailId: "em-1",
    createdAt: "2026-10-02T07:30:00Z",
  },
  {
    id: "op-3",
    title: "Comité de Seguridad: Aprobación DLP Policies en SharePoint",
    description: "Establecer directivas contra pérdida de datos sensibles y compartir externo en repositorios corporativos.",
    type: "review",
    status: "scheduled",
    tag: "Revisión Operativa",
    unit: "Ciberseguridad",
    priority: "medium",
    scheduledDate: "Mañana, 11:00",
    time: "11:00 - 12:00",
    durationMinutes: 60,
    attendees: [currentUser, teamMembers[3], teamMembers[4]],
    reminder: {
      hasEmailAlert: true,
      hasTeamsAlert: true,
      emailAlertTime: "24h antes",
      isManualSent: false,
    },
    notes: "Validar con Mariana Rivas el informe de alertas generadas en Purview el último mes.",
    teamsLink: "https://teams.microsoft.com/l/meetup-join/security-dlp-review",
    createdAt: "2026-10-01T14:20:00Z",
  },
  {
    id: "op-4",
    title: "Plan de Contingencia: Latencia Intermitente en Clúster de Base de Datos",
    description: "Definir ventana de mantenimiento nocturno para reindexación y balanceo de carga en SQL Server.",
    type: "meeting",
    status: "pending",
    tag: "Reunión Teams",
    unit: "Bases de Datos",
    priority: "high",
    scheduledDate: "Por agendar (Objetivo: Jueves)",
    durationMinutes: 45,
    attendees: [currentUser, teamMembers[6], teamMembers[2]],
    reminder: {
      hasEmailAlert: true,
      hasTeamsAlert: true,
      teamsAlertTime: "15m antes",
    },
    notes: "Coordinar con Roberto Sánchez para no afectar la operación de facturación de cierre de mes.",
    sourceEmailId: "em-4",
    createdAt: "2026-10-02T09:15:00Z",
  },
  {
    id: "op-5",
    title: "Revisión Arquitectura: Conectores y Microservicios de Facturación",
    description: "Revisión de especificaciones OpenAPI y autenticación OAuth 2.0 antes de despliegue en ambiente productivo.",
    type: "approval",
    status: "pending",
    tag: "Aprobación M365",
    unit: "Arquitectura",
    priority: "medium",
    scheduledDate: "Por agendar (Límite: Viernes)",
    attendees: [currentUser, teamMembers[4]],
    reminder: {
      hasEmailAlert: true,
      hasTeamsAlert: false,
    },
    notes: "Requerido antes de habilitar el pase a producción en Dataverse y Azure API Management.",
    createdAt: "2026-10-01T11:45:00Z",
  },
  {
    id: "op-6",
    title: "Auditoría de Enlaces WAN y Redundancia de Enlace Principal",
    description: "Pruebas de conmutación por fallo (failover) del enlace de fibra óptica principal al enlace satelital.",
    type: "meeting",
    status: "completed",
    tag: "Reunión Teams",
    unit: "Redes",
    priority: "medium",
    scheduledDate: "Ayer, 16:00",
    time: "16:00 - 17:00",
    durationMinutes: 60,
    attendees: [currentUser, teamMembers[5], teamMembers[2]],
    reminder: {
      hasEmailAlert: true,
      hasTeamsAlert: true,
      isManualSent: true,
    },
    notes: "Conmutación exitosa en 4.2 segundos sin pérdida de paquetes en VPN corporativa.",
    createdAt: "2026-09-30T10:00:00Z",
  },
];

export const initialEmails: EmailItem[] = [
  {
    id: "em-1",
    subject: "Urgente: Notificación de Vencimiento de Certificados SSL Wildcard (*.empresa.com)",
    sender: teamMembers[2], // Carlos Mendoza - Infraestructura
    recipients: ["alejandro.silva@empresa.com", "mariana.rivas@empresa.com"],
    receivedDate: "2026-10-02T08:15:00Z",
    status: "pending",
    unit: "Infraestructura",
    priority: "critical",
    snippet: "Estimado equipo, la autoridad certificadora DigiCert notificó que el certificado SSL wildcard expira este fin de semana...",
    body: `Estimado equipo de GSIC,

Les escribo con carácter de extrema urgencia. La autoridad certificadora nos acaba de enviar el aviso final: el certificado SSL Wildcard (*.empresa.com) que protege los servicios de la API Gateway y el portal de clientes vence este fin de semana.

Si no se renueva e instala antes del viernes a las 23:59:
1. Las llamadas entre el ERP SAP y las apps móviles comenzarán a rechazar conexiones por error HTTPS.
2. Los portales externos mostrarán pantalla roja de alerta de seguridad en navegadores.

Ya contamos con los nuevos archivos .crt y .key emitidos. Necesitamos agendar una sesión rápida de 30 minutos con Integración y Seguridad hoy mismo para coordinar la ventana de instalación en el clúster F5.

Quedo a la espera para coordinar la llamada por Teams.

Saludos cordiales,
Carlos Mendoza
Líder de Infraestructura Cloud | Gerencia GSIC`,
    hasAttachments: true,
    attachments: [
      { name: "Reporte_Vencimiento_Certificados_Oct2026.pdf", size: "1.2 MB", type: "pdf" },
      { name: "Guia_Instalacion_F5_BIGIP.docx", size: "450 KB", type: "word" },
    ],
    internalNotes: [
      {
        id: "nt-1",
        author: "Alejandro Silva",
        authorRole: "Coordinador de Integración",
        authorInitials: "AS",
        content: "Hablé con Mariana Rivas de Ciberseguridad. Dijo que podemos aplicar el cambio hoy a las 15:30 sin interrumpir usuarios.",
        createdAt: "Hace 1 hora",
      },
    ],
    relatedMeetingId: "op-2",
  },
  {
    id: "em-2",
    subject: "Alerta de Cumplimiento: Revisión de Accesos Huérfanos en M365 Groups y VPN",
    sender: teamMembers[3], // Mariana Rivas - Ciberseguridad
    recipients: ["alejandro.silva@empresa.com", "sofia.vergara@empresa.com"],
    receivedDate: "2026-10-02T07:45:00Z",
    status: "pending",
    unit: "Ciberseguridad",
    priority: "high",
    snippet: "Hola Alejandro, el escaneo quincenal de Purview detectó 14 grupos de Teams y cuentas VPN con propietarios inactivos...",
    body: `Hola Alejandro y equipo GSIC,

Les comparto los hallazgos del escaneo automatizado de seguridad y gobierno sobre cuentas y grupos de Microsoft 365 realizado anoche.

Se identificaron:
- 14 equipos de Microsoft Teams con propietarios dados de baja en Entra ID.
- 6 accesos VPN que no registran uso en más de 60 días pero continúan habilitados.

Por política de auditoría interna de la gerencia, debemos reasignar custodios en las próximas 48 horas antes de la reunión semanal de alineación del miércoles.

¿Podemos coordinar una sesión de 30 minutos para depurar estas cuentas?

Atentamente,
Mariana Rivas
Líder de Ciberseguridad & SOC`,
    hasAttachments: true,
    attachments: [
      { name: "Reporte_Cuentas_Huerfanas_Oct2026.csv", size: "45 KB", type: "csv" },
    ],
    internalNotes: [],
  },
  {
    id: "em-3",
    subject: "Kickoff de Arquitectura: Integración de Nueva Pasarela de Pagos",
    sender: teamMembers[4], // David Torres - Arquitectura
    recipients: ["alejandro.silva@empresa.com"],
    receivedDate: "2026-10-01T15:20:00Z",
    status: "pending",
    unit: "Arquitectura",
    priority: "high",
    snippet: "Buenos días equipo. Ya contamos con el visto bueno del proveedor para dar inicio formal a la integración del webhook de pagos...",
    body: `Buenos días equipo,

Con entusiasmo les comunico que la Gerencia General ha firmado el acta de constitución para la nueva pasarela de pagos electrónicos.

Propongo que coordinemos el Kickoff técnico esta semana. Los temas clave a cubrir son:
1. Definición del estándar de cifrado en reposo y en tránsito (mTLS).
2. Tiempos de respuesta y colas de reintento en caso de caída del banco.
3. Cronograma de despliegues y pruebas en ambiente Sandbox.

Por favor indíquenme su disponibilidad horaria para fijar la sesión por Teams.

Un saludo,
David Torres
Líder de Arquitectura de TI`,
    hasAttachments: false,
    internalNotes: [],
  },
  {
    id: "em-4",
    subject: "Alerta de Telemetría: Latencia en Consultas de Cierre Contable en SQL Server",
    sender: teamMembers[6], // Roberto Sanchez - DBA
    recipients: ["alejandro.silva@empresa.com", "carlos.mendoza@empresa.com"],
    receivedDate: "2026-10-01T11:30:00Z",
    status: "pending",
    unit: "Bases de Datos",
    priority: "high",
    snippet: "Equipo, el monitor de base de datos reportó picos de 94% de CPU en el nodo primario de SQL Server durante los reportes...",
    body: `Equipo,

El monitor de base de datos reportó picos continuos de 94% de CPU en el nodo primario de SQL Server durante la ejecución de los reportes contables del cierre mensual.

Detectamos 3 consultas de gran tamaño que requieren reconstrucción de índices o creación de vistas indexadas para evitar bloqueos en las tablas transaccionales.

Requiero coordinar una llamada de 45 minutos con Infraestructura para planificar la ventana de mantenimiento del jueves por la noche.

Saludos,
Roberto Sánchez
DBA / Bases de Datos GSIC`,
    hasAttachments: false,
    internalNotes: [],
    relatedMeetingId: "op-4",
  },
  {
    id: "em-5",
    subject: "Confirmación de Mantenimiento Preventivo de Enlaces WAN y Telefonía IP",
    sender: teamMembers[5], // Andres Morales - Redes
    recipients: ["alejandro.silva@empresa.com", "sofia.vergara@empresa.com"],
    receivedDate: "2026-09-30T16:00:00Z",
    status: "responded",
    unit: "Redes",
    priority: "medium",
    snippet: "Informo que el mantenimiento programado con el carrier de telecomunicaciones culminó satisfactoriamente...",
    body: `Estimada Gerencia GSIC,

Les informo que las pruebas de redundancia y mantenimiento preventivo ejecutadas ayer con el proveedor de fibra óptica concluyeron sin anomalías.

Se verificó el correcto funcionamiento de los troncales SIP para Teams Phone y no se registraron cortes en el acceso a la sede central.

El informe técnico final quedó depositado en la biblioteca documental de SharePoint.

Atentamente,
Andrés Morales
Líder de Redes & Conectividad`,
    hasAttachments: true,
    attachments: [
      { name: "Acta_Mantenimiento_Redes_Final.pdf", size: "850 KB", type: "pdf" },
    ],
    internalNotes: [],
  },
];
