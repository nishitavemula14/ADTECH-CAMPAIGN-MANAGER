import {Navigate , Route, Routes } from "react-router-dom";
import AppLayout from "../Components/templates/appLayout.jsx";
import AdminDashboard from "../Components/pages/admin-Dashboard.jsx";
import CampaignDetail from "../Components/pages/campaign-Details.jsx";
import CampaignList from "../Components/pages/campaign-List.jsx";
import CreateCampaign from "../Components/pages/create-Campaign.jsx";
import Dashboard from "../Components/pages/campaign-Dashboard.jsx";
import EditCampaign from "../Components/pages/campaign-Edit.jsx";
import Login from "../Components/pages/login.jsx";
import Signup from "../Components/pages/signup.jsx";
import UserManagement from "../Components/pages/user-Management.jsx";
import { useAuth } from "../auth/useAuth.js";
import { ProtectedRoute } from "./protectedRoute.jsx";

function HomeRoute() {
  const { currentUser } = useAuth();

  if (["admin", "superadmin"].includes(currentUser?.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <Dashboard />;
}

export default function AppRoutes() {
    return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomeRoute />} />
              <Route path="campaigns" element={<CampaignList />} />
              <Route path="campaigns/new" element={<CreateCampaign />} />
              <Route path="campaigns/:campaignId/edit" element={<EditCampaign />} />
              <Route path="campaigns/:campaignId" element={<CampaignDetail />} />
              <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route
                  path="admin-monitor"
                  element={<AdminDashboard showAnalytics={false} />}
                />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
                <Route
                  path="super-admin"
                  element={<AdminDashboard showAnalytics={false} />}
                />
                <Route path="user-management" element={<UserManagement />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        
    );
    
}
