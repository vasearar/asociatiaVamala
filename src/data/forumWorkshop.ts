export type SessionKind =
  | "registration" | "opening" | "speeches" | "break" | "lunch"
  | "keynote" | "demo" | "panel" | "closing" | "reception"
  | "session" | "workshop" | "exercise" | "dinner";

export type AgendaSession = {
  id: string;
  start: string;
  end?: string;
  kind: SessionKind;
};

export type Agenda = {
  id: string;
  date?: string;
  pdf?: string;
  sessions: AgendaSession[];
};

export type SessionContent = {
  title: string;
  description?: string;
  speakers?: string[];
};

// Timing and stable IDs are shared by all three translations. An agenda without
// a date is announced but unpublished; complete it here when its programme arrives.
export const agendas: Agenda[] = [
  {
    id: "forum",
    date: "2026-11-17",
    pdf: "/forum-workshop/agendas/forum-17-november-2026-en.pdf",
    sessions: [
      { id: "registration", start: "09:00", end: "10:00", kind: "registration" },
      { id: "opening", start: "10:00", end: "10:40", kind: "opening" },
      { id: "welcome", start: "10:40", end: "11:40", kind: "speeches" },
      { id: "coffee", start: "11:40", end: "12:00", kind: "break" },
      { id: "trade", start: "12:00", end: "13:30", kind: "speeches" },
      { id: "lunch", start: "13:30", end: "14:30", kind: "lunch" },
      { id: "keynote", start: "14:30", end: "14:45", kind: "keynote" },
      { id: "hub", start: "14:45", end: "15:15", kind: "demo" },
      { id: "business", start: "15:15", end: "16:00", kind: "panel" },
      { id: "closing", start: "16:00", end: "16:15", kind: "closing" },
      { id: "reception", start: "18:00", kind: "reception" },
    ],
  },
  {
    id: "workshop",
    date: "2026-11-18",
    pdf: "/forum-workshop/agendas/workshop-18-november-2026-en.pdf",
    sessions: [
      { id: "registration", start: "09:00", end: "10:00", kind: "registration" },
      { id: "opening", start: "10:00", end: "10:30", kind: "opening" },
      { id: "digitalization", start: "10:30", end: "11:00", kind: "session" },
      { id: "coffee", start: "11:00", end: "11:20", kind: "break" },
      { id: "journey", start: "11:20", end: "11:50", kind: "workshop" },
      { id: "simulation", start: "11:50", end: "12:20", kind: "exercise" },
      { id: "closing", start: "12:20", end: "13:00", kind: "closing" },
      { id: "lunch", start: "13:00", end: "14:00", kind: "lunch" },
      { id: "dinner", start: "16:00", kind: "dinner" },
    ],
  },
  { id: "upcoming", sessions: [] },
];

export const eventPartners = [
  { id: "anv", name: "National Customs Association of the Republic of Moldova" },
  { id: "german-cooperation", name: "German Cooperation — Deutsche Zusammenarbeit" },
  { id: "giz", name: "GIZ — Deutsche Gesellschaft für Internationale Zusammenarbeit" },
  { id: "dt4sme", name: "DT4SME — EaP Countries" },
  { id: "eastnt", name: "EasTnT — Eastern Partnership for Trade and Transport" },
  { id: "mctac", name: "Middle Corridor Transit Advisory Committee" },
];
