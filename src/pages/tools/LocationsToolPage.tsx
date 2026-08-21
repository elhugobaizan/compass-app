import { JSX } from "react";

import ToolPageShell from "./ToolPageShell";
import LocationsManager from "@/components/finance/tools/LocationsManager";

export default function LocationsToolPage(): JSX.Element {
  return (
    <ToolPageShell>
      {(isMobile) => <LocationsManager isMobile={isMobile} />}
    </ToolPageShell>
  );
}
