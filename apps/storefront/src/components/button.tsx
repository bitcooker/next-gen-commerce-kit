import classNames from "classnames";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "small" | "large";
  variant?: "default" | "primary" | "secondary" | "accent";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { children, size, variant, loading, className, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={classNames([
          "btn normal-case",
          className,
          {
            "btn-sm": size === "small",
            "btn-lg": size === "large",
            "btn-primary": variant === "primary",
            "btn-secondary": variant === "secondary",
            "btn-accent": variant === "accent",
            loading: loading,
          },
        ])}
        {...props}
      >
        {children}
      </button>
    );
  }
);
