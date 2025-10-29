"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SelectItemConfig = { value: string; label: React.ReactNode };

type SelectContextValue = {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  onValueChange?: (nextValue: string) => void;
  items: SelectItemConfig[];
  className?: string;
  selectId?: string;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(component: string) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Select>`);
  }
  return ctx;
}

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Select({
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  className,
  children,
}: SelectProps) {
  const items: SelectItemConfig[] = [];
  let placeholder: string | undefined;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === SelectContent) {
      React.Children.forEach(child.props.children, (option) => {
        if (!React.isValidElement<SelectItemProps>(option)) return;
        if (option.type === SelectItem) {
          const { value: optionValue, children: optionChildren } = option.props;
          items.push({
            value: String(optionValue),
            label: optionChildren ?? optionValue,
          });
        }
      });
    }

    if (child.type === SelectTrigger) {
      React.Children.forEach(child.props.children, (triggerChild) => {
        if (!React.isValidElement<SelectValueProps>(triggerChild)) return;
        if (triggerChild.type === SelectValue) {
          placeholder = triggerChild.props.placeholder;
        }
      });
    }
  });

  const initialValue =
    value ??
    defaultValue ??
    (items.length > 0 ? items[0].value : "");

  const [internalValue, setInternalValue] = React.useState(initialValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [value, onValueChange]
  );

  const contextValue: SelectContextValue = {
    value: currentValue,
    disabled,
    placeholder,
    onValueChange: handleValueChange,
    items,
    className,
    selectId: id,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div>{children}</div>
    </SelectContext.Provider>
  );
}

type SelectTriggerProps = React.ComponentPropsWithoutRef<"select">;

export const SelectTrigger = React.forwardRef<
  HTMLSelectElement,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => {
  const { value, disabled, onValueChange, items, placeholder, className: parentClassName, selectId } =
    useSelectContext("SelectTrigger");

  const mergedClassName = cn(
    "h-11 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:border-cyan-500/50 focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-colors",
    parentClassName,
    className
  );

  const showPlaceholder = placeholder && !value;

  return (
    <select
      ref={ref}
      id={selectId}
      value={value}
      onChange={(event) => onValueChange?.(event.target.value)}
      disabled={disabled}
      className={mergedClassName}
      {...props}
    >
      {showPlaceholder ? (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      ) : null}
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
});
SelectTrigger.displayName = "SelectTrigger";

type SelectValueProps = {
  placeholder?: string;
};

export function SelectValue(_: SelectValueProps) {
  return null;
}

type SelectContentProps = {
  children: React.ReactNode;
};

export function SelectContent({ children }: SelectContentProps) {
  return <>{children}</>;
}

type SelectItemProps = {
  value: string;
  children?: React.ReactNode;
};

export function SelectItem(_: SelectItemProps) {
  return null;
}
