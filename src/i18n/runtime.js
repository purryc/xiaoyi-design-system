import React, { createContext, useContext, useEffect, useState } from "react";
import catalog from "./en.json" with { type: "json" };
const LanguageContext = createContext({
  language: "zh",
  setLanguage: () => {},
});
const normalize = (s) => s.replace(/\s+/g, " ").trim();
const keys = Object.keys(catalog).sort((a, b) => b.length - a.length);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const fragments = new RegExp(keys.map(escape).join("|"), "g");
export function english(value) {
  if (typeof value !== "string") return value;
  if (
    /^(\.\.?\/|https?:\/\/)/.test(value) ||
    /\.(?:png|jpe?g|mov|mp4|webp)$/.test(value)
  )
    return value;
  const normalized = normalize(value);
  if (catalog[normalized]) return catalog[normalized];
  // Dynamic labels reuse literal fragments; one pass avoids translating replacements.
  return value.replace(fragments, (match) => catalog[match]);
}
export function useLanguage() {
  return useContext(LanguageContext);
}
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const query = new URLSearchParams(location.search).get("lang");
    if (query === "en" || query === "zh") return query;
    try {
      return localStorage.getItem("xiaoyi-language") === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  });
  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-CN";
    document.title =
      language === "en"
        ? "Xiaoyi Design System"
        : "小艺设计系统 · Xiaoyi Design System";
    try {
      localStorage.setItem("xiaoyi-language", language);
    } catch {}
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url);
  }, [language]);
  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage } },
    children,
  );
}
export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return React.createElement(
    "div",
    {
      className: "language-switch",
      role: "group",
      "aria-label": "语言 / Language",
    },
    ...[
      ["zh", "中文"],
      ["en", "English"],
    ].map(([id, label]) =>
      React.createElement(
        "button",
        {
          key: id,
          lang: id,
          "aria-pressed": language === id,
          onClick: () => setLanguage(id),
        },
        label,
      ),
    ),
  );
}
// Translate only presentation, never state keys, option values, URLs or event data.
// This boundary is compiled by the JSX runtime; it does not mutate the DOM.
export function LocalizedElement({ element, ...props }) {
  const { language } = useLanguage();
  const out = { ...props };
  if (
    element === "option" &&
    props.value === undefined &&
    typeof props.children === "string"
  )
    out.value = props.children;
  if (language === "en" && props.translate !== "no") {
    const children = (v) =>
      typeof v === "string"
        ? english(v)
        : Array.isArray(v)
          ? v.map(children)
          : v;
    out.children = children(props.children);
    for (const key of [
      "aria-label",
      "aria-description",
      "aria-valuetext",
      "title",
      "placeholder",
      "alt",
    ])
      if (typeof props[key] === "string") out[key] = english(props[key]);
  }
  return React.createElement(element, out);
}
