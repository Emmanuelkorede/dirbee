"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { OrderedPicker } from "@/components/admin/ordered-picker";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import type { ActionResult } from "@/types/action";

type FeaturedEditorProps = {
  // setFeaturedProjectsAction or setFeaturedReviewsAction
  action: (ids: string[]) => Promise<ActionResult<unknown>>;
  options: { id: string; label: string }[]; // what can be featured
  initialIds: string[]; 
  max: number;
  addLabel: string;
  emptyText: string;
  saveLabel: string;
  successText: string;
};

export function FeaturedEditor({
  action,
  options,
  initialIds,
  max,
  addLabel,
  emptyText,
  saveLabel,
  successText,
}: FeaturedEditorProps) {
  const router = useRouter();
  const [ids, setIds] = useState(initialIds);
  const [result, setResult] = useState<ActionResult<unknown> | null>(null);
  const [pending, startTransition] = useTransition();

  const changed = ids.join(",") !== initialIds.join(",");

  function save() {
    startTransition(async () => {
      const response = await action(ids);
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
        max={max}
        addLabel={addLabel}
        emptyText={emptyText}
      />

      <FormMessage result={result} successText={successText} />

      <Button onClick={save} disabled={!changed || pending}>
        {pending ? "Saving..." : saveLabel}
      </Button>
    </div>
  );
}