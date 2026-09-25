import { jsx as base, jsxs as bases, Fragment } from "react/jsx-runtime";
import { LocalizedElement } from "./runtime";
const render = (fn, type, props, key) =>
  typeof type === "string"
    ? fn(LocalizedElement, { ...props, element: type }, key)
    : fn(type, props, key);
export const jsx = (type, props, key) => render(base, type, props, key);
export const jsxs = (type, props, key) => render(bases, type, props, key);
export { Fragment };
