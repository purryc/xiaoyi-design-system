import React from "react";
import { iconByName } from "./icon-data";
export const icons = iconByName;
export function Icon({ name, size = 20, strokeWidth = 1.65, ...props }) {
  const icon = iconByName[name];
  if (!icon) throw new Error(`Unknown Xiaoyi icon: ${name}`);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-icon={icon.id}
      {...props}
    >
      {icon.nodes.map(([tag, attrs], i) =>
        React.createElement(tag, { ...attrs, key: i }),
      )}
    </svg>
  );
}
