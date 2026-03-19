import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import TransactionsPage from "@/pages/transactions/transactionsPage";
import AssetsPage from "@/pages/assets/AssetsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/assets" element={<AssetsPage />} />
    </Routes>
  );
}