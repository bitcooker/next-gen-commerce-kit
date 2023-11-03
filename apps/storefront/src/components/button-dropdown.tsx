import classNames from "classnames";
import {
  forwardRef,
  type HTMLAttributes,
  type Key,
  type ReactNode,
} from "react";

export type ButtonDropdownProps = HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "small" | "large";
  variant?: "default" | "primary" | "secondary" | "accent";
  loading?: boolean;
  label: ReactNode;
  options: { key: Key; element: ReactNode }[];
};

export const ButtonDropdown = forwardRef<HTMLDivElement, ButtonDropdownProps>(
  function ButtonDropdown(
    { size, variant, loading, label, options, className, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`dropdown-end dropdown ${className ?? ""}`}
        {...props}
      >
        <label
          tabIndex={0}
          className={classNames([
            "btn normal-case",
            {
              "btn-sm": size === "small",
              "btn-lg": size === "large",
              "btn-primary": variant === "primary",
              "btn-secondary": variant === "secondary",
              "btn-accent": variant === "accent",
              loading: loading,
            },
          ])}
        >
          {label}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box mt-1 w-52 bg-base-300 p-2 shadow"
        >
          {options.map((option) => (
            <li key={option.key}>{option.element}</li>
          ))}
        </ul>
      </div>
    );
  }
);
