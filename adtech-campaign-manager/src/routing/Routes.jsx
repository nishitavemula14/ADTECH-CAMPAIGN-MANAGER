import {Navigate , Route, Routes } from "react-router-dom";
import AppLayout from "../Components/templates/appLayout.jsx";
import CampaignDetail from "../Components/pages/campaign-Details.jsx";
import CampaignList from "../Components/pages/campaign-List.jsx";
import CreateCampaign from "../Components/pages/create-Campaign.jsx";
import Dashboard from "../Components/pages/campaign-Dashboard.jsx";
import EditCampaign from "../Components/pages/campaign-Edit.jsx";
import Login from "../Components/pages/login.jsx";
import Signup from "../Components/pages/signup.jsx";
import { ProtectedRoute } from "./protectedRoute.jsx";

export default function AppRoutes() {
    return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="campaigns" element={<CampaignList />} />
              <Route path="campaigns/new" element={<CreateCampaign />} />
              <Route path="campaigns/:campaignId/edit" element={<EditCampaign />} />
              <Route path="campaigns/:campaignId" element={<CampaignDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        
    );
    
}
