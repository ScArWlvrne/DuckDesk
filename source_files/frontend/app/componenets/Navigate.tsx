import type { User } from "../page";

export default function Navigate({user, newticket}: {user: User, newticket: boolean}) {
    const role = user.role;
    return (
    <div className="absolute bg-white h-[164px] left-0 overflow-clip right-0 top-0 p-30" data-name="Navigation">
      <div className="absolute content-stretch flex gap-[48px] items-center justify-end right-[80px] top-[56px]" data-name="Items">
        {role === "admin" || role === "advisor" ? (
          <p className="leading-[1.5] whitespace-pre">Co-pilot</p>
        ) : null}
        {!newticket ? (
        <div className="bg-black box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[14px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
          {!newticket ? (
            <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
              <a href="/editTicket" className="leading-[1.5] whitespace-pre">New ticket</a>
            </div>
          ) : null}
        </div>) : null}
      </div>
      <div className="absolute flex flex-col font-['Roboto:Regular',_sans-serif] font-normal h-[112px] justify-center leading-[0] left-[66px] text-[57px] text-black top-[82px] tracking-[-0.25px] translate-y-[-50%] w-[531px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <a href="/" className="leading-[64px]">University of Oregon</a>
      </div>
    </div>
  );
}
