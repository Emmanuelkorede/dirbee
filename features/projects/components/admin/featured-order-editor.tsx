"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { OrderedPicker } from "@/components/admin/ordered-picker";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { setFeaturedProjectsAction } from "@/features/projects/actions";
import type { ActionResult } from "@/types/action";

type FeaturedOrderEditorProps = {
  options: { id: string; label: string }[]; // published projects only
  initialIds: string[]; // currently featured, in order
};

export function FeaturedOrderEditor({ options, initialIds }: FeaturedOrderEditorProps) {
  const router = useRouter();
  const [ids, setIds] = useState(initialIds);
  const [result, setResult] = useState<ActionResult<unknown> | null>(null);
  const [pending, startTransition] = useTransition();

  const changed = ids.join(",") !== initialIds.join(",");

  function save() {
    startTransition(async () => {
      const response = await setFeaturedProjectsAction(ids);
      setResult(response);
      if (response.success) router.refresh();
    });
  }

  return (
    <div className="max-w-xl space-y-4">
      <OrderedPicker
        options={options}
        value={ids}
        onChange={(next) => {
          setIds(next);
          setResult(null);
        }}
        max={10}
        addLabel="Add a published project..."
        emptyText="Nothing is featured on the homepage yet."
      />

      <FormMessage result={result} successText="Homepage order saved." />

      <Button onClick={save} disabled={!changed || pending}>
        {pending ? "Saving..." : "Save homepage order"}
      </Button>
    </div>
  );
}