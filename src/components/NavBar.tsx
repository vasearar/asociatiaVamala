import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const links = [
  { to: "/", key: "home" },
  { to: "/news", key: "news" },
  { to: "/documents", key: "documents" },
  { to: "/members", key: "members" },
  { to: "/forum&workshop", key: "forumWorkshop" },
  { to: "/contact", key: "contact" },
];

export function NavBar() {
  const { t } = useTranslation(undefined, { keyPrefix: "navbar" });
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onResize = () => { if (window.innerWidth >= 1200) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", onResize);
      previousFocus?.focus();
    };
  }, [isOpen]);

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Radix owns keyboard interaction while its language popup is open.
    if (document.querySelector('[role="listbox"]')) return;
    if (event.key === "Escape") { event.preventDefault(); setIsOpen(false); }
    if (event.key !== "Tab") return;
    const focusable = Array.from(menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex="0"]',
    ) ?? []).filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  };

  const brand = <><img src="/Logo.svg" width={42} height={42} alt="" /><span className="site-brand-copy"><span>{t("logoHeader")}</span><small>{t("logoSubHeader")}</small></span></>;
  return (
    <>
      <nav className="site-navbar" aria-label={t("navigation")}>
        <div className="site-navbar-inner">
          <NavLink to="/" className="site-brand" aria-label={t("logoHeader")}>{brand}</NavLink>
          <ul className="site-desktop-links">
            {links.map((link) => <li key={link.key}><NavLink to={link.to}
              className={({ isActive }) => `site-nav-link${isActive ? " site-nav-link--active" : ""}`}>
              {t(link.key)}
            </NavLink></li>)}
          </ul>
          <div className="site-desktop-actions"><LanguageSwitcher /><a href="mailto:contact@anv.md" className="site-email-link">contact@anv.md</a></div>
          <button type="button" className="site-menu-toggle" aria-label={t("openMenu")}
            aria-expanded={isOpen} aria-controls="mobile-menu" onClick={() => setIsOpen(true)}>
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </nav>
      {isOpen && (
        <div id="mobile-menu" className="site-mobile-menu" role="dialog" aria-modal="true"
          aria-label={t("navigation")} ref={menuRef} onKeyDown={onMenuKeyDown}>
          <div className="site-mobile-menu-header">
            <NavLink to="/" className="site-brand" onClick={() => setIsOpen(false)}>{brand}</NavLink>
            <button type="button" className="site-menu-close" aria-label={t("closeMenu")} ref={closeRef} onClick={() => setIsOpen(false)}><X size={24} aria-hidden="true" /></button>
          </div>
          <div className="site-mobile-menu-body">
            <nav aria-label={t("navigation")}>
              <ul>{links.map((link) => <li key={link.key}><NavLink to={link.to} onClick={() => setIsOpen(false)}
                className={({ isActive }) => `site-nav-link${isActive ? " site-nav-link--active" : ""}`}>{t(link.key)}</NavLink></li>)}</ul>
            </nav>
            <div className="site-mobile-actions"><LanguageSwitcher /><a href="mailto:contact@anv.md" className="site-email-link" onClick={() => setIsOpen(false)}>contact@anv.md</a></div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
