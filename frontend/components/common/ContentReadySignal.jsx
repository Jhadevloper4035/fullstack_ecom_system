"use client";
import { useEffect } from "react";

export default function ContentReadySignal() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("content-ready"));
      }
    } catch {}
  }, []);
  return null;
}
