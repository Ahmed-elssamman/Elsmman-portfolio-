"use client";

import { useEffect, useState } from "react";
import type { ResourceName, SiteData } from "@/lib/data-schemas";
import { saveResource } from "../_components/FormBits";
import { EditorStatus } from "./editor.enum";

export function useResourceSave<K extends ResourceName>(
  resource: K,
  value: SiteData[K],
) {
  const [savedValue, setSavedValue] = useState(value);
  const [status, setStatus] = useState(EditorStatus.Idle);
  const [error, setError] = useState("");
  const dirty = JSON.stringify(savedValue) !== JSON.stringify(value);

  useEffect(() => {
    if (!dirty) return;
    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  async function save() {
    if (status === EditorStatus.Saving) return;
    setStatus(EditorStatus.Saving);
    setError("");
    const snapshot = value;
    const result = await saveResource(resource, snapshot);
    if (result.ok) {
      setSavedValue(snapshot);
      setStatus(EditorStatus.Saved);
    } else {
      setStatus(EditorStatus.Error);
      setError(result.error || "Changes could not be saved. Please try again.");
    }
  }

  return {
    dirty,
    error,
    save,
    status: status === EditorStatus.Saved && dirty ? EditorStatus.Idle : status,
    saving: status === EditorStatus.Saving,
  };
}
