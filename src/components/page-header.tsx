import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3.5">
        {Icon ? (
          <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-neon glow">
            <Icon className="size-5" />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
