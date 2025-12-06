// App.tsx
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AboutPage from "./pages/AboutPage";
import BillingSupportPage from "./pages/BillingSupportPage";
import ContactPage from "./pages/ContactPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";
import DoctorsPage from "./pages/DoctorsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import HomePage from "./pages/HomePage";
import PatientStoriesPage from "./pages/PatientStoriesPage";
import ResultPage from "./pages/ResultPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ServicesPage from "./pages/ServicesPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { DoctorSelectionProvider } from "./context/DoctorSelectionContext";

import ClientDashboard from "./pages/client/ClientDashboard";
import ClientResultsPage from "./pages/client/ClientResultsPage";
import ClientProfilePage from "./pages/client/ClientProfilePage";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPatientsPage from "./pages/doctor/DoctorPatientsPage";
import DoctorPatientDetailsPage from "./pages/doctor/DoctorPatientDetailsPage";
import DoctorResultsPage from "./pages/doctor/DoctorResultsPage";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserDetailsPage from "./pages/admin/AdminUserDetailsPage";
import { AdminGuard, ClientGuard, DoctorGuard } from "./components/guards";
import ClientAppLayout from "./components/layouts/ClientAppLayout";
import DoctorAppLayout from "./components/layouts/DoctorAppLayout";
import AdminAppLayout from "./components/layouts/AdminAppLayout";

const App = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <DoctorSelectionProvider>
      <div
        className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white via-slate-50 to-[#e8f2ff] text-slate-900 overflow-x-hidden"
        dir={i18n.dir()}
      >
        <Header />
        <main className="flex-1 w-full pt-16 sm:pt-20">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              {/* Login / result entry point */}
              <Route path="/result" element={<ResultPage />} />

              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/stories" element={<PatientStoriesPage />} />
              <Route path="/billing" element={<BillingSupportPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/departments/:slug" element={<DepartmentDetailPage />} />

              {/* Client app */}
              <Route
                path="/app/client"
                element={
                  <ClientGuard>
                    <ClientAppLayout />
                  </ClientGuard>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="results" element={<ClientResultsPage />} />
                <Route path="profile" element={<ClientProfilePage />} />
              </Route>

              <Route
                path="/app/doctor"
                element={
                  <DoctorGuard>
                    <DoctorAppLayout />
                  </DoctorGuard>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="patients" element={<DoctorPatientsPage />} />
                <Route path="patients/:clientId" element={<DoctorPatientDetailsPage />} />
                <Route path="results" element={<DoctorResultsPage />} />
                <Route path="profile" element={<DoctorProfilePage />} />
              </Route>

              <Route
                path="/app/admin"
                element={
                  <AdminGuard>
                    <AdminAppLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users/:userId" element={<AdminUserDetailsPage />} />
              </Route>

              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </DoctorSelectionProvider>
  );
};

export default App;
