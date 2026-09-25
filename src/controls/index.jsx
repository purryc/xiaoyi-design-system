import React, { useEffect, useId, useRef } from "react";
import { Icon } from "../icons/Icon";
import "./controls.css";

/** Content and actions stay separate: an article never nests a button inside a button. */
export function Card({
  title,
  eyebrow,
  description,
  icon,
  children,
  footer,
  variant = "surface",
  selected = false,
  className = "",
}) {
  return (
    <article
      className={`xy-card xy-card-${variant} ${selected ? "is-selected" : ""} ${className}`}
    >
      <header>
        {icon && (
          <span className="xy-card-icon">
            <Icon name={icon} size={22} />
          </span>
        )}
        <div>
          {eyebrow && <small>{eyebrow}</small>}
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </header>
      {children && <div className="xy-card-content">{children}</div>}
      {footer && <footer>{footer}</footer>}
    </article>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "%",
  variant = "outset",
  disabled = false,
  showSteps = false,
  showTips = true,
  formatValue,
}) {
  const id = useId();
  const lo = Number.isFinite(min) ? min : 0,
    hi = Number.isFinite(max) && max > lo ? max : lo + 100;
  const amount = Math.max(
      lo,
      Math.min(hi, Number.isFinite(value) ? value : lo),
    ),
    pct = ((amount - lo) / (hi - lo)) * 100;
  const increment =
    Number.isFinite(step) && step > 0 ? Math.min(step, hi - lo) : 1;
  const labelValue = formatValue ? formatValue(amount) : `${amount}${unit}`;
  const tickCount = Math.min(20, Math.floor((hi - lo) / increment));
  return (
    <div
      className={`xy-slider ${variant} ${disabled ? "is-disabled" : ""}`}
      style={{ "--slider-value": `${pct}%` }}
    >
      <div className="xy-control-label">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{labelValue}</output>
      </div>
      <div className="xy-slider-track">
        <input
          id={id}
          type="range"
          value={amount}
          min={lo}
          max={hi}
          step={increment}
          disabled={disabled}
          aria-valuetext={labelValue}
          onChange={(e) => onChange?.(Number(e.target.value))}
        />
        {showSteps && (
          <div className="xy-slider-ticks" aria-hidden="true">
            {Array.from({ length: tickCount + 1 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        )}
        {showTips && (
          <span className="xy-slider-tip" aria-hidden="true">
            {labelValue}
          </span>
        )}
      </div>
      <div className="xy-slider-limits" aria-hidden="true">
        <span>{formatValue ? formatValue(lo) : `${lo}${unit}`}</span>
        <span>{formatValue ? formatValue(hi) : `${hi}${unit}`}</span>
      </div>
    </div>
  );
}

export function ActionChip({
  children,
  icon,
  selected,
  onClick,
  onClose,
  disabled = false,
  closeLabel,
  size = "normal",
}) {
  return (
    <span
      className={`xy-action-chip ${selected ? "is-selected" : ""} ${size} ${disabled ? "is-disabled" : ""}`}
    >
      <button
        type="button"
        disabled={disabled}
        aria-pressed={typeof selected === "boolean" ? selected : undefined}
        onClick={onClick}
      >
        {icon && <Icon name={icon} size={16} />}
        <span>{children}</span>
      </button>
      {onClose && (
        <button
          type="button"
          className="xy-chip-close"
          aria-label={
            closeLabel ||
            `移除${typeof children === "string" ? children : "选项"}`
          }
          disabled={disabled}
          onClick={onClose}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </span>
  );
}
export function BottomChips({
  items,
  selected,
  onSelect,
  disabled = false,
  label = "小艺建议",
}) {
  return (
    <div
      className="xy-bottom-chips"
      role="group"
      aria-label={label}
      onFocusCapture={(e) =>
        e.target.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "instant",
        })
      }
    >
      {items.map((item) => (
        <ActionChip
          key={item.id}
          icon={item.icon}
          disabled={disabled || item.disabled}
          selected={selected === undefined ? undefined : selected === item.id}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
        </ActionChip>
      ))}
    </div>
  );
}

/** One current toast; replacement cancels the old timer. No scrim or focus capture. */
export function Toast({
  toast,
  onDismiss,
  bottom = 80,
  variant = "light",
  position = "contained",
}) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  useEffect(() => {
    if (!toast) return;
    const duration = Math.max(
      1500,
      Math.min(10000, Number(toast.duration) || 1500),
    );
    const timer = setTimeout(() => dismissRef.current?.(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast?.id, toast?.duration]);
  return (
    <div
      className={`xy-toast-anchor ${position}`}
      style={{ "--toast-bottom": `${bottom}px` }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toast && (
        <div key={toast.id} className={`xy-toast ${variant}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
export function Switch({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <label className={`xy-setting-row ${disabled ? "is-disabled" : ""}`}>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <span className="xy-switch">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        <span aria-hidden="true" />
      </span>
    </label>
  );
}
export function Checkbox({
  children,
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <label className={`xy-choice ${disabled ? "is-disabled" : ""}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="xy-choice-mark" aria-hidden="true">
        <Icon name={indeterminate ? "minus" : "check"} size={14} />
      </span>
      <span>{children}</span>
    </label>
  );
}
export function RadioGroup({
  label,
  options,
  value,
  onChange,
  disabled = false,
  segmented = false,
}) {
  const name = useId();
  return (
    <fieldset
      className={`xy-radio-group ${segmented ? "segmented" : ""}`}
      disabled={disabled}
    >
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <label
            className={`xy-choice ${option.disabled ? "is-disabled" : ""}`}
            key={option.value}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              disabled={option.disabled}
            />
            {!segmented && (
              <span className="xy-choice-mark radio" aria-hidden="true">
                <Icon name="check" size={14} />
              </span>
            )}
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function Progress({
  label,
  value = 0,
  total = 100,
  variant = "linear",
  indeterminate = false,
}) {
  const max = Number.isFinite(total) && total > 0 ? total : 100;
  const amount = Math.max(0, Math.min(max, Number.isFinite(value) ? value : 0)),
    percentage = (amount / max) * 100;
  return (
    <div
      className={`xy-progress ${variant} ${indeterminate ? "is-indeterminate" : ""}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : amount}
      aria-valuetext={indeterminate ? "处理中" : `${Math.round(percentage)}%`}
    >
      {variant === "ring" ? (
        <div className="xy-progress-ring">
          <svg viewBox="0 0 72 72" aria-hidden="true">
            <circle cx="36" cy="36" r="30" />
            <circle
              className="xy-progress-fill"
              cx="36"
              cy="36"
              r="30"
              pathLength="100"
              strokeDasharray={`${indeterminate ? 25 : percentage} 100`}
            />
          </svg>
          <span>
            {indeterminate ? (
              <Icon name="file" size={21} />
            ) : (
              Math.round(percentage) + "%"
            )}
          </span>
        </div>
      ) : (
        <div className="xy-progress-track">
          <span
            style={{
              transform: `scaleX(${indeterminate ? 0.3 : percentage / 100})`,
            }}
          />
        </div>
      )}
    </div>
  );
}
