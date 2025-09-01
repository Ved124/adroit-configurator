
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Download, Trash2, Printer, FileJson, Upload, Info } from "lucide-react";
import { CATEGORIES, CURRENCY_RATES, Category, Option } from "@/data/components";
import { formatMoney } from "@/utils/format";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Picked = { categoryId: string; option: Option; qty: number }

const DEFAULT_TAX = 0.18 // 18% GST as example, editable
const DEFAULT_CURRENCY = "USD"

export default function Page() {
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Picked[]>([]);
  const [taxRate, setTaxRate] = useState<number>(DEFAULT_TAX);
  const [freight, setFreight] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  // Load persisted state
  useEffect(() => {
    const raw = localStorage.getItem("adroit_config");
    if (raw) {
      try { 
        const parsed = JSON.parse(raw);
        setCurrency(parsed.currency ?? DEFAULT_CURRENCY);
        setSelected(parsed.selected ?? []);
        setTaxRate(parsed.taxRate ?? DEFAULT_TAX);
        setFreight(parsed.freight ?? 0);
        setDiscount(parsed.discount ?? 0);
        setNote(parsed.note ?? "");
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adroit_config", JSON.stringify({ currency, selected, taxRate, freight, discount, note }));
  }, [currency, selected, taxRate, freight, discount, note]);

  const rate = CURRENCY_RATES[currency as keyof typeof CURRENCY_RATES] ?? 1;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CATEGORIES.map(cat => ({
      ...cat,
      options: cat.options.filter(o =>
        o.title.toLowerCase().includes(q) ||
        Object.entries(o.spec).some(([k, v]) => `${k} ${v}`.toLowerCase().includes(q))
      )
    }));
  }, [search]);

  const pickOption = (categoryId: string, opt: Option) => {
    setSelected(prev => {
      const cat = CATEGORIES.find(c => c.id === categoryId)!;
      const existingIdx = prev.findIndex(p => p.categoryId === categoryId && p.option.id === opt.id);
      // For single select categories, replace any existing selection for this category
      if (cat.selectLimit === 1) {
        return [{ categoryId, option: opt, qty: 1 }, ...prev.filter(p => p.categoryId !== categoryId)];
      }
      // For multi-select, add or increment
      if (existingIdx !== -1) {
        const cp = [...prev]; cp[existingIdx].qty += 1; return cp;
      }
      return [...prev, { categoryId, option: opt, qty: 1 }];
    });
  };

  const removePick = (idx: number) => setSelected(prev => prev.filter((_, i) => i !== idx));
  const updateQty = (idx: number, qty: number) => setSelected(prev => prev.map((p, i) => i === idx ? { ...p, qty: Math.max(1, qty) } : p));

  const subtotalUSD = selected.reduce((acc, item) => acc + item.option.priceUSD * item.qty, 0);
  const subtotal = subtotalUSD * rate;
  const tax = subtotal * taxRate;
  const total = Math.max(subtotal + tax + freight - discount, 0);

  // PDF export
  const quoteRef = useRef<HTMLDivElement>(null);
  const exportPDF = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Adroit Extrusion — Blown Film Configurator Quote", 40, 48);

    // Company logo
    try {
      const img = document.querySelector('img[alt="Adroit Extrusion"]') as HTMLImageElement | null;
      if (img) {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const data = canvas.toDataURL("image/jpeg");
        doc.addImage(data, "JPEG", pageWidth - 120, 24, 80, 40);
      }
    } catch {}

    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleString()}`, 40, 68);
    doc.text(`Currency: ${currency}`, 40, 84);

    // Items table render via DOM capture
    if (quoteRef.current) {
      const cap = quoteRef.current;
      const canvas = await html2canvas(cap, { backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const w = pageWidth - 80;
      const h = canvas.height * (w / canvas.width);
      let y = 110;
      // If too long, split across pages
      const pageHeight = doc.internal.pageSize.getHeight() - 80;
      let remainingHeight = h;
      let sY = 0;
      while (remainingHeight > 0) {
        const snippet = document.createElement("canvas");
        const snipHeight = Math.min(remainingHeight, pageHeight) ;
        snippet.width = canvas.width;
        snippet.height = snipHeight;
        const sctx = snippet.getContext("2d")!;
        sctx.drawImage(canvas, 0, sY, canvas.width, snipHeight, 0, 0, canvas.width, snipHeight);
        const snipData = snippet.toDataURL("image/png");
        doc.addImage(snipData, "PNG", 40, y, w, snipHeight * (w / canvas.width));
        remainingHeight -= snipHeight;
        sY += snipHeight;
        if (remainingHeight > 0) {
          doc.addPage();
          y = 40;
        }
      }
    }

    doc.save("Adroit_Configurator_Quote.pdf");
  };

  const exportJSON = () => {
    const data = { currency, selected, taxRate, freight, discount, note };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adroit-config.json";
    a.click();
  };

  const importJSON = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(String(r.result));
        setCurrency(data.currency ?? DEFAULT_CURRENCY);
        setSelected(data.selected ?? []);
        setTaxRate(data.taxRate ?? DEFAULT_TAX);
        setFreight(data.freight ?? 0);
        setDiscount(data.discount ?? 0);
        setNote(data.note ?? "");
      } catch { alert("Invalid JSON"); }
    }
    r.readAsText(file);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* LEFT: catalog */}
      <section className="card lg:col-span-5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-white/50" />
            <input className="input pl-10" placeholder="Search components/specs..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="input max-w-28" value={currency} onChange={e=>setCurrency(e.target.value)}>
            {Object.keys(CURRENCY_RATES).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="scroll-slim h-[68vh] overflow-y-auto pr-2">
          {filtered.map((cat: Category) => (
            <div key={cat.id} className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                {cat.required && <span className="badge">Required</span>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {cat.options.map(opt => (
                  <button key={opt.id} onClick={()=>pickOption(cat.id, opt)} className="rounded-2xl border border-white/10 bg-white/5 text-left transition hover:bg-white/10">
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-2xl bg-black/20">
                      <Image src={opt.image} alt={opt.title} fill className="object-contain p-4" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{opt.title}</p>
                        <p className="text-sm text-white/70">{formatMoney(opt.priceUSD * (CURRENCY_RATES[currency as keyof typeof CURRENCY_RATES] ?? 1), currency)}</p>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-white/60">
                        {Object.entries(opt.spec).map(([k,v]) => `${k}: ${v}`).join(" • ")}
                      </p>
                      <div className="mt-2">
                        <span className="btn-primary w-full">Add</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MIDDLE: selections */}
      <section className="card lg:col-span-3 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Selected</h3>
          <button className="btn-ghost text-sm" onClick={()=>setSelected([])}><Trash2 className="mr-2 h-4 w-4" /> Clear</button>
        </div>
        <div className="scroll-slim h-[68vh] overflow-y-auto pr-2">
          {selected.length === 0 && <p className="text-white/60">Nothing yet. Pick from the left panel.</p>}
          {selected.map((item, idx) => (
            <div key={idx} className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <Image src={item.option.image} alt={item.option.title} width={80} height={60} className="rounded-lg bg-black/20 object-contain p-2" />
                <div className="flex-1">
                  <p className="font-medium">{CATEGORIES.find(c => c.id === item.categoryId)?.name}</p>
                  <p className="text-sm text-white/70">{item.option.title}</p>
                  <p className="text-xs text-white/50">{Object.entries(item.option.spec).map(([k,v]) => `${k}: ${v}`).join(" • ")}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Qty</span>
                  <input type="number" className="input w-20" value={item.qty} min={1} onChange={e=>updateQty(idx, parseInt(e.target.value||'1'))} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">
                    {formatMoney(item.option.priceUSD * rate * item.qty, currency)}
                  </span>
                  <button className="btn-ghost" onClick={()=>removePick(idx)}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT: estimate */}
      <section className="card lg:col-span-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Estimate</h3>
          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={exportPDF}><Printer className="mr-2 h-4 w-4" /> PDF</button>
            <button className="btn-ghost" onClick={exportJSON}><FileJson className="mr-2 h-4 w-4" /> Export</button>
            <label className="btn-ghost cursor-pointer">
              <Upload className="mr-2 h-4 w-4" /> Import
              <input type="file" accept="application/json" className="hidden" onChange={e=>e.target.files && importJSON(e.target.files[0])} />
            </label>
          </div>
        </div>

        <div className="scroll-slim h-[68vh] overflow-y-auto pr-2">
          <div ref={quoteRef} className="rounded-2xl bg-white p-4 text-black">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Quote Summary</p>
                <p className="text-xs text-black/60">Generated by Adroit Configurator</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-black/60">Currency</p>
                <p className="font-medium">{currency}</p>
              </div>
            </div>

            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="py-2">Item</th>
                  <th className="py-2">Spec</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {selected.map((item, idx) => (
                  <tr key={idx} className="border-b border-black/5">
                    <td className="py-2">{CATEGORIES.find(c=>c.id===item.categoryId)?.name} — {item.option.title}</td>
                    <td className="py-2">{Object.entries(item.option.spec).map(([k,v]) => `${k}: ${v}`).join(", ")}</td>
                    <td className="py-2">{item.qty}</td>
                    <td className="py-2 text-right">{formatMoney(item.option.priceUSD * rate * item.qty, currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-2 text-right font-medium">Subtotal</td>
                  <td className="py-2 text-right">{formatMoney(subtotal, currency)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 text-right font-medium">Tax ({(taxRate*100).toFixed(0)}%)</td>
                  <td className="py-2 text-right">{formatMoney(tax, currency)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 text-right font-medium">Freight/Installation</td>
                  <td className="py-2 text-right">{formatMoney(freight, currency)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 text-right font-medium">Discount</td>
                  <td className="py-2 text-right">-{formatMoney(discount, currency)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 text-right text-lg font-semibold">Total</td>
                  <td className="py-2 text-right text-lg font-semibold">{formatMoney(total, currency)}</td>
                </tr>
              </tfoot>
            </table>
            {note && <p className="mt-3 text-xs italic text-black/70">Notes: {note}</p>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-white/70">Tax Rate</span>
              <input type="number" value={taxRate} onChange={e=>setTaxRate(parseFloat(e.target.value||'0'))} step="0.01" className="input" />
              <p className="mt-1 text-xs text-white/50">e.g., 0.18 for 18%</p>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-white/70">Freight/Install</span>
              <input type="number" value={freight} onChange={e=>setFreight(parseFloat(e.target.value||'0'))} className="input" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-white/70">Discount</span>
              <input type="number" value={discount} onChange={e=>setDiscount(parseFloat(e.target.value||'0'))} className="input" />
            </label>
            <label className="block col-span-2">
              <span className="mb-1 block text-sm text-white/70">Notes on Offer</span>
              <textarea value={note} onChange={e=>setNote(e.target.value)} className="input min-h-[80px]" placeholder="Delivery, warranty, payment terms..." />
            </label>
          </div>

          <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-white/70">
            <p className="mb-1 flex items-center gap-2"><Info className="h-4 w-4" /> How to replace images:</p>
            <p>Put your photos in <code>/public/images</code> and update <code>image</code> paths inside <code>/data/components.ts</code>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
