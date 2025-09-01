
# Adroit Extrusion — Blown Film Machine Configurator

A professional 3-pane configurator (like a 2D car configurator) for building blown film lines with images, technical specs, and instant pricing. Includes PDF export, JSON save/load, local persistence, and is deploy-ready on **Vercel**.

## What you get
- **Left panel**: component catalog with images, search, currency selector.
- **Middle panel**: your selections (quantities editable).
- **Right panel**: totals (tax, freight, discount), note field, **PDF** export, save/load JSON.
- **Data first**: all components/specs/prices are in `data/components.ts`.
- **Assets**: images live under `public/images`. A company logo is under `public/logo.jpg`.
- **No servers required**: everything runs on the client; easy Vercel deploy.

---

## 1) Prerequisites
- Node.js 18+ (https://nodejs.org)
- (Optional) Git installed

## 2) Setup locally
```bash
# unzip the project
cd adroit-configurator

# install dependencies
npm install

# run locally
npm run dev
# open http://localhost:3000
```

## 3) Add/modify components
Open `data/components.ts`. Each `Category` is a section in the catalog. Example:

```ts
{
  id: "extruder",
  name: "Extruder",
  selectLimit: 1, // 1 = only one option can be selected
  required: true, // required for a valid build
  options: [
    {
      id: "ex-55-30",
      title: "55mm • 30:1",
      spec: { "Screw Ø": "55 mm", "L/D": "30:1", "Output": "90 kg/h" },
      priceUSD: 23000,
      image: "/images/extruder.svg"
    }
  ]
}
```

- **Images**: drop JPG/PNG/SVG into `public/images` and update the `image` path.
- **Prices**: are stored in **USD**. The UI converts using the simple rates map in `CURRENCY_RATES`. Update those constants to your needs.
- **Multi‑select**: set `selectLimit` to `0` or any number >1 to allow multiple items from a category.
- **Required**: set `required: true` if you want to enforce at least one option picked by users (UI badges only).

## 4) PDF Export
Click **PDF** in the Estimate panel. A professional A4 PDF is generated containing line items and totals. The PDF embeds your logo from `/public/logo.jpg`. Edit the logic in `app/page.tsx` (function `exportPDF`) if you want a different format.

## 5) Saving and Loading
- **Export** creates `adroit-config.json` with all selections and pricing inputs.
- **Import** restores a JSON you previously exported.
- The app also saves state to the browser automatically (localStorage).

## 6) Deploy to Vercel (step-by-step)
1. Create a free account at https://vercel.com.
2. Click **New Project** → **Import**. Connect your GitHub (or use **Deploy without Git**).
3. If using GitHub:
   - Create a new repo, e.g. `adroit-configurator`.
   - Commit the project files to the repo.
   - Import the repo into Vercel and click **Deploy**.
4. If using **Deploy without Git**:
   - Click **New Project** → **Import** → **Upload** and drag the project folder.
   - Vercel auto-detects Next.js. Keep defaults and click **Deploy**.
5. Share the **live URL** with your father. He can click and use instantly.

**Build settings** (Vercel will auto-detect these):
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 18+

## 7) Replace the logo and theme
- Swap `/public/logo.jpg` with your own.
- Tailwind theme is in `tailwind.config.ts`. Colors and rounded corners can be adjusted there.

## 8) Extend ideas (nice-to-haves)
- Add **authentication** so your team sees cost price vs. customer price.
- Add a **quote number** and customer info (name, email, company) to the PDF.
- Add **multi-layer** lines (e.g., three extruders) by toggling multi-select for Extruder category.
- Connect to a backend or spreadsheet to fetch live price lists.
- Add **lead time** and **warranty** fields into the Estimate pane.

## Notes
- The included component list is a solid starting point covering common modules: extruder, die head, air ring, IBC, haul-off, winder, corona, thickness gauge, dosing, chillers, etc. Swap placeholders with your real product photos and specifications.
- Prices are for demonstration only. Replace with your actual price list.

Enjoy!
