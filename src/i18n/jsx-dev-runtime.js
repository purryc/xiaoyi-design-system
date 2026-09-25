import { jsxDEV as base, Fragment } from "react/jsx-dev-runtime";
import { LocalizedElement } from "./runtime";
export const jsxDEV = (type, props, key, ...rest) =>
  typeof type === "string"
    ? base(LocalizedElement, { ...props, element: type }, key, ...rest)
    : base(type, props, key, ...rest);
export { Fragment };
