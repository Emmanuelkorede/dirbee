
"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Credit = { label: string; value: string };

type CreditsEditorProps = {
  value: Credit[];
  onChange: (credits: Credit[]) => void;
};

const SUGGESTED_LABELS = [
  "Director", "Producer", "Cinematographer", "Editor", "Colorist",
  "Production Designer", "Stylist", "Choreographer",
];

export function CreditsEditor({ value, onChange }: CreditsEditorProps) {
  function update(index: number, field: keyof Credit, text: string) {
    onChange(value.map((credit, i) => (i === index ? { ...credit, [field]: text } : credit)));
  }

  return (
    <div className="space-y-3">
      <datalist id="credit-labels">
        {SUGGESTED_LABELS.map((label) => (
          <option key={label} value={label} />
        ))}
      </datalist>

      {value.map((credit, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <Input
            list="credit-labels"
            placeholder="Role (Director)"
            aria-label={`Credit ${index + 1} role`}
            value={credit.label}
            maxLength={60}
            onChange={(event) => update(index, "label", event.target.value)}
          />
          <Input
            placeholder="Name"
            aria-label={`Credit ${index + 1} name`}
            value={credit.value}
            maxLength={120}
            onChange={(event) => update(index, "value", event.target.value)}
          />
          <Button
            variant="ghost"
            className="size-12 px-0"
            aria-label={`Remove credit ${index + 1}`}
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={value.length >= 20}
        onClick={() => onChange([...value, { label: "", value: "" }])}
      >
        Add credit
      </Button>
    </div>
  );
}