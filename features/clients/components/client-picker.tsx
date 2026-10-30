"use client";

import { OrderedPicker } from "@/components/admin/ordered-picker";
import type { Client } from "@/types/database";

type ClientPickerProps = {
  id?: string;
  clients: Client[];
  value: string[];
  onChange: (ids: string[]) => void;
};

export function ClientPicker({ clients, ...props }: ClientPickerProps) {
  return (
    <OrderedPicker
      options={clients.map((client) => ({ id: client.id, label: client.name }))}
      max={10}
      addLabel="Add a client..."
      emptyText="No clients. Clients are optional."
      {...props}
    />
  );
}