"use client";

import type { GeneratedApp } from "@/lib/generate-app";
import type { ScreenResult } from "@/lib/screen";
import { loadBuilds, loadScreenings, saveBuild, saveScreening } from "@/lib/workspace";
import { useCallback, useEffect, useState } from "react";

export function useScreenings() {
  const [items, setItems] = useState<ScreenResult[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadScreenings());
    setReady(true);
  }, []);

  const add = useCallback((record: ScreenResult) => {
    setItems(saveScreening(record));
  }, []);

  return { items, ready, add };
}

export function useBuilds() {
  const [items, setItems] = useState<GeneratedApp[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadBuilds());
    setReady(true);
  }, []);

  const add = useCallback((record: GeneratedApp) => {
    setItems(saveBuild(record));
  }, []);

  return { items, ready, add };
}
