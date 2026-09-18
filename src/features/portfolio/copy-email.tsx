"use client";

import { useEffect, useRef, useState } from "react";
import { CopyState, IconName } from "./portfolio.enum";
import { PortfolioIcon } from "./portfolio-icon";

interface CopyEmailProps {
  email: string;
}

export function CopyEmail({ email }: CopyEmailProps) {
  const [state, setState] = useState(CopyState.Idle);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copied = state === CopyState.Copied;
  const icon = copied ? IconName.Check : IconName.Copy;
  const label = copied ? "Email copied" : "Copy email";
  const status = state === CopyState.Failed ? "Couldn’t copy. You can select the email address or use the email link." : copied ? "Email address copied to clipboard." : "";

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  async function copyEmail() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(email);
      setState(CopyState.Copied);
      resetTimer.current = setTimeout(() => setState(CopyState.Idle), 3500);
    } catch {
      setState(CopyState.Failed);
    }
  }

  return (
    <div className="copy-email">
      <button type="button" className="text-link copy-button" onClick={copyEmail}><PortfolioIcon name={icon} />{label}</button>
      <span className="copy-status" role="status">{status}</span>
    </div>
  );
}
