import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "status" | "priority" | "default";
  status?: number;
  priority?: number | null;
  className?: string;
};

const statusStyles: Record<
  number,
  { label: string; className: string; borderClass: string }
> = {
  1: {
    label: "Open",
    className: "bg-sky-50 text-sky-700",
    borderClass: "border-sky-100",
  },
  2: {
    label: "Awaiting Student",
    className: "bg-amber-50 text-amber-700",
    borderClass: "border-amber-100",
  },
  3: {
    label: "Awaiting Advisor",
    className: "bg-violet-50 text-violet-700",
    borderClass: "border-violet-100",
  },
  0: {
    label: "Closed",
    className: "bg-slate-100 text-slate-700",
    borderClass: "border-slate-200",
  },
};

const priorityStyles: Record<
  number,
  { label: string; className: string; borderClass: string }
> = {
  3: {
    label: "High",
    className: "bg-rose-50 text-rose-700",
    borderClass: "border-rose-100",
  },
  2: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700",
    borderClass: "border-amber-100",
  },
  1: {
    label: "Low",
    className: "bg-emerald-50 text-emerald-700",
    borderClass: "border-emerald-100",
  },
};

export function StatusBadge({ status }: { status: number }) {
  const style = statusStyles[status] ?? statusStyles[1];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${style.className} ${style.borderClass}`}
    >
      {style.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: number | null }) {
  if (priority === null || priority === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
        Unset
      </span>
    );
  }

  const style = priorityStyles[priority] ?? priorityStyles[1];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${style.className} ${style.borderClass}`}
    >
      {style.label}
    </span>
  );
}

export default function Badge({
  children,
  variant = "default",
  status,
  priority,
  className = "",
}: BadgeProps) {
  if (variant === "status" && status !== undefined) {
    return <StatusBadge status={status} />;
  }

  if (variant === "priority" && priority !== undefined) {
    return <PriorityBadge priority={priority} />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ${className}`}
    >
      {children}
    </span>
  );
}
