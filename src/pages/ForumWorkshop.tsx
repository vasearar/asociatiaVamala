import { useEffect, useId, useState } from "react";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3,
  Coffee, Download, Globe2, MapPin, MessagesSquare, Presentation,
  Sparkles, UsersRound, Utensils, Hourglass,
} from "lucide-react";
import { agendas, eventPartners } from "../data/forumWorkshop";
import type { AgendaSession, SessionContent } from "../data/forumWorkshop";
import { hasEventDatePassed } from "../utils/eventDates";
import "./ForumWorkshop.css";

const sessionIcons = {
  registration: Coffee, opening: Presentation, speeches: MessagesSquare,
  break: Coffee, lunch: Utensils, keynote: Sparkles, demo: Presentation,
  panel: UsersRound, closing: Check, reception: UsersRound,
  session: Presentation, workshop: MessagesSquare, exercise: Presentation,
  dinner: Utensils,
};

const venueMapUrl = "https://maps.app.goo.gl/B2y6H3RySux7VZD18";

function scrollToProgramme(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  document.getElementById("event-agendas")?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });
  const url = new URL(window.location.href);
  url.hash = "event-agendas";
  window.history.replaceState(window.history.state, "", url);
}

function AgendaItem({ agendaId, date, session }: {
  agendaId: string;
  date: string;
  session: AgendaSession;
}) {
  const { t } = useTranslation(undefined, { keyPrefix: "forumWorkshop" });
  const titleId = useId();
  const detailsId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const content = t(`sessions.${agendaId}.${session.id}`, {
    returnObjects: true,
  }) as SessionContent;
  const Icon = sessionIcons[session.kind];
  const isBreak = ["break", "lunch"].includes(session.kind);
  const hasDetails = Boolean(content.description || content.speakers?.length);

  return (
    <li className={`forum-slot${isBreak ? " forum-slot--break" : ""}`}>
      <div className="forum-time">
        <time dateTime={`${date}T${session.start}`}>{session.start}</time>
        {session.end && <><span aria-hidden="true">–</span><time dateTime={`${date}T${session.end}`}>{session.end}</time></>}
      </div>
      <article className="forum-session" aria-labelledby={titleId}>
        <div className="forum-session-kind"><Icon size={15} aria-hidden="true" />{t(`kinds.${session.kind}`)}</div>
        <h3 id={titleId}>{content.title}</h3>
        {hasDetails && (
          <div className="forum-session-details" data-open={isOpen}>
            <button className="forum-details-toggle" type="button" aria-expanded={isOpen}
              aria-controls={detailsId} onClick={() => setIsOpen((open) => !open)}>
              <span>{t("details")}</span><ChevronDown size={15} aria-hidden="true" />
            </button>
            <div className="forum-details-reveal" id={detailsId} aria-hidden={!isOpen} inert={!isOpen}>
              <div className="forum-details-clip"><div className="forum-session-body">
              {content.description && <p>{content.description}</p>}
              {content.speakers && (
                <ul aria-label={t("speakers")}>
                  {content.speakers.map((speaker) => <li key={speaker}>{speaker}</li>)}
                </ul>
              )}
              </div></div>
            </div>
          </div>
        )}
      </article>
    </li>
  );
}

