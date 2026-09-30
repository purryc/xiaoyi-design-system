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
export const normalizeDesign = (value) =>
  value === "legacy" || value === "v6" ? "v6" : value === "v7" ? "v7" : null;
export function DesignProvider({ children }) {
  const [design, updateDesign] = useState(() => {
    const query = new URLSearchParams(location.search).get("design");
    if (normalizeDesign(query)) return normalizeDesign(query);
    try {
      return normalizeDesign(localStorage.getItem("xiaoyi-design")) || "v7";
    } catch {
      return "v7";
    }
  });
  function setDesign(value) {
    const next = normalizeDesign(value);
    if (!next || next === design) return;
    const url = new URL(location.href);
    url.searchParams.delete("reference");
    history.replaceState(null, "", url);
    updateDesign(next);
  }
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
      <option value="v6">{t("v6")}</option>
      <option value="v7">{t("v7")}</option>
    </select>
  );
}
