import { useRouter } from "next/navigation";
import { StatusBadge, PriorityBadge } from "./ui/Badge";
import Card from "./ui/Card";
import type { ApiTicket } from "../../lib/api";

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const formatDepartmentLabel = (label?: string | null, fallback = "-") => {
  if (!label) return fallback;
  const spaced = label.replace(/_/g, " ").trim();
  if (!spaced.length) return fallback;
  return spaced
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

type TicketCardProps = {
  ticket: ApiTicket;
  showPriority?: boolean;
  viewArchived?: boolean;
};

export default function TicketCard({
  ticket,
  showPriority = false,
  viewArchived = false,
}: TicketCardProps) {
  const router = useRouter();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const suffix = viewArchived ? "&archived=1" : "";
    router.push(`/ticket?id=${ticket.ticket_id}${suffix}`);
  };

  const handleCardClick = () => {
    router.push(`/ticket?id=${ticket.ticket_id}`);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#007030]">
                #{ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mt-2 line-clamp-2">
              {ticket.subject}
            </h3>
          </div>
        </div>

        {/* Message preview */}
        <p className="text-xs text-slate-600 line-clamp-2">
          {ticket.message}
        </p>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500 font-medium">Requester</p>
            <p className="text-slate-900">{ticket.author_name || `User ${ticket.author_id}`}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Assignee</p>
            <p className="text-slate-900">{ticket.assignee_name || "Unassigned"}</p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Department</p>
            <p className="text-slate-900">
              {formatDepartmentLabel(
                ticket.department_name ||
                  (ticket.department ? `Department ${ticket.department}` : "-")
              )}
            </p>
          </div>
          <div>
            <p className="text-slate-500 font-medium">Updated</p>
            <p className="text-slate-900">{formatDate(ticket.last_updated)}</p>
          </div>
        </div>

        {/* Priority and action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {showPriority ? (
            <PriorityBadge priority={ticket.priority} />
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={handleView}
            className="rounded-full border border-[#007030] px-3 py-1 text-xs font-semibold text-[#007030] transition hover:bg-[#007030]/10"
          >
            {viewArchived ? "View" : "Edit"}
          </button>
        </div>
      </div>
    </Card>
  );
}
