import React, { createContext, useContext, useEffect, useState } from "react";
import { useLanguage } from "../i18n/runtime";
import copy from "./copy.json";
export function useV7Copy() {
  const { language } = useLanguage();
  return (key) => copy[key]?.[language === "en" ? 1 : 0] ?? key;
}
const key = Symbol.for("xiaoyi.design-system.design-context");
const Context = (globalThis[key] ??= createContext({
  design: "v7",
  setDesign: () => {},
}));
export function DesignProvider({ children }) {
  const [design, setDesign] = useState(() => {
    const query = new URLSearchParams(location.search).get("design");
    if (["v7", "legacy"].includes(query)) return query;
    try {
      return localStorage.getItem("xiaoyi-design") === "legacy"
        ? "legacy"
        : "v7";
    } catch {
      return "v7";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("xiaoyi-design", design);
    } catch {}
    const url = new URL(location.href);
    url.searchParams.set("design", design);
    history.replaceState(null, "", url);
    document.documentElement.dataset.design = design;
  }, [design]);
  return (
    <Context.Provider value={{ design, setDesign }}>
      {children}
    </Context.Provider>
  );
}
export const useDesign = () => useContext(Context);
export function DesignSwitch() {
  const { design, setDesign } = useDesign(),
    t = useV7Copy();
  return (
    <select
      className="xy-version-select"
      aria-label={t("version")}
      value={design}
      onChange={(e) => setDesign(e.target.value)}
    >
      <option value="v7">{t("v7")}</option>
      <option value="legacy">{t("legacy")}</option>
    </select>
  );
}
