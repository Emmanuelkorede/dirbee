"use client";

import { Select } from "@/components/ui/select";
import type { Client } from "@/types/database";

type ClientSelectProps = {
  id?: string;
  clients: Client[];
  value: string | null;
  onChange: (id: string | null) => void;
};

export function ClientSelect({ id, clients, value, onChange }: ClientSelectProps) {
  return (
    <Select id={id} value={value ?? ""} onChange={(event) => onChange(event.target.value || null)}>
      <option value="">No client</option>
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      ))}
    </Select>
  );
}