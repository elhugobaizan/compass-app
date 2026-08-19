import { JSX } from "react";

import PageHeader from "@/components/ui/PageHeader";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";

import ShoppingList from "@/components/finance/tools/ShoppingList";

export default function ToolsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title={isMobile ? "Herramientas" : ""}
        description={isMobile ? undefined : "Utilidades para el día a día."}
      />

      <ShoppingList isMobile={isMobile} />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}
