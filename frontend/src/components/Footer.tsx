import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const quickLinks = t("common.quickLinks", { returnObjects: true }) as string[];
  const filteredLinks = quickLinks.filter((item) => !["Insurance Help", "Visitor Guide", "Careers", "Research"].includes(item));
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-100 text-sm">
      <div className="mx-auto flex w-full max-w-6xl lg:max-w-7xl flex-col gap-4 px-3 py-6 sm:px-4 sm:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-base font-bold text-slate-900 shadow-lg">
              HC
            </div>
            <div>
              <p className="text-base font-bold">{t("common.hospitalName")}</p>
              <p className="text-xs text-slate-200">{t("common.hospitalTagline")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm" />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {filteredLinks.map((item) => {
            if (item === "Patient Stories") {
              return (
                <Link
                  key={item}
                  to="/stories"
                  className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-white/10"
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
                  className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-white/10"
                >
                  {item}
                </Link>
              );
            }
            return (
              <span key={item} className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white shadow-sm">
                {item}
              </span>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-3 text-xs text-slate-300">
          (c) {year} {t("common.hospitalName")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
