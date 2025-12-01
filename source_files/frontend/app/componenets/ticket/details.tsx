type TicketDetailsProps = {
  assignee?: string | null;
  lastUpdated?: string | null;
  modifiedBy?: string | null;
  department?: string | null;
  requester?: string | null;
  createdAt?: string | null;
  studentNumber?: string | number | null;
};

const asText = (value: string | number | null | undefined, fallback: string) => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : fallback;
};

const formatDate = (value: string | null | undefined, fallback = "—") => {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString();
};

const formatDepartment = (value: string | null | undefined, fallback = "No department") => {
  if (!value) return fallback;
  const spaced = value.replace(/_/g, " ").trim();
  if (!spaced.length) return fallback;
  return spaced
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

type InfoCardProps = {
  title: string;
  subtitle: string;
  value: string;
};

function InfoCard({ title, subtitle, value }: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 w-full">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
      <p className="mt-4 text-lg text-slate-900">{value}</p>
    </div>
  );
}

export default function TestimonialWall({
  assignee,
  lastUpdated,
  modifiedBy,
  department,
  requester,
  createdAt,
  studentNumber,
}: TicketDetailsProps) {
  const responsibleName = asText(assignee, "Unassigned");
  const lastUpdatedText = formatDate(lastUpdated, "Not updated yet");
  const modifiedByText = asText(modifiedBy ?? assignee ?? requester, "Unknown user");
  const departmentText = formatDepartment(department);
  const requesterText = asText(requester, "Unknown requester");
  const createdAtText = formatDate(createdAt, "Unknown date");
  const studentNumberText = asText(studentNumber, "Not provided");

  return (
    <section className="px-6 py-8">
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Responsible"
          subtitle="Staff responsible for ticket"
          value={responsibleName}
        />
        <InfoCard
          title="Department"
          subtitle="Department of requester"
          value={departmentText}
        />
        <InfoCard
          title="95 #"
          subtitle="Student's 95 number"
          value={studentNumberText}
        />
        <InfoCard
          title="Last Modified"
          subtitle="Date and modified by"
          value={`${lastUpdatedText}${modifiedByText ? ` • ${modifiedByText}` : ""}`}
        />
        <InfoCard
          title="Requester"
          subtitle="Requester of ticket"
          value={requesterText}
        />
        <InfoCard
          title="Created"
          subtitle="Date created"
          value={createdAtText}
        />
      </div>
    </section>
  );
}
