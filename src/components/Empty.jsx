import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div
      className="borer-conversation-border border-1 w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green justify-center items-center"
    >
      {/* <Image src="/whatsapp.gif" width={200} height={200} /> */}
    </div>
  );
}

export default Empty;
