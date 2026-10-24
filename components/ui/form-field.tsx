import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  name: string; // must match the control's id and name
  error?: string | string[]; // straight from result.fieldErrors?.[name]
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({ label, name, error, hint, required, children }: FormFieldProps) {
  const message = Array.isArray(error) ? error[0] : error;

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.15em] text-muted-foreground"
      >
        {label}
        {required && <span className="text-danger" aria-hidden="true"> *</span>}
      </label>

      {children}

      {hint && !message && <p className="text-xs text-muted-foreground">{hint}</p>}
      {message && (
        <p role="alert" className="text-xs text-danger">
          {message}
        </p>
      )}
    </div>
  );
}