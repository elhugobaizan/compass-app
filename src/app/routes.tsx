import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import TransactionsPage from "@/pages/transactions/TransactionsPage";
import AssetsPage from "@/pages/assets/AssetsPage";
import AccountsPage from "@/pages/accounts/AccountsPage";
import AnalyticsPage from "@/pages/analytics/AnalyticsPage";
import BillsPage from "@/pages/bills/BillsPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import ToolsPage from "@/pages/tools/ToolsPage";
import ShoppingListPage from "@/pages/tools/ShoppingListPage";
import LocationsToolPage from "@/pages/tools/LocationsToolPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/assets" element={<AssetsPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/bills" element={<BillsPage />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/tools/compras" element={<ShoppingListPage />} />
      <Route path="/tools/lugares" element={<LocationsToolPage />} />
      {/* Lugares dejó de ser sección propia: la URL vieja puede seguir
          cacheada por el service worker de la PWA */}
      <Route path="/locations" element={<Navigate to="/tools/lugares" replace />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
