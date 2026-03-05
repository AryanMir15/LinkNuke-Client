import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Configurator from "./Configurator";
import NukedLinksTable from "./NukedLinksTable";
import NukedLinksMobile from "./NukedLinksMobile";

export default function GeneratedLinks() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="space-y-6">
      <Configurator />
      {isMobile ? <NukedLinksMobile /> : <NukedLinksTable />}
    </div>
  );
}
