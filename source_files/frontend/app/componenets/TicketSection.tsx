import type { Ticket } from "../page";
import TicketRow from "./TicketRow";

function TextContentHeading({ title }: { title: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[32px] items-start relative shrink-0 w-full" data-name="Text Content Heading">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">{title}</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="box-border content-stretch flex items-start justify-between pl-0 pr-[3px] py-0 relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[32px] items-start mr-[-3px] relative shrink-0 w-[199px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">ID</p>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[32px] items-start mr-[-3px] relative shrink-0 w-[201px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">Tittle</p>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[32px] items-start mr-[-3px] relative shrink-0 w-[200px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">Requester</p>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[32px] items-start mr-[-3px] relative shrink-0 w-[200px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">Responsible</p>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[32px] items-start mr-[-3px] relative shrink-0 w-[200px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">Modified</p>
      </div>
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[32px] items-start mr-[-3px] relative shrink-0 w-[199px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">Modified by</p>
      </div>
    </div>
  );
}

function TicketList({tickets, title}: {tickets: Ticket[]; title: string}) {
  return (
    <div className="box-border content-stretch flex flex-col gap-[23px] items-center justify-center px-[26px] py-[27px] relative rounded-[31px] shrink-0 w-[1189px]" data-name="In Process list" style={{ background: "linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.21) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <TextContentHeading title={title} />
      <Frame />
      {tickets.map((ticket, i) => (
        <TicketRow key={i} ticket={ticket} />
      ))}
    </div>
  );
}

function Ts2Tickets({title, tickets}: {title: string; tickets: Ticket[]}) {
  return (
    <div className="relative rounded-[69px] shrink-0 w-full" data-name="TS 2 tickets" style={{background: "linear-gradient(85.87deg, rgba(82, 76, 139, 0.4489) 6.74%, rgba(22, 20, 37, 0.67) 93.26%)"}}>
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[101px] items-center justify-center px-[33px] py-[23px] relative w-full">
          <TicketList tickets={tickets} title={title} />
        </div>
      </div>
    </div>
  );
}

export default function TicketSection({ title, tickets }: { title: string; tickets: Ticket[]; }) {
  return (
    <div className="backdrop-blur-[2px] backdrop-filter relative size-full" data-name="Ticket Section">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[19px] py-[27px] relative ">
          <Ts2Tickets title={title} tickets={tickets} />
        </div>
      </div>
    </div>
  );
}
