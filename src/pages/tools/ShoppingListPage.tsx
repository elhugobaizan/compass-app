import { JSX } from "react";

import ToolPageShell from "./ToolPageShell";
import ShoppingList from "@/components/finance/tools/ShoppingList";

export default function ShoppingListPage(): JSX.Element {
  return (
    <ToolPageShell>
      {(isMobile) => <ShoppingList isMobile={isMobile} />}
    </ToolPageShell>
  );
}
