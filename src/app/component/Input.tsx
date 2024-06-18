import React, { useMemo } from "react";
import { XMark } from "./svg";
import { classes } from "../utils";

interface InputProps {
  value: string;
  setValue: (_: string) => void;
  label?: string;
  placeholder: string;
  type?: "email" | "password" | "text";
  isClearable?: boolean;
  icon?: React.ReactNode;
  error?: string;
  preIcon?: React.ReactNode;
}

export function Input({
  label,
  setValue: _setValue,
  value,
  placeholder,
  type = "text",
  isClearable,
  icon,
  error,
  preIcon,
}: InputProps) {
  const onChange = useMemo(() => {
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
      _setValue && _setValue(e.target.value);
    };
    return handleChange;
  }, [_setValue]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label>{label}</label>}
      <div
        className={classes(
          "text-black px-[16px] py-3 rounded-[25px] bg-white flex flex-row justify-between",
          error && "border border-solid border-red-400"
        )}
      >
        {preIcon}
        <input
          type={type}
          className="focus-visible:outline-none w-full"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {isClearable && !!value && <XMark onClick={() => _setValue("")} />}
        {icon}
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  );
}
