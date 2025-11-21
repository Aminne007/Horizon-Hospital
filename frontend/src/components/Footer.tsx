import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const quickLinks = t("common.quickLinks", { returnObjects: true }) as string[];
  const filteredLinks = quickLinks.filter((item) => !["Insurance Help", "Visitor Guide", "Careers", "Research"].includes(item));
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-900 shadow-lg">
              HC
            </div>
            <div>
              <p className="text-lg font-bold">{t("common.hospitalName")}</p>
              <p className="text-sm text-slate-200">{t("common.hospitalTagline")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-base">
            <span className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white shadow-sm">
              {t("common.hotline")}: {t("common.hotlineNumber")}
            </span>
            <span className="rounded-full border border-white/20 px-4 py-2 text-white">24/7</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {filteredLinks.map((item) => {
            if (item === "Patient Stories") {
              return (
                <Link
                  key={item}
                  to="/stories"
                  className="rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/10"
                >
                  {item}
                </Link>
              );
            }
            if (item === "Billing Support") {
              return (
                <Link
                  key={item}
                  to="/billing"
                  className="rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/10"
                >
                  {item}
                </Link>
              );
            }
            return (
              <span key={item} className="rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                {item}
              </span>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-4 text-sm text-slate-300">
          © {year} {t("common.hospitalName")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
