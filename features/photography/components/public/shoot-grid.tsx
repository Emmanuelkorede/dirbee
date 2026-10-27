import { Reveal } from "@/components/ui/reveal";
import { ShootCard } from "./shoot-card";

type Shoot = { id: string; slug: string; title: string; photoCount: number; coverUrl: string | null };

export function ShootGrid({ shoots }: { shoots: Shoot[] }) {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {shoots.map((shoot) => (
        <Reveal key={shoot.id}>
          <ShootCard shoot={shoot} />
        </Reveal>
      ))}
    </div>
  );
}