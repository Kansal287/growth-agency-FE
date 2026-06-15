"use client";

import React from "react";
import DateCustom from "./DateCustom";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export interface FieldOption {
  value: string | number;
  label: string | number;
}

export interface Field {
  type:
    | "text"
    | "dropdown"
    | "multiselect"
    | "file"
    | "date"
    | "tel"
    | "number"
    | "textarea"
    | "password"
    | "email";
  name: string;
  label: string;
  placeholder?: string;
  value?: string | number | string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onMultiSelectChange?: (values: string[]) => void;
  options?: FieldOption[];
  dateRange?: [Date | null, Date | null];
  handleDateChange?: (range: [string, string]) => void;
  onFileChange?: (file: File) => void;
  accept?: string;
  rows?: number;
  maxLength?: number;
  aligned?: boolean;
  required?: boolean;
  disabled?: boolean;
  inputType?: string;
}

export interface ActionButton {
  text: string;
  onClick: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface InputWithButtonsProps {
  fields: Field[];
  buttons: ActionButton[];
  gridClass?: string;
  compact?: boolean;
}

// ---------- MultiSelect ----------
function MultiSelect({ field }: { field: Field }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = (field.value as string[]) ?? [];

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val: string) => {
    const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
    field.onMultiSelectChange?.(next);
  };

  const display =
    selected.length === 0
      ? (field.placeholder ?? "Select options")
      : selected.length === 1
        ? (field.options?.find((o) => o.value === selected[0])?.label ?? selected[0])
        : `${selected.length} selected`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-10 flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm shadow-sm hover:border-pink-400 dark:hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
      >
        <span
          className={
            selected.length === 0 ? "text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"
          }
        >
          {display}
        </span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && field.options && field.options.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-auto max-h-52 py-1">
          <div
            onClick={() => {
              if (selected.length === field.options!.length) {
                field.onMultiSelectChange?.([]);
              } else {
                field.onMultiSelectChange?.(field.options!.map((o) => o.value as string));
              }
            }}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
          >
            <input
              type="checkbox"
              aria-label="Select All"
              checked={selected.length === field.options.length && field.options.length > 0}
              onChange={() => {}}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-pink-600 focus:ring-pink-500 cursor-pointer pointer-events-none"
            />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {selected.length === field.options!.length && field.options!.length > 0 ? 'Deselect All' : 'Select All'}
            </span>
          </div>
          {field.options.map((opt, i) => (
            <div
              key={i}
              onClick={() => toggle(opt.value as string)}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                aria-label={String(opt.label)}
                checked={selected.includes(opt.value as string)}
                onChange={() => {}}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-pink-600 focus:ring-pink-500 cursor-pointer pointer-events-none"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Main Component ----------
const inputClass =
  "w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed";

const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300";

const buttonVariants: Record<string, string> = {
  primary: "bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white shadow-sm",
  secondary: "bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white shadow-sm",
  danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm",
  outline: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm",
};

const InputWithButtons: React.FC<InputWithButtonsProps> = ({
  fields,
  buttons,
  gridClass,
  compact = false,
}) => {
  const [showPassword, setShowPassword] = React.useState<Record<string, boolean>>({});
  const grid = gridClass ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const renderField = (field: Field, index: number) => {
    const RedStar = (
      <>
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </>
    );

    switch (field.type) {
      case "text":
      case "tel":
      case "number":
      case "email":
        return (
          <div key={index}>
            <label htmlFor={field.name} className={labelClass}>
              {RedStar}
            </label>
            <input
              type={field.inputType ?? field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder ?? "Enter…"}
              value={field.value as string | number}
              onChange={field.onChange}
              disabled={field.disabled}
              maxLength={field.maxLength}
              className={inputClass}
            />
          </div>
        );

      case "password":
        return (
          <div key={index}>
            <label htmlFor={field.name} className={labelClass}>
              {RedStar}
            </label>
            <div className="relative">
              <input
                type={showPassword[field.name] ? "text" : "password"}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder ?? "Enter password"}
                value={field.value as string}
                onChange={field.onChange}
                disabled={field.disabled}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => ({ ...p, [field.name]: !p[field.name] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword[field.name] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div key={index}>
            <label htmlFor={field.name} className={labelClass}>
              {RedStar}
            </label>
            <div className="relative">
              <select
                id={field.name}
                name={field.name}
                value={field.value as string}
                onChange={field.onChange}
                disabled={field.disabled}
                className={`${inputClass} appearance-none pr-9 cursor-pointer`}
              >
                {field.placeholder && (
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                )}
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        );

      case "multiselect":
        return (
          <div key={index}>
            <label className={labelClass}>{RedStar}</label>
            <MultiSelect field={field} />
          </div>
        );

      case "date":
        return (
          <div key={index}>
            <label className={labelClass}>{RedStar}</label>
            <DateCustom
              dateRange={field.dateRange ?? [null, null]}
              handleDateChange={field.handleDateChange!}
              aligned={field.aligned}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={index} className="col-span-full">
            <label htmlFor={field.name} className={labelClass}>
              {RedStar}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder ?? "Enter…"}
              value={field.value as string}
              onChange={field.onChange}
              disabled={field.disabled}
              rows={field.rows ?? 3}
              maxLength={field.maxLength}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors disabled:bg-gray-50 dark:disabled:bg-gray-700 resize-none"
            />
          </div>
        );

      case "file":
        return (
          <div key={index}>
            <label htmlFor={field.name} className={labelClass}>
              {RedStar}
            </label>
            <input
              type="file"
              id={field.name}
              name={field.name}
              accept={field.accept}
              disabled={field.disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) field.onFileChange?.(file);
              }}
              className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 dark:file:bg-pink-900/50 file:text-pink-700 dark:file:text-pink-300 hover:file:bg-pink-100 dark:hover:file:bg-pink-900 file:cursor-pointer cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg p-1.5 bg-white dark:bg-gray-800"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${compact ? "p-4" : "p-6"} bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200`}
    >
      <div className={`grid ${grid} gap-4 mb-5`}>{fields.map((field, i) => renderField(field, i))}</div>

      {buttons.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {buttons.map((btn, i) => {
            const variant = btn.variant ?? "primary";
            const variantClass = buttonVariants[variant] ?? buttonVariants.primary;
            return (
              <button
                key={i}
                type="button"
                onClick={btn.onClick}
                disabled={btn.disabled}
                className={`${btn.className ?? ""} inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass}`}
              >
                {btn.icon && btn.icon}
                {btn.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InputWithButtons;
