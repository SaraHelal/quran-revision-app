import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import AddSurahPage from "../../features/memorization/pages/AddSurahPage";
import MySurahsPage from "../../features/memorization/pages/MySurahsPage";
import EditSurahPage from "../../features/memorization/pages/EditSurahPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/review" element={<div>Review</div>} />
          <Route path="/add-surah" element={<AddSurahPage />} />
          <Route path="/my-surahs" element={<MySurahsPage />} />
          <Route path="/edit-surah/:unitId" element={<EditSurahPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;