// src/lib/useTodayHabits.js
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "habitflow_today_state";

function getTodayKey() {
  // yyyy-mm-dd
  return new Date().toISOString().slice(0, 10);
}

export function useTodayHabits() {
  const [todayKey] = useState(getTodayKey);
  const [state, setState] = useState({}); // { [habitId]: true }

  // carregar do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setState(parsed[todayKey] || {});
    } catch {
      // ignora erro
    }
  }, [todayKey]);

  // salvar no localStorage quando mudar
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[todayKey] = state;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignora erro
    }
  }, [state, todayKey]);

  function toggleToday(id) {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function isDone(id) {
    return !!state[id];
  }

  const doneCount = Object.values(state).filter(Boolean).length;

  return { todayKey, isDone, toggleToday, doneCount };
}
