import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-100 text-sm">
      <div className="mx-auto flex w-full max-w-6xl lg:max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-base font-bold text-slate-900 shadow-lg">
                HC
              </div>
              <div>
                <p className="text-base font-bold">{t("common.hospitalName")}</p>
                <p className="text-xs text-slate-200">{t("common.hospitalTagline")}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">Trusted specialists for every family.</p>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
              <span aria-hidden="true" className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/20">FB</span>
              <span aria-hidden="true" className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/20">TW</span>
              <span aria-hidden="true" className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/20">IN</span>
              <span aria-hidden="true" className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/20">IG</span>
            </div>
          </div>

          <div className="space-y-2 text-slate-200">
            <p className="text-sm font-bold text-white">Contact Us</p>
            <p className="text-xs leading-6 text-slate-300">1905 West Pank, Suite 9081, Horizon, CA 92006</p>
            <p className="text-xs text-slate-200">+1 (816) 963-4292</p>
            <p className="text-xs text-red-300 font-semibold">Emergency +235-5022</p>
            <p className="text-xs text-slate-200">horizoncarehospital.com</p>
          </div>

          <div className="space-y-2 text-slate-200">
            <p className="text-sm font-bold text-white">Quick Links</p>
            <div className="grid gap-2 text-xs font-semibold">
              <Link to="/about" className="hover:text-white">About Us</Link>
              <Link to="/services/primary-care" className="hover:text-white">Services</Link>
              <Link to="/doctors" className="hover:text-white">Doctors</Link>
              <Link to="/appointments" className="hover:text-white">Appointments</Link>
              <Link to="/billing" className="hover:text-white">Billing</Link>
              <Link to="/stories" className="hover:text-white">Patient Stories</Link>
            </div>
          </div>

          <div className="space-y-2 text-slate-200">
            <p className="text-sm font-bold text-white">Hours</p>
            <div className="text-xs leading-6">
              <p>Department</p>
              <p>9:00 AM - 2:00 PM</p>
              <p className="mt-2">Department</p>
              <p>9:00 AM - 2:00 PM</p>
              <p className="mt-2">Healthcare</p>
              <p>9:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4">
            <span className="hover:text-white">Privacy Policy</span>
            <span className="hover:text-white">Terms of Service</span>
          </div>
          <span>(c) {year} {t("common.hospitalName")}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
