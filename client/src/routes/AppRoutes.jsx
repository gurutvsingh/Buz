import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../layouts/DashboardLayout";
import Businesses from "../pages/Businesses";
import Income from "../pages/Income";
import Expenses from "../pages/Expenses";
import Customers from "../pages/Customers";
import Employees from "../pages/Employees";
import Bills from "../pages/Bills";
import Reminders from "../pages/Reminders";
import Checklists from "../pages/Checklists";
import Analytics from "../pages/Analytics";
import Khata from "../pages/Khata";
import Notifications from "../pages/Notifications";
import InvoicePdf from "../pages/InvoicePdf";
import Inventory from "../pages/Inventory";
import AIAssistant from "../pages/AIAssistant";

const AppRoutes = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
 path="/dashboard"
 element={<Dashboard />}
/>

<Route
 path="/businesses"
 element={<Businesses />}
/>

<Route
 path="/income"
 element={<Income />}
/>

<Route
 path="/expenses"
 element={<Expenses />}
/>

<Route
 path="/customers"
 element={<Customers />}
/>

<Route
 path="/employees"
 element={<Employees />}
/>

<Route
 path="/bills"
 element={<Bills />}
/>

<Route
 path="/reminders"
 element={<Reminders />}
/>

<Route
 path="/checklists"
 element={<Checklists />}
/>

<Route
 path="/analytics"
 element={<Analytics />}
/>

<Route
 path="/khata"
 element={<Khata />}
/>

<Route
 path="/notifications"
 element={<Notifications />}
/>

<Route
 path="/invoice-pdf"
 element={<InvoicePdf />}
/>

<Route
 path="/inventory"
 element={<Inventory />}
/>

<Route
 path="/ai-assistant"
 element={<AIAssistant />}
/>

      </Route>

    </Routes>
  );
};

export default AppRoutes;
