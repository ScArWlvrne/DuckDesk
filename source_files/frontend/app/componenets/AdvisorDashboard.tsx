import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ApiTicket } from "../../lib/api";
import type { FilterState, User } from "../page";

type AdvisorDashboardProps = {
  user: User;
  tickets: ApiTicket[];
  filters: FilterState;
  loading: boolean;
  viewArchived: boolean;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onToggleArchived: (archived: boolean) => void;
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

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const StatusPill = ({ status }: { status: number }) => {
  const style = statusStyles[status] ?? statusStyles[1];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${style.className} ${style.borderClass}`}
    >
      {style.label}
    </span>
  );
};

const PriorityPill = ({ priority }: { priority: number | null }) => {
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
};

const SummaryCard = ({
  title,
  value,
  tone,
  helper,
}: {
  title: string;
  value: number | string;
  tone: string;
  helper?: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </p>
    <div className="mt-2 flex items-baseline gap-2">
      <p className={`text-3xl font-semibold ${tone}`}>{value}</p>
      {helper ? <span className="text-xs text-slate-500">{helper}</span> : null}
    </div>
  </div>
);

const FilterField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

const QueueItem = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
    <p className="text-sm text-slate-700">{label}</p>
    <span className={`text-base font-semibold ${tone}`}>{value}</span>
  </div>
);

const formatDepartmentLabel = (label?: string | null, fallback = "-") => {
  if (!label) return fallback;
  const spaced = label.replace(/_/g, " ").trim();
  if (!spaced.length) return fallback;
  return spaced
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export default function AdvisorDashboard({
  user,
  tickets,
  filters,
  loading,
  viewArchived,
  onFilterChange,
  onResetFilters,
  onToggleArchived,
}: AdvisorDashboardProps) {
  const router = useRouter();
  const statusRank: Record<number, number> = {
    1: 0, // Open
    3: 1, // Awaiting advisor
    2: 2, // Awaiting student
    0: 3, // Closed
  };

  const getStatusRank = (status: number) => statusRank[status] ?? 4;
  const getDate = (t: ApiTicket) =>
    new Date(t.last_updated ?? t.created_at ?? "").getTime();
  const getPriorityRank = (priority: number | null) =>
    priority === null || priority === undefined ? -1 : priority;

  const sortedTickets = useMemo(
    () =>
      [...tickets].sort((a, b) => {
        // Status first (Open -> Awaiting advisor -> Awaiting student -> Closed)
        const statusCompare = getStatusRank(a.status) - getStatusRank(b.status);
        if (statusCompare !== 0) return statusCompare;

        // Then by least recent to most recent (older first)
        const dateCompare = getDate(a) - getDate(b);
        if (dateCompare !== 0) return dateCompare;

        // Finally by priority (High 3 -> Medium 2 -> Low 1 -> unset)
        return getPriorityRank(b.priority ?? null) - getPriorityRank(a.priority ?? null);
      }),
    [tickets]
  );

  const statusCounts = useMemo(
    () =>
      tickets.reduce(
        (acc, ticket) => {
          if (ticket.status === 0) acc.closed += 1;
          else if (ticket.status === 1) acc.open += 1;
          else if (ticket.status === 2) acc.awaitingStudent += 1;
          else if (ticket.status === 3) acc.awaitingAdvisor += 1;
          return acc;
        },
        { open: 0, awaitingStudent: 0, awaitingAdvisor: 0, closed: 0 }
      ),
    [tickets]
  );

  const assignedToMe = useMemo(() => {
    if (!user.id) return 0;
    return tickets.filter((ticket) => ticket.assignee_id === user.id).length;
  }, [tickets, user.id]);

  const awaitingAdvisor = statusCounts.awaitingAdvisor;
  const awaitingStudent = statusCounts.awaitingStudent;

  const departmentOptions = useMemo(() => {
    const map = new Map<number, string>();
    tickets.forEach((ticket) => {
      if (!ticket.department) return;
      const label = formatDepartmentLabel(
        ticket.department_name ||
          (ticket.department ? `Department ${ticket.department}` : "Department")
      );
      map.set(ticket.department, label);
    });

    return Array.from(map.entries()).map(([id, label]) => ({
      value: id.toString(),
      label,
    }));
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#007030]">
            Advisor Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {[
              { label: "Active queue", archived: false },
              { label: "Archived", archived: true },
            ].map((item) => {
              const active = viewArchived === item.archived;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onToggleArchived(item.archived)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-[#007030] text-white shadow"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <div className="h-9 w-9 rounded-full bg-[#007030]/10 text-center text-base font-semibold text-[#007030] leading-9">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user.name}
              </p>
              <p className="text-xs uppercase text-slate-500 tracking-wide">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Open / New"
          value={statusCounts.open}
          tone="text-[#007030]"
        />
        <SummaryCard
          title="Awaiting advisor"
          value={awaitingAdvisor}
          tone="text-[#004F6E]"
        />
        <SummaryCard
          title="Awaiting student"
          value={awaitingStudent}
          tone="text-[#FEE11A]"
        />
        <SummaryCard
          title="Closed"
          value={statusCounts.closed}
          tone="text-[#4D5859]"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Filters</p>
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-semibold text-[#007030] hover:text-[#104735]"
              >
                Reset
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <FilterField label="Search queue">
                <input
                  value={filters.text}
                  onChange={(event) =>
                    onFilterChange({ text: event.target.value })
                  }
                  placeholder="Subject, requester, message..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner shadow-slate-50 focus:border-[#007030] focus:outline-none focus:ring-2 focus:ring-[#007030]/20"
                />
              </FilterField>
              <FilterField label="Status">
                <select
                  value={filters.status}
                  onChange={(event) =>
                    onFilterChange({ status: event.target.value as FilterState["status"] })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#007030] focus:outline-none focus:ring-2 focus:ring-[#007030]/20"
                >
                  <option value="all">All statuses</option>
                  <option value="1">Open</option>
                  <option value="3">Awaiting advisor</option>
                  <option value="2">Awaiting student</option>
                  <option value="0">Closed</option>
                </select>
              </FilterField>
              <FilterField label="Priority">
                <select
                  value={filters.priority}
                  onChange={(event) =>
                    onFilterChange({
                      priority: event.target.value as FilterState["priority"],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#007030] focus:outline-none focus:ring-2 focus:ring-[#007030]/20"
                >
                  <option value="all">All priorities</option>
                  <option value="3">High</option>
                  <option value="2">Medium</option>
                  <option value="1">Low</option>
                </select>
              </FilterField>
              <FilterField label="Department">
                <select
                  value={filters.department}
                  onChange={(event) =>
                    onFilterChange({
                      department: event.target.value as FilterState["department"],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#007030] focus:outline-none focus:ring-2 focus:ring-[#007030]/20"
                >
                  <option value="all">All departments</option>
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FilterField>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {viewArchived ? "Archived tickets" : "Ticket queue"}
              </p>
              <p className="text-xs text-slate-500">
                Sorted by most recent activity - {sortedTickets.length} results
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Open", value: "1" },
                { label: "Awaiting advisor", value: "3" },
                { label: "Awaiting student", value: "2" },
                { label: "Closed", value: "0" },
              ].map((chip) => {
                const active = filters.status === chip.value;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => onFilterChange({ status: chip.value as FilterState["status"] })}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-[#007030] bg-[#007030]/10 text-[#007030]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Ticket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Requester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Assignee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        Loading queue...
                      </td>
                    </tr>
                  ) : sortedTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        No tickets match the current filters.
                      </td>
                    </tr>
                  ) : (
                    sortedTickets.map((ticket) => (
                      <tr
                        key={ticket.ticket_id}
                        className="hover:bg-slate-50/60 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/ticket?id=${ticket.ticket_id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") router.push(`/ticket?id=${ticket.ticket_id}`);
                        }}
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                          #{ticket.ticket_id}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          <div className="max-w-[320px] truncate">{ticket.subject}</div>
                          <p className="text-xs text-slate-500">
                            {ticket.message.slice(0, 80)}
                            {ticket.message.length > 80 ? "…" : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {ticket.author_name || `User ${ticket.author_id}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {ticket.assignee_name || "Unassigned"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {formatDepartmentLabel(
                            ticket.department_name ||
                              (ticket.department
                                ? `Department ${ticket.department}`
                                : "-")
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          <PriorityPill priority={ticket.priority} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          <StatusPill status={ticket.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {formatDate(ticket.last_updated)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              const suffix = viewArchived ? "&archived=1" : "";
                              router.push(`/ticket?id=${ticket.ticket_id}${suffix}`);
                            }}
                            className="rounded-full border border-[#007030] px-3 py-1 text-xs font-semibold text-[#007030] transition hover:bg-[#007030]/10"
                          >
                            {viewArchived ? "View" : "Edit"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
