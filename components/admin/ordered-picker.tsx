"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type Option = { id: string; label: string };

type OrderedPickerProps = {
  id?: string; // lets a FormField label point at the dropdown
  options: Option[]; // everything that can be chosen
  value: string[]; // chosen ids, in order
  onChange: (ids: string[]) => void;
  max?: number;
  addLabel: string; // "Add an artist..."
  emptyText: string;
};

const iconButton = "size-9 px-0";

export function OrderedPicker({ id, options, value, onChange, max, addLabel, emptyText }: OrderedPickerProps) {
  const labelFor = (optionId: string) =>
    options.find((option) => option.id === optionId)?.label ?? "Unknown";

  const available = options.filter((option) => !value.includes(option.id));
  const atMax = max !== undefined && value.length >= max;

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;

    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ol className="space-y-2">
          {value.map((itemId, index) => (
            <li
              key={itemId}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
            >
              <span className="w-6 text-xs text-muted-foreground">{index + 1}</span>
              <span className="flex-1 truncate text-sm">{labelFor(itemId)}</span>

              <Button variant="ghost" size="sm" className={iconButton} aria-label="Move up"
                disabled={index === 0} onClick={() => move(index, -1)}>
                <ChevronUp className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" className={iconButton} aria-label="Move down"
                disabled={index === value.length - 1} onClick={() => move(index, 1)}>
                <ChevronDown className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" className={iconButton} aria-label={`Remove ${labelFor(itemId)}`}
                onClick={() => onChange(value.filter((other) => other !== itemId))}>
                <X className="size-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ol>
      )}

      <Select
        id={id}
        value=""
        disabled={atMax || available.length === 0}
        onChange={(event) => {
          if (event.target.value) onChange([...value, event.target.value]);
        }}
      >
        <option value="">{atMax ? `Maximum of ${max} reached` : addLabel}</option>
        {available.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}