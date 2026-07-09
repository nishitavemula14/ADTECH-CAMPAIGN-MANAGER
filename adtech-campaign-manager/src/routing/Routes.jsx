import {Navigate , Route, Routes } from "react-router-dom";
import AppLayout from "../Components/templates/appLayout.jsx";
import CampaignDetail from "../pages/details.jsx";
import CampaignList from "../pages/campaignList.jsx";
import CreateCampaign from "../pages/createCampaign.jsx";
import Dashboard from "../pages/dashboard.jsx";
import EditCampaign from "../pages/edit.jsx";

export default function AppRoutes() {
    return (
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="campaigns" element={<CampaignList />} />
            <Route path="campaigns/new" element={<CreateCampaign />} />
            <Route path="campaigns/:campaignId/edit" element={<EditCampaign />} />
            <Route path="campaigns/:campaignId" element={<CampaignDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>

        
    );
    
}