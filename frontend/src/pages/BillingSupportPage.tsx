import { useTranslation } from "react-i18next";

const BillingSupportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">Billing Support</h1>
          <p className="mt-2 text-lg text-blue-100">
            Understand your charges, insurance coordination, and payment options with clear hospital policies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-bold text-slate-900">What to prepare</h2>
            <ul className="mt-3 space-y-2 text-base text-slate-700">
              <li>Government ID or passport</li>
              <li>Insurance card and policy number (if insured)</li>
              <li>Physician orders or visit confirmation</li>
              <li>Any pre-authorization reference numbers</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Payment & coverage</h2>
            <ul className="mt-3 space-y-2 text-base text-slate-700">
              <li>Insurance billed first when active and authorized.</li>
              <li>Co-pays, deductibles, and non-covered services collected at service.</li>
              <li>We accept cards, cash, and bank transfers.</li>
              <li>Estimates available before elective procedures.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Hospital billing policy</h2>
          <ul className="mt-3 space-y-2 text-base text-slate-700">
            <li>Invoices itemize rooms, procedures, imaging, labs, pharmacy, and professional fees.</li>
            <li>Emergency care is prioritized; financial counseling follows stabilization.</li>
            <li>Refunds processed within 10 business days after overpayments are verified.</li>
            <li>Disputes or clarifications can be opened within 30 days of invoice receipt.</li>
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Need help now?</h3>
            <p className="mt-2 text-base text-slate-700">
              Call our billing desk for balances, receipts, or payment plans. We can coordinate directly with your insurer.
            </p>
            <p className="mt-2 text-base font-semibold text-blue-900">Billing Desk: {t("common.hotlineNumber")}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Submit documents</h3>
            <p className="mt-2 text-base text-slate-700">
              Email ID copies, insurance cards, or pre-authorizations to our billing office for faster verification.
            </p>
            <p className="mt-2 text-base font-semibold text-blue-900">billing@horizonhospital.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSupportPage;
