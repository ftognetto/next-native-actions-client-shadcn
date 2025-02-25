"use client";

import { useField } from "@native-actions/client";
import React from "react";

export function FormLabel({ children }: { children: React.ReactNode }) {
  const field = useField();
  return (
    <label
      className={`text-sm font-medium leading-none ${field.invalid && "text-destructive"}`}
      htmlFor={field.input.id}
    >
      {children}
    </label>
  );
}

export function FormDescription({ children }: { children: React.ReactNode }) {
  const field = useField();
  return (
    <p
      id={field.input.id + "-description"}
      className="text-sm text-muted-foreground"
    >
      {children}
    </p>
  );
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  const field = useField();
  const error = field.invalid || children;
  if (!error) {
    return null;
  }
  return (
    <p
      id={field.input.id + "-message"}
      className={`text-sm font-medium ${error && "text-destructive"}`}
    >
      {error}
    </p>
  );
}
