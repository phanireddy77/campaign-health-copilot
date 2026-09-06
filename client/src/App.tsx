import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import AdvertisersPage from "./pages/AdvertisersPage";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import LineDetailsPage from "./pages/LineDetailsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}></Route>
      <Route path="/" element={<AdvertisersPage/>}></Route>
      <Route path="/advertisers/:advertiserId/campaigns" element={<CampaignsPage/>}></Route>
      <Route path="/campaigns/:campaignId" element={<CampaignDetailsPage/>}></Route>
      <Route path="/lines/:lineId" element={<LineDetailsPage/>}></Route>
    </Routes>
  )
}

export default App;