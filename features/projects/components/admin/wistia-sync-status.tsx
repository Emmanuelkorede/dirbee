import { ActionButton } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
import { syncProjectWistiaAction } from "@/features/projects/actions";
import type { Project } from "@/types/database";

type WistiaSyncStatusProps = {
  project: Pick<
    Project,
    | "id"
    | "wistiaShareUrl"
    | "wistiaMediaId"
    | "wistiaThumbnailUrl"
    | "videoWidth"
    | "videoHeight"
    | "wistiaSyncedAt"
  >;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export function WistiaSyncStatus({ project }: WistiaSyncStatusProps) {
  const { wistiaShareUrl, wistiaMediaId } = project;

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Wistia video</h2>

        {!wistiaShareUrl && <Badge tone="warning">No video</Badge>}
        {wistiaShareUrl && !wistiaMediaId && <Badge tone="warning">Not synced</Badge>}
        {wistiaMediaId && <Badge tone="success">Synced</Badge>}
      </div>

      {!wistiaShareUrl && (
        <p className="text-sm text-muted-foreground">
          No video linked yet. Add a Wistia share link below and save. A project needs a synced video before it can be published.
        </p>
      )}

      {wistiaShareUrl && !wistiaMediaId && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The link is saved, but Wistia has not confirmed the video yet. Check the share link is
            set to Unlocked, then try again. The project cannot be published until this succeeds.
          </p>
          <ActionButton action={syncProjectWistiaAction} id={project.id} size="sm">
            Retry sync
          </ActionButton>
        </div>
      )}

      {wistiaMediaId && (
        <div className="flex flex-col gap-4 sm:flex-row">
          {project.wistiaThumbnailUrl && (
            // Plain <img>: the Wistia image host is not set up for next/image yet.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.wistiaThumbnailUrl}
              alt=""
              loading="lazy"
              className="aspect-video w-full rounded-lg object-cover sm:w-52"
            />
          )}

          <div className="flex-1 space-y-3">
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 text-muted-foreground">Media ID</dt>
                <dd>{wistiaMediaId}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 text-muted-foreground">Size</dt>
                <dd>
                  {project.videoWidth && project.videoHeight
                    ? `${project.videoWidth} × ${project.videoHeight}`
                    : "Unknown"}
                </dd>
              </div>
              {project.wistiaSyncedAt && (
                <div className="flex gap-2">
                  <dt className="w-24 text-muted-foreground">Last synced</dt>
                  <dd>{dateFormat.format(project.wistiaSyncedAt)}</dd>
                </div>
              )}
            </dl>

            <ActionButton action={syncProjectWistiaAction} id={project.id} variant="outline" size="sm">
              Re-sync
            </ActionButton>
          </div>
        </div>
      )}
    </section>
  );
}