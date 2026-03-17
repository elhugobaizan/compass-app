import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}