//TODO: add copy functionality to ticket id

function Company({title}: {title: string}) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xl sm:text-2xl font-semibold text-slate-900 line-clamp-2">
        {title}
      </p>
    </div>
  );
}

function PrimaryButton({status}: {status: string}) {
  return (
    <div className="bg-[#007030] hover:bg-[#104735] px-3 sm:px-4 py-2 rounded-lg transition-colors">
      <p className="text-xs sm:text-sm font-semibold text-white text-nowrap">
        {status.replace(/_/g, ' ')}
      </p>
    </div>
  );
}

function Buttons({ticketId, status}: {ticketId: string, status: string}) {
  return (
    <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4 ml-3 sm:ml-4">
      <p className="text-sm sm:text-base font-semibold text-slate-900 text-nowrap">
        #{ticketId}
      </p>
      <PrimaryButton status={status} />
    </div>
  );
}

export default function Header({title, ticketId, status}: {title: string, ticketId: string, status: string}) {
  return (
    <header className="mt-6 mb-6">
      <div className="flex items-start justify-between gap-4 min-w-0">
        <Company title={title} />
        <Buttons ticketId={ticketId} status={status} />
      </div>
    </header>
  );
}