export default function ForumWorkshop() {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: "forumWorkshop" });
  const [selectedId, setSelectedId] = useState(agendas[0].id);
  const [now, setNow] = useState(() => new Date());
  const selected = agendas.find((agenda) => agenda.id === selectedId) ?? agendas[0];
  const locale = i18n.resolvedLanguage ?? "ro";
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    document.title = `${t("eventName")} | ANV`;
    document.documentElement.lang = locale;
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
    };
  }, [locale, t]);
  const formatDate = (date: string, year = false) => new Intl.DateTimeFormat(locale, {
    day: "numeric", month: "long", ...(year ? { year: "numeric" } : {}),
    timeZone: "Europe/Chisinau",
  }).format(new Date(`${date}T12:00:00Z`));

  return (
    <div className="forum-page">
      <section className="forum-hero" aria-labelledby="forum-title">
        <div className="forum-wrap forum-hero-layout">
          <div className="forum-hero-copy">
            <p className="forum-eyebrow">{t("eyebrow")}</p>
            <h1 id="forum-title">{t("title")}<span>{t("titleAccent")}</span></h1>
            <p className="forum-intro">{t("intro")}</p>
            <div className="forum-hero-meta">
              <span><CalendarDays size={17} aria-hidden="true" />{t("dates")}</span>
              <span><MapPin size={17} aria-hidden="true" /><span><a className="forum-venue-link" href={venueMapUrl} target="_blank" rel="noopener noreferrer">{t("venue")}</a>, {t("city")}</span></span>
            </div>
            <a className="forum-hero-link" href="#event-agendas" onClick={scrollToProgramme}>{t("viewProgramme")}<ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <div className="forum-date-stamp" aria-hidden="true">
            <span className="forum-stamp-line">{t("eventName")}</span>
            <span className="forum-stamp-days">17<span>—</span>18</span>
            <span className="forum-stamp-month">{t("monthYear")}</span>
            <span className="forum-stamp-city">{t("city")}</span>
          </div>
        </div>
      </section>

      <section className="forum-partners" aria-label={t("partners")}>
        <div className="forum-wrap">
          <h2 className="forum-partners-label">{t("partners")}</h2>
          <ul className="forum-partner-list">
            {eventPartners.map((partner) => (
              <li key={partner.id} className={`forum-partner forum-partner--${partner.id}`}>
                <img src={`/forum-workshop/logos/${partner.id}.png`} alt={partner.name} width={160} height={72} decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="forum-wrap forum-agendas" id="event-agendas">
        <div className="forum-selector-label"><span className="forum-eyebrow">{t("chooseAgenda")}</span><span className="forum-year">2026</span></div>
        <div className="forum-agenda-selector" role="group" aria-label={t("chooseAgenda")}>
          {agendas.map((agenda, index) => {
            const isSelected = agenda.id === selectedId;
            return (
              <button type="button" key={agenda.id} aria-pressed={isSelected}
                aria-controls="forum-agenda-content"
                className={`forum-agenda-button${!agenda.date ? " forum-agenda-button--upcoming" : ""}`}
                onClick={() => setSelectedId(agenda.id)}>
                <span className="forum-agenda-number" aria-hidden="true">0{index + 1}</span>
                <span className="forum-agenda-button-copy">
                  <span className="forum-agenda-date">{agenda.date ? formatDate(agenda.date) : t("comingSoon")}</span>
                  <span className="forum-agenda-name">{t(agenda.id)}</span>
                  {hasEventDatePassed(agenda.date, now) && <span className="forum-past-label"><span>{t("eventPast")}</span></span>}
                </span>
                {agenda.date ? <ArrowUpRight size={21} aria-hidden="true" /> : <Hourglass size={20} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        <p className="sr-only" role="status">{t(selected.id)}{selected.date ? `, ${formatDate(selected.date, true)}` : `, ${t("comingSoon")}`}</p>

        <div className={`forum-content-layout${!selected.date ? " forum-content-layout--upcoming" : ""}`} id="forum-agenda-content">
          {selected.date && (
            <aside className="forum-practical" aria-labelledby="forum-practical-title">
              <h2 id="forum-practical-title">{t("practicalInfo")}</h2>
              <dl>
                <div><dt><CalendarDays size={17} aria-hidden="true" />{t("dateLabel")}</dt><dd>{formatDate(selected.date, true)}<br /><span className="forum-start-time">{selected.sessions[0]?.start}</span><p className="forum-local-time">{t("localTime")}</p></dd></div>
                <div><dt><MapPin size={17} aria-hidden="true" />{t("locationLabel")}</dt><dd><a className="forum-venue-link" href={venueMapUrl} target="_blank" rel="noopener noreferrer"><strong>{t("venue")}</strong><ArrowUpRight size={13} aria-hidden="true" /></a><br />{t("address")}</dd></div>
                <div><dt><Globe2 size={17} aria-hidden="true" />{t("languageLabel")}</dt><dd>{t(`${selected.id}Languages`)}</dd></div>
                <div><dt><UsersRound size={17} aria-hidden="true" />{t("audienceLabel")}</dt><dd>{t(`${selected.id}Audience`)}</dd></div>
              </dl>
            </aside>
          )}
          <section className="forum-programme" aria-labelledby="forum-programme-title" key={selected.id}>
            <div className="forum-programme-heading">
              <div><p className="forum-eyebrow">{t("programme")}</p><h2 id="forum-programme-title">{t(selected.id)}</h2>
                {selected.date && <p className="forum-programme-date"><Clock3 size={15} aria-hidden="true" />{t("sessionsCount", { count: selected.sessions.length })}<span aria-hidden="true">·</span>{formatDate(selected.date, true)}</p>}
                {hasEventDatePassed(selected.date, now) && <p className="forum-past-label forum-programme-past" role="status"><span>{t("eventPast")}</span></p>}
              </div>
              {selected.pdf && <a className="forum-download" href={selected.pdf} download><Download size={18} aria-hidden="true" /><span>{t("download")}<small>{t("originalPdf")}</small></span></a>}
            </div>
            {selected.date ? (
              <ol className="forum-timeline">
                {selected.sessions.map((session) => <AgendaItem key={session.id} agendaId={selected.id} date={selected.date!} session={session} />)}
              </ol>
            ) : (
              <div className="forum-empty">
                <span className="forum-empty-icon"><Hourglass size={28} aria-hidden="true" /></span>
                <h3>{t("comingSoon")}</h3><p>{t("comingSoonText")}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
