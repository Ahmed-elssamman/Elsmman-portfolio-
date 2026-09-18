import Link from "next/link";
import { SiteHeader } from "@/features/portfolio/site-header";
import { PortfolioIcon } from "@/features/portfolio/portfolio-icon";
import { IconName } from "@/features/portfolio/portfolio.enum";

export default function NotFound() {
  return <div className="portfolio"><SiteHeader home={false} /><main className="not-found page-width"><p className="eyebrow">404 / A small detour</p><h1>This page<br />isn’t here.</h1><p>The link may have changed. You can find my selected work, experience, and contact details on the homepage.</p><Link className="button button-primary" href="/">Back to the portfolio <PortfolioIcon name={IconName.ArrowRight} /></Link></main></div>;
}
