"use client";

import type { ActionResult } from "@native-actions/server";
import React, { useRef } from "react";
import type { z } from "zod";

export const FormNativeStateContext = React.createContext<ActionResult<any>>(
  {} as ActionResult<any>,
);
export const useNativeActionState = () => {
  const state = React.useContext(FormNativeStateContext);
  return {
    state,
  };
};

const FormNativeFieldContext = React.createContext<{ name: string }>(
  {} as { name: string },
);
export const useNativeFormField = () => {
  const { name } = React.useContext(FormNativeFieldContext);
  const { state } = useNativeActionState();
  const id = React.useId();
  return {
    name,
    id: id,
    messageId: `${id}-form-item-message`,
    descriptionId: `${id}-form-item-description`,
    invalid: state.invalid?.[name],
    defaultValue: state.data?.[name],
  };
};

export function Form<Schema extends z.AnyZodObject>({
  children,
  action,
  state,
  reset,
}: {
  children: React.ReactNode;
  action: (payload: FormData) => void;
  state: ActionResult<Schema>;
  reset?: boolean;
  onSuccess?: (data: z.TypeOf<Schema> | undefined) => void;
  onError?: (error: string) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  if (reset !== false) {
    if (formRef.current && state.success) {
      formRef.current.reset();
    }
  }

  return (
    <FormNativeStateContext.Provider value={state}>
      <form action={action} ref={formRef}>
        {children}
      </form>
    </FormNativeStateContext.Provider>
  );
}

export function FormField({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return (
    <FormNativeFieldContext.Provider value={{ name }}>
      <div className="space-y-2">{children}</div>
    </FormNativeFieldContext.Provider>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  const { id, invalid } = useNativeFormField();
  return (
    <label
      className={`text-sm font-medium leading-none ${invalid && "text-destructive"}`}
      htmlFor={id}
    >
      {children}
    </label>
  );
}

export function FormDescription({ children }: { children: React.ReactNode }) {
  const { descriptionId } = useNativeFormField();
  return (
    <p id={descriptionId} className="text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  const { messageId, invalid } = useNativeFormField();
  const error = invalid || children;
  if (!error) {
    return null;
  }
  return (
    <p id={messageId} className={`text-sm ${error && "text-destructive"}`}>
      {error}
    </p>
  );
}

export function FormInput({
  render,
}: {
  render: (input: {
    defaultValue: any;
    id: string;
    name: string;
  }) => React.ReactElement;
}) {
  const { name, id, defaultValue } = useNativeFormField();
  return render({ defaultValue, id, name });
}
