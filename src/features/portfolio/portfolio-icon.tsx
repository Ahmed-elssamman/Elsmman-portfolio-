import { ICON_PATHS } from "./portfolio.control";
import { IconName } from "./portfolio.enum";

interface PortfolioIconProps {
  name: IconName;
  className?: string;
}

export function PortfolioIcon({ name, className = "" }: PortfolioIconProps) {
  const paths = ICON_PATHS[name];

  return (
    <svg className={`portfolio-icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths.map((path) => <path key={path} d={path} />)}
    </svg>
  );
}
