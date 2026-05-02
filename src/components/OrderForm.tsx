import { useState } from "react";
import { toast } from "sonner";
import {
  User,
  Phone,
  MapPin,
  Gift,
  Mail,
  Truck,
  Tag,
  ShoppingBag,
  Calculator,
  Coins,
  CreditCard,
  Wallet,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Leaf,
} from "lucide-react";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbx1HG43UYLqcNYOmELIzCPJMuJrrgHshYNNA15kbqgZVZbUJCYjQ0rpHscmPLOUILw/exec";

type FormState = {
  name: string;
  phone: string;
  address: string;
  location: string;
  packaging: string;
  card: string;
  delivery: string;
  code: string;
  orderCost: string;
  shippingCost: string;
  total: string;
  deposit: string;
  paymentMethod: string;
  remaining: string;
  notes: string;
};

const initial: FormState = {
  name: "", phone: "", address: "", location: "", packaging: "",
  card: "", delivery: "", code: "", orderCost: "", shippingCost: "",
  total: "", deposit: "", paymentMethod: "", remaining: "", notes: "",
};

export default function OrderForm() {
  const [data, setData] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const recalc = (next: FormState): FormState => {
    const order = parseFloat(next.orderCost) || 0;
    const ship = parseFloat(next.shippingCost) || 0;
    const dep = parseFloat(next.deposit) || 0;
    const total = order + ship;
    return {
      ...next,
      total: order || ship ? total.toFixed(2) : "",
      remaining: order || ship ? (total - dep).toFixed(2) : "",
    };
  };

  const setField = <K extends keyof FormState>(k: K, v: string) =>
    setData((d) => (k === "orderCost" || k === "shippingCost" || k === "deposit"
      ? recalc({ ...d, [k]: v })
      : { ...d, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim() || !data.phone.trim()) {
      toast.error("من فضلك أدخل الاسم والرقم");
      return;
    }
    setSubmitting(true);
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      toast.success("تم إرسال الأوردر بنجاح");
      setDone(true);
      setData(initial);
      setTimeout(() => setDone(false), 4000);
    } catch {
      toast.error("حصل خطأ، حاول مرة تانية");
    } finally {
      setSubmitting(false);
    }
  };

  // Top section (single-line text fields)
  const topRows: { key: keyof FormState; label: string; Icon: any; type?: string }[] = [
    { key: "name", label: "الاسم", Icon: User },
    { key: "phone", label: "الرقم", Icon: Phone, type: "tel" },
    { key: "address", label: "العنوان بالتفصيل", Icon: MapPin },
    { key: "location", label: "اللوكيشن", Icon: MapPin, type: "url" },
    { key: "packaging", label: "التغليف", Icon: Gift },
    { key: "card", label: "عباره الكارد", Icon: Mail },
    { key: "delivery", label: "التسليم", Icon: Truck, type: "date" },
    { key: "code", label: "كود القطع", Icon: Tag },
  ];

  // Money section (with EGP prefix)
  const moneyRows: { key: keyof FormState; label: string; Icon: any; readOnly?: boolean }[] = [
    { key: "orderCost", label: "تكلفة الاوردر", Icon: ShoppingBag },
    { key: "shippingCost", label: "تكلفه الشحن", Icon: Truck },
    { key: "total", label: "المبلغ الاجمالي", Icon: Calculator, readOnly: true },
    { key: "deposit", label: "قيمه الديبوزت", Icon: Coins },
    { key: "paymentMethod", label: "طريقه الدفع", Icon: CreditCard },
    { key: "remaining", label: "المبلغ المتبقي", Icon: Wallet, readOnly: true },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-paper py-8 md:py-14">
      <form onSubmit={handleSubmit} className="container max-w-2xl">
        {/* Logo medallion */}
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-24 rounded-full bg-navy flex items-center justify-center ring-4 ring-gold/70 shadow-xl">
            <div className="absolute inset-1 rounded-full ring-1 ring-gold/40" />
            <div className="flex flex-col items-center">
              <Leaf className="h-4 w-4 text-gold -mb-0.5" />
              <span className="font-brand text-gold text-[10px] tracking-[0.2em]">I PLANT</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-10 gold-divider" />
            <h1 className="text-3xl md:text-4xl font-bold text-navy">استمارة الأوردر</h1>
            <span className="h-px w-10 gold-divider" />
          </div>
          <Leaf className="h-3 w-3 text-gold mt-2" />
        </div>

        {/* Top fields card */}
        <section className="mt-8 rounded-2xl border-2 border-gold/50 bg-cream/60 p-4 md:p-6 shadow-sm">
          <div className="divide-y divide-gold/30">
            {topRows.map((r) => (
              <FieldRow
                key={r.key}
                label={r.label}
                Icon={r.Icon}
                value={data[r.key]}
                onChange={(v) => setField(r.key, v)}
                type={r.type}
              />
            ))}
          </div>
        </section>

        {/* Decorative divider */}
        <div className="flex items-center justify-center my-6 gap-3">
          <span className="h-px w-24 gold-divider" />
          <Leaf className="h-3 w-3 text-gold" />
          <span className="h-px w-24 gold-divider" />
        </div>

        {/* Money fields */}
        <section className="rounded-2xl border-2 border-gold/50 bg-cream/60 p-4 md:p-6 shadow-sm">
          <div className="space-y-3">
            {moneyRows.map((r) => (
              <MoneyRow
                key={r.key}
                label={r.label}
                Icon={r.Icon}
                value={data[r.key]}
                onChange={(v) => setField(r.key, v)}
                readOnly={r.readOnly}
                isSelect={r.key === "paymentMethod"}
              />
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="mt-6 rounded-2xl border-2 border-gold/50 bg-cream/60 p-4 md:p-6 shadow-sm">
          <FieldRow
            label="متابعة"
            Icon={MessageCircle}
            value={data.notes}
            onChange={(v) => setField("notes", v)}
            multiline
          />
        </section>

        {/* Submit */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-10 py-3.5 text-gold font-semibold tracking-wider shadow-lg ring-2 ring-gold/60 hover:bg-navy-deep transition disabled:opacity-70 min-w-[200px]"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الإرسال...</>
            ) : done ? (
              <><CheckCircle2 className="h-4 w-4" /> تم الإرسال</>
            ) : (
              "إرسال الأوردر"
            )}
          </button>
        </div>

        {/* Footer brand */}
        <footer className="mt-12 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Leaf className="h-3 w-3 text-gold rotate-[-30deg]" />
            <span className="font-brand text-navy text-xl">I PLANT</span>
            <Leaf className="h-3 w-3 text-gold rotate-[30deg] scale-x-[-1]" />
          </div>
          <p className="font-brand text-navy/70 text-[10px] mt-1">WE PLANT HAPPINESS</p>
        </footer>
      </form>
    </div>
  );
}

/* ---------- Sub components ---------- */

function FieldRow({
  label, Icon, value, onChange, type, multiline,
}: {
  label: string;
  Icon: any;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div dir="rtl" className="flex items-stretch gap-2 sm:gap-3 py-2 sm:py-2.5">
      {/* Icon tab — far right in RTL */}
      <div className="flex items-center justify-center w-9 sm:w-11 rounded-lg bg-navy text-gold shrink-0">
        <Icon className="h-4 w-4" />
      </div>

      {/* Label */}
      <div className="flex items-center min-w-[100px] sm:min-w-[140px]">
        <span className="text-gold mx-1 sm:mx-2">/</span>
        <span className="text-navy font-semibold whitespace-nowrap text-sm sm:text-base">{label}</span>
      </div>

      {/* Input */}
      {multiline ? (
        <textarea
          dir="rtl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="flex-1 bg-transparent border-b border-dashed border-navy/30 focus:border-gold focus:outline-none px-2 py-1 text-navy text-sm sm:text-base resize-none text-right"
        />
      ) : (
        <input
          dir={type === "url" || type === "tel" ? "ltr" : "rtl"}
          type={type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 bg-transparent border-b border-dashed border-navy/30 focus:border-gold focus:outline-none px-2 py-1 text-navy text-sm sm:text-base ${type === "url" || type === "tel" ? "text-left" : "text-right"}`}
        />
      )}
    </div>
  );
}

function MoneyRow({
  label, Icon, value, onChange, readOnly, isSelect,
}: {
  label: string;
  Icon: any;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  isSelect?: boolean;
}) {
  return (
    <div dir="rtl" className="flex items-center gap-2 sm:gap-3 py-1 sm:py-0">
      {/* Icon tab — far right in RTL */}
      <div className="flex items-center justify-center w-9 sm:w-11 h-9 sm:h-10 rounded-lg bg-navy text-gold shrink-0">
        <Icon className="h-4 w-4" />
      </div>

      {/* Label */}
      <div className="flex items-center min-w-[100px] sm:min-w-[140px]">
        <span className="text-gold mx-1 sm:mx-2">/</span>
        <span className="text-navy font-semibold whitespace-nowrap text-sm sm:text-base">{label}</span>
      </div>

      {/* EGP badge (right) + input (left) */}
      <div dir="rtl" className="flex-1 flex items-stretch rounded-md overflow-hidden ring-1 ring-gold/40 bg-white/40">
        {!isSelect && (
          <span className="bg-navy text-gold text-[10px] sm:text-xs font-bold px-2 sm:px-3 flex items-center tracking-wider">
            EGP
          </span>
        )}
        {isSelect ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent px-2 sm:px-3 py-2 text-navy text-sm sm:text-base focus:outline-none text-right"
          >
            <option value="">— اختر —</option>
            <option value="Cash">كاش</option>
            <option value="InstaPay">انستا باي</option>
            <option value="Vodafone Cash">فودافون كاش</option>
            <option value="Bank Transfer">تحويل بنكي</option>
            <option value="Card">فيزا</option>
          </select>
        ) : (
          <input
            type="text"
            inputMode="decimal"
            dir="rtl"
            value={value}
            readOnly={readOnly}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 bg-transparent px-2 sm:px-3 py-2 text-navy text-sm sm:text-base focus:outline-none text-right ${readOnly ? "font-semibold" : ""}`}
          />
        )}
      </div>
    </div>
  );
}
