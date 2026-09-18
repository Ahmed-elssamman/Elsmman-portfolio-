"use client";

import { useEffect, useRef, useState } from "react";
import type { Nav } from "@/lib/data-schemas";
import { NAVIGATION, THEME_STORAGE_KEY } from "./portfolio.control";
import { ColorTheme, IconName } from "./portfolio.enum";
import { PortfolioIcon } from "./portfolio-icon";

interface SiteHeaderProps {
  home?: boolean;
  links?: Nav;
}

export function SiteHeader({ home = true, links = NAVIGATION }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(ColorTheme.Light);
  const [activeSection, setActiveSection] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const homePrefix = home ? "" : "/";
  const themeLabel = theme === ColorTheme.Light ? "Switch to dark theme" : "Switch to light theme";
  const themeIcon = theme === ColorTheme.Light ? IconName.Moon : IconName.Sun;
  const menuLabel = menuOpen ? "Close navigation" : "Open navigation";
  const menuIcon = menuOpen ? IconName.Close : IconName.Menu;

  useEffect(() => {
    const savedTheme = document.documentElement.dataset.theme;
    if (savedTheme === ColorTheme.Dark) setTheme(ColorTheme.Dark);
  }, []);

  useEffect(() => {
    if (!home) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }
    }, { rootMargin: "-15% 0px -65% 0px" });

    for (const link of links) {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [home, links]);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    }
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function closeOnResize() {
      if (window.innerWidth >= 768) setMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOutside);
    window.addEventListener("resize", closeOnResize);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [menuOpen]);

  function toggleTheme() {
    const nextTheme = theme === ColorTheme.Light ? ColorTheme.Dark : ColorTheme.Light;
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still works when browser storage is unavailable.
    }
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header" ref={header}>
      <div className="page-width header-inner">
        <a className="brand" href={home ? "#top" : "/"} aria-label="Ahmed ElSamman Frontend Engineer, home">
          <span className="brand-mark" aria-hidden="true">ae<span>.</span></span>
          <span className="brand-name">Ahmed ElSamman<span>Frontend Engineer</span></span>
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.id} href={`${homePrefix}#${link.id}`} className="nav-link" aria-current={activeSection === link.id ? "location" : false}>{link.label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}><PortfolioIcon name={themeIcon} /></button>
          <a className="header-contact" href={`${homePrefix}#contact`}>Let’s talk <PortfolioIcon name={IconName.ArrowUpRight} /></a>
          <button className="icon-button menu-button" type="button" ref={menuButton} onClick={toggleMenu} aria-label={menuLabel} aria-expanded={menuOpen} aria-controls="mobile-navigation"><PortfolioIcon name={menuIcon} /></button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-navigation page-width" aria-label="Mobile navigation" hidden={!menuOpen}>
        {links.map((link) => (
          <a key={link.id} href={`${homePrefix}#${link.id}`} onClick={closeMenu}>{link.label}<PortfolioIcon name={IconName.ArrowUpRight} /></a>
        ))}
      </nav>
    </header>
  );
}
