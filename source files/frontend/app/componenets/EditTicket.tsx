// import svgPaths from "./svg-fo56gbn0a8";
// import { imgIcon, imgIcon1, imgIcon2, imgIcon3, imgIcon4, imgDrag, imgIcon5, imgIcon6, imgIcon7, imgIcon8, imgIcon9, img } from "./svg-8g5tp";
type FilePlusProps = {
  className?: string;
  size?: "20" | "24" | "32" | "40" | "48" | "16";
};

/**
 * @figmaAssetKey 43238f604dd9db64f47c3bbdc7ef57b19e6fd2c1
 */
function FilePlus({ className, size = "48" }: FilePlusProps) {
  if (size === "16") {
    return (
      <div className={className} data-name="Size=16">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-6%_-7.5%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full"/>
          </div>
        </div>
      </div>
    );
  }
  if (size === "20") {
    return (
      <div className={className} data-name="Size=20">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-6%_-7.5%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "24") {
    return (
      <div className={className} data-name="Size=24">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-6.25%_-7.81%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "32") {
    return (
      <div className={className} data-name="Size=32">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-5.63%_-7.03%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "40") {
    return (
      <div className={className} data-name="Size=40">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-5.25%_-6.56%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="Size=48">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 44">
            <path id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
type TextareaFieldProps = {
  className?: string;
  hasLabel?: boolean;
  hasError?: boolean;
  label?: string;
  error?: string;
  description?: string;
  hasDescription?: boolean;
  value?: string;
  state?: "Default" | "Error" | "Disabled";
  valueType?: "Default" | "Placeholder";
};

/**
 * @figmaAssetKey 45a146b674f858a2c626c056c58ddf0f67e192ee
 */
function TextareaField({ className, hasLabel = true, hasError = false, label = "Label", error = "Hint", description = "Description", hasDescription = false, value = "Value", state = "Default", valueType = "Default" }: TextareaFieldProps) {
  if (state === "Default" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Default, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-full">{label}</p>}
        <div className="bg-white min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
          <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
                <div className="absolute inset-[-5.33%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                    <path id="Drag" stroke="var(--stroke-0, #B3B3B3)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Error" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Error, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-full">{label}</p>}
        <div className="bg-white min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
          <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
                <div className="absolute inset-[-5.33%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                    <path id="Drag" stroke="var(--stroke-0, #B3B3B3)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#900b09] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Error" && valueType === "Default") {
    return (
      <div className={className} data-name="State=Error, Value Type=Default">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-full">{label}</p>}
        <div className="bg-white min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
          <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">{value}</p>
              <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
                <div className="absolute inset-[-5.33%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                    <path id="Drag" stroke="var(--stroke-0, #B3B3B3)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#900b09] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Disabled" && valueType === "Default") {
    return (
      <div className={className} data-name="State=Disabled, Value Type=Default">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#b3b3b3] text-[16px] w-full">{label}</p>}
        <div className="bg-[#d9d9d9] min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
          <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
                <div className="absolute inset-[-5.33%]" style={{ "--fill-0": "rgba(179, 179, 179, 1)", "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                  <img alt="" className="block max-w-none size-full" />
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#b2b2b2] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Disabled" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Disabled, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#b3b3b3] text-[16px] w-full">{label}</p>}
        <div className="bg-[#d9d9d9] min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
          <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
                <div className="absolute inset-[-5.33%]" style={{ "--fill-0": "rgba(179, 179, 179, 1)", "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                  <img alt="" className="block max-w-none size-full" />
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#b2b2b2] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="State=Default, Value Type=Default">
      {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-full">{label}</p>}
      <div className="bg-white min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
        <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
            <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">{value}</p>
            <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
              <div className="absolute inset-[-5.33%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                  <path id="Drag" stroke="var(--stroke-0, #B3B3B3)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      </div>
    </div>
  );
}
type ChevronDownProps = {
  className?: string;
  size?: "20" | "24" | "32" | "40" | "48" | "16";
};

/**
 * @figmaAssetKey 561ef01d78ee35ec50f6381d0c973b7ff48bf6a9
 */
function ChevronDown({ className, size = "48" }: ChevronDownProps) {
  if (size === "16") {
    return (
      <div className={className} data-name="Size=16">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-20%_-10%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
              <path d="M0.8 0.8L4.8 4.8L8.8 0.8" id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (size === "20") {
    return (
      <div className={className} data-name="Size=20">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-20%_-10%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "24") {
    return (
      <div className={className} data-name="Size=24">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-20.83%_-10.42%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "32") {
    return (
      <div className={className} data-name="Size=32">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-18.75%_-9.38%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "40") {
    return (
      <div className={className} data-name="Size=40">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-17.5%_-8.75%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="Size=48">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
        <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
          <img alt="" className="block max-w-none size-full" />
        </div>
      </div>
    </div>
  );
}
type SelectFieldProps = {
  className?: string;
  hasLabel?: boolean;
  hasError?: boolean;
  label?: string;
  error?: string;
  open?: boolean;
  description?: string;
  hasDescription?: boolean;
  value?: string;
  state?: "Default" | "Error" | "Disabled";
  valueType?: "Default" | "Placeholder";
};

/**
 * @figmaAssetKey b4d568282b67de741c52524b83888113e79a662c
 */
function SelectField({ className, hasLabel = true, hasError = true, label = "Label", error = "Error", open = false, description = "Description", hasDescription = false, value = "Value", state = "Default", valueType = "Default" }: SelectFieldProps) {
  if (state === "Default" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Default, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
          <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
          <div className="flex flex-row items-center min-w-inherit size-full">
            <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <ChevronDown size="16" className="overflow-clip relative shrink-0 size-[16px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Error" && valueType === "Default") {
    return (
      <div className={className} data-name="State=Error, Value Type=Default">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
          <div aria-hidden="true" className="absolute border border-[#900b09] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
          <div className="flex flex-row items-center min-w-inherit size-full">
            <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">{value}</p>
              <ChevronDown size="16" className="overflow-clip relative shrink-0 size-[16px]" />
            </div>
          </div>
        </div>
        {hasError && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#900b09] text-[16px] w-[min-content]">{error}</p>}
      </div>
    );
  }
  if (state === "Error" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Error, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
          <div aria-hidden="true" className="absolute border border-[#900b09] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
          <div className="flex flex-row items-center min-w-inherit size-full">
            <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <ChevronDown size="16" className="overflow-clip relative shrink-0 size-[16px]" />
            </div>
          </div>
        </div>
        {hasError && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#900b09] text-[16px] w-[min-content]">{error}</p>}
      </div>
    );
  }
  if (state === "Disabled" && valueType === "Default") {
    return (
      <div className={className} data-name="State=Disabled, Value Type=Default">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#b3b3b3] text-[16px] w-full">{label}</p>}
        <div className="bg-[#d9d9d9] h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
          <div aria-hidden="true" className="absolute border border-[#b2b2b2] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
          <div className="flex flex-row items-center min-w-inherit size-full">
            <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Chevron down">
                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
                  <div className="absolute inset-[-20%_-10%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                    <img alt="" className="block max-w-none size-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disabled" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Disabled, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#b3b3b3] text-[16px] w-full">{label}</p>}
        <div className="bg-[#d9d9d9] h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
          <div aria-hidden="true" className="absolute border border-[#b2b2b2] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
          <div className="flex flex-row items-center min-w-inherit size-full">
            <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Chevron down">
                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
                  <div className="absolute inset-[-20%_-10%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                    <img alt="" className="block max-w-none size-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="State=Default, Value Type=Default">
      {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
      <div className="bg-white h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        <div className="flex flex-row items-center min-w-inherit size-full">
          <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
            <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">{value}</p>
            <ChevronDown size="16" className="overflow-clip relative shrink-0 size-[16px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
type InputFieldProps = {
  className?: string;
  hasLabel?: boolean;
  hasError?: boolean;
  label?: string;
  error?: string;
  hasDescription?: boolean;
  description?: string;
  value?: string;
  state?: "Disabled" | "Default" | "Error";
  valueType?: "Default" | "Placeholder";
};

/**
 * @figmaAssetKey c28150b04d333d34ed9d2b77abd9f2f54e1a878a
 */
function InputField({ className, hasLabel = true, hasError = false, label = "Label", error = "Error", hasDescription = false, description = "Description", value = "Value", state = "Default", valueType = "Default" }: InputFieldProps) {
  if (state === "Default" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Default, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Error" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Error, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#900b09] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Error" && valueType === "Default") {
    return (
      <div className={className} data-name="State=Error, Value Type=Default">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">{value}</p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#900b09] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Disabled" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Disabled, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#b3b3b3] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-[#d9d9d9] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#b2b2b2] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  if (state === "Disabled" && valueType === "Default") {
    return (
      <div className={className} data-name="State=Disabled, Value Type=Default">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#b3b3b3] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-[#d9d9d9] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
              <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#b3b3b3] text-[16px]">{value}</p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#b2b2b2] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="State=Default, Value Type=Default">
      {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
      <div className="bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
        <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
            <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">{value}</p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Legend">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">Update Advising Ticket</p>
    </div>
  );
}

function Select() {
  return (
    <div className="bg-white h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <div className="flex flex-row items-center min-w-inherit size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
          <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[#1e1e1e] text-[16px]">Value</p>
        </div>
      </div>
    </div>
  );
}

function SelectField1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Select Field">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-full">95 #</p>
      <Select />
    </div>
  );
}

export default function FormShipping() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Form Shipping">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <Legend />
          <InputField label="Tittle" value="" valueType="Placeholder" className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" />
          <InputField label="Requester" value="" valueType="Placeholder" className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" />
          <InputField label="Responsible" value="" valueType="Placeholder" className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" />
          <SelectField label="Status" className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" />
          <SelectField1 />
          <TextareaField label="Description" value="" valueType="Placeholder" className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">File Upload</p>
          <FilePlus className="overflow-clip relative shrink-0 size-[48px]" />
          <a className="box-border content-stretch cursor-pointer flex gap-[16px] items-center overflow-visible p-0 relative shrink-0 w-full" data-name="Button Group" href="/ticketid">
            <div className="basis-0 bg-[#2c2c2c] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
              <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap whitespace-pre">Save</p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}