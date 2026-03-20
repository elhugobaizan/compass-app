import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import TransactionsPage from "@/pages/transactions/TransactionsPage";
import AssetsPage from "@/pages/assets/AssetsPage";
import AccountsPage from "@/pages/accounts/AccountsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/assets" element={<AssetsPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
    </Routes>
  );
}