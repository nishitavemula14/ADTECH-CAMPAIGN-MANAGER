import {Navigate , Route, Routes } from "react-router-dom";
import AppLayout from "../Components/templates/appLayout.jsx";
import CampaignDetail from "../Components/pages/details.jsx";
import CampaignList from "../Components/pages/campaignList.jsx";
import CreateCampaign from "../Components/pages/createCampaign.jsx";
import Dashboard from "../Components/pages/dashboard.jsx";
import EditCampaign from "../Components/pages/edit.jsx";

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
