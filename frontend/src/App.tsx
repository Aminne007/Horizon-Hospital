import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AboutPage from "./pages/AboutPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import BillingSupportPage from "./pages/BillingSupportPage";
import ContactPage from "./pages/ContactPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";
import DoctorsPage from "./pages/DoctorsPage";
import HomePage from "./pages/HomePage";
import PatientStoriesPage from "./pages/PatientStoriesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { DoctorSelectionProvider } from "./context/DoctorSelectionContext";

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
      <div className="flex min-h-screen w-full flex-col bg-[#f5f7fb] text-slate-900 overflow-x-hidden" dir={i18n.dir()}>
        <Header />
        <main className="flex-1 w-full pt-16 sm:pt-20">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/stories" element={<PatientStoriesPage />} />
              <Route path="/billing" element={<BillingSupportPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
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
