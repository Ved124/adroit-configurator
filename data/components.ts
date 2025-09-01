
export type Spec = Record<string, string | number | boolean>
export type Option = {
  id: string
  title: string
  spec: Spec
  priceUSD: number
  image: string
}
export type Category = {
  id: string
  name: string
  description?: string
  selectLimit: number // 1 = single select; >1 or 0 means multi-select unlimited
  required?: boolean
  options: Option[]
}

export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 83.0,
  GBP: 0.79
}

export const CATEGORIES: Category[] = [
  {
    id: "extruder",
    name: "Extruder",
    description: "Main extruder with screw, barrel and drive.",
    selectLimit: 1,
    required: true,
    options: [
      { id: "ex-45-28", title: "45mm • 28:1", spec: { "Screw Ø": "45 mm", "L/D": "28:1", "Motor": "AC", "Output": "60 kg/h" }, priceUSD: 18000, image: "/images/extruder.svg" },
      { id: "ex-55-30", title: "55mm • 30:1", spec: { "Screw Ø": "55 mm", "L/D": "30:1", "Motor": "AC", "Output": "90 kg/h" }, priceUSD: 23000, image: "/images/extruder.svg" },
      { id: "ex-65-30", title: "65mm • 30:1", spec: { "Screw Ø": "65 mm", "L/D": "30:1", "Motor": "PMSM", "Output": "140 kg/h" }, priceUSD: 32000, image: "/images/extruder.svg" },
      { id: "ex-75-33", title: "75mm • 33:1", spec: { "Screw Ø": "75 mm", "L/D": "33:1", "Motor": "PMSM", "Output": "220 kg/h" }, priceUSD: 45000, image: "/images/extruder.svg" },
    ]
  },
  {
    id: "screen-changer",
    name: "Screen Changer",
    selectLimit: 1,
    options: [
      { id: "sc-manual-80", title: "Manual • Ø80", spec: { "Type": "Manual", "Screen Ø": "80 mm" }, priceUSD: 3500, image: "/images/screen-changer.svg" },
      { id: "sc-hyd-100", title: "Hydraulic • Ø100", spec: { "Type": "Hydraulic", "Screen Ø": "100 mm" }, priceUSD: 6500, image: "/images/screen-changer.svg" },
      { id: "sc-auto-120", title: "Continuous • Ø120", spec: { "Type": "Continuous", "Screen Ø": "120 mm" }, priceUSD: 11500, image: "/images/screen-changer.svg" },
    ]
  },
  {
    id: "melt-pump",
    name: "Melt Pump",
    selectLimit: 1,
    options: [
      { id: "mp-50", title: "50 cc/rev", spec: { "Displacement": "50 cc/rev", "Max Pressure": "25 MPa" }, priceUSD: 5200, image: "/images/melt-pump.svg" },
      { id: "mp-80", title: "80 cc/rev", spec: { "Displacement": "80 cc/rev", "Max Pressure": "25 MPa" }, priceUSD: 6800, image: "/images/melt-pump.svg" },
      { id: "mp-120", title: "120 cc/rev", spec: { "Displacement": "120 cc/rev", "Max Pressure": "25 MPa" }, priceUSD: 8200, image: "/images/melt-pump.svg" },
    ]
  },
  {
    id: "die-head",
    name: "Die Head",
    selectLimit: 1,
    required: true,
    options: [
      { id: "die-150-mono", title: "Mono • Ø150", spec: { "Type": "Monolayer", "Die Ø": "150 mm" }, priceUSD: 14500, image: "/images/die-head.svg" },
      { id: "die-200-aba", title: "ABA • Ø200", spec: { "Type": "ABA (3-Layer)", "Die Ø": "200 mm", "Rotary": "Yes" }, priceUSD: 26000, image: "/images/die-head.svg" },
      { id: "die-250-abc", title: "ABC • Ø250", spec: { "Type": "ABC (3-Layer)", "Die Ø": "250 mm", "Rotary": "Yes" }, priceUSD: 33000, image: "/images/die-head.svg" },
    ]
  },
  {
    id: "air-ring",
    name: "Air Ring",
    selectLimit: 1,
    options: [
      { id: "ar-single", title: "Single Lip", spec: { "Lip": "Single" }, priceUSD: 4200, image: "/images/air-ring.svg" },
      { id: "ar-double", title: "Double Lip", spec: { "Lip": "Double" }, priceUSD: 8200, image: "/images/air-ring.svg" },
      { id: "ar-dual-cooling", title: "Dual Cooling High Output", spec: { "Lip": "Double", "Cooling": "Dual" }, priceUSD: 12500, image: "/images/air-ring.svg" },
    ]
  },
  {
    id: "ibc",
    name: "IBC System",
    selectLimit: 1,
    options: [
      { id: "ibc-none", title: "No IBC", spec: { "IBC": false }, priceUSD: 0, image: "/images/ibc-system.svg" },
      { id: "ibc-standard", title: "IBC Standard", spec: { "IBC": true, "Sensors": "Pressure + Temp" }, priceUSD: 9800, image: "/images/ibc-system.svg" },
      { id: "ibc-advanced", title: "IBC Advanced", spec: { "IBC": true, "Sensors": "Pressure + Temp + Flow", "Auto Control": true }, priceUSD: 14800, image: "/images/ibc-system.svg" },
    ]
  },
  {
    id: "bubble-cage",
    name: "Bubble Cage",
    selectLimit: 1,
    options: [
      { id: "bc-none", title: "No Cage", spec: { "Stages": 0 }, priceUSD: 0, image: "/images/bubble-cage.svg" },
      { id: "bc-3stage", title: "3-Stage", spec: { "Stages": 3 }, priceUSD: 1900, image: "/images/bubble-cage.svg" },
      { id: "bc-5stage", title: "5-Stage", spec: { "Stages": 5 }, priceUSD: 2900, image: "/images/bubble-cage.svg" },
    ]
  },
  {
    id: "osc-hauloff",
    name: "Oscillating Haul-Off",
    selectLimit: 1,
    options: [
      { id: "oh-none", title: "Fixed", spec: { "Oscillating": false }, priceUSD: 0, image: "/images/oscillating-haul-off.svg" },
      { id: "oh-osc", title: "Oscillating", spec: { "Oscillating": true }, priceUSD: 6400, image: "/images/oscillating-haul-off.svg" },
    ]
  },
  {
    id: "nip",
    name: "Haul-Off Nip",
    selectLimit: 1,
    options: [
      { id: "nip-1000", title: "1000 mm", spec: { "Web Width": "1000 mm" }, priceUSD: 5200, image: "/images/haul-off-nip.svg" },
      { id: "nip-1500", title: "1500 mm", spec: { "Web Width": "1500 mm" }, priceUSD: 6500, image: "/images/haul-off-nip.svg" },
      { id: "nip-2000", title: "2000 mm", spec: { "Web Width": "2000 mm" }, priceUSD: 8200, image: "/images/haul-off-nip.svg" },
    ]
  },
  {
    id: "thickness",
    name: "Thickness Gauge",
    selectLimit: 1,
    options: [
      { id: "tg-none", title: "No Gauge", spec: {}, priceUSD: 0, image: "/images/thickness-gauge.svg" },
      { id: "tg-basic", title: "Capacitive", spec: { "Type": "Capacitive" }, priceUSD: 9800, image: "/images/thickness-gauge.svg" },
      { id: "tg-beta", title: "Beta Gauge", spec: { "Type": "Beta" }, priceUSD: 16500, image: "/images/thickness-gauge.svg" },
    ]
  },
  {
    id: "corona",
    name: "Corona Treater",
    selectLimit: 1,
    options: [
      { id: "ct-1000", title: "1000 mm • 2 kW", spec: { "Effective Width": "1000 mm", "Power": "2 kW" }, priceUSD: 3200, image: "/images/corona-treater.svg" },
      { id: "ct-1500", title: "1500 mm • 3 kW", spec: { "Effective Width": "1500 mm", "Power": "3 kW" }, priceUSD: 4200, image: "/images/corona-treater.svg" },
    ]
  },
  {
    id: "winder",
    name: "Winder",
    selectLimit: 1,
    required: true,
    options: [
      { id: "wind-surface", title: "Surface Winder", spec: { "Type": "Surface", "Max Ø": "800 mm" }, priceUSD: 12500, image: "/images/winder.svg" },
      { id: "wind-center", title: "Center Winder", spec: { "Type": "Center", "Max Ø": "1000 mm" }, priceUSD: 15500, image: "/images/winder.svg" },
      { id: "wind-gap", title: "Gap Winder", spec: { "Type": "Gap", "Max Ø": "1000 mm" }, priceUSD: 18500, image: "/images/winder.svg" },
    ]
  },
  {
    id: "tower",
    name: "Tower/Frame",
    selectLimit: 1,
    options: [
      { id: "tw-6m", title: "6 m", spec: { "Height": "6 m" }, priceUSD: 4200, image: "/images/tower-frame.svg" },
      { id: "tw-8m", title: "8 m", spec: { "Height": "8 m" }, priceUSD: 5200, image: "/images/tower-frame.svg" },
      { id: "tw-10m", title: "10 m", spec: { "Height": "10 m" }, priceUSD: 6800, image: "/images/tower-frame.svg" },
    ]
  },
  {
    id: "gravimetric",
    name: "Gravimetric Dosing",
    selectLimit: 1,
    options: [
      { id: "grav-2", title: "2-Component", spec: { "Hoppers": 2, "Capacity": "200 kg/h" }, priceUSD: 6900, image: "/images/gravimetric-dosing.svg" },
      { id: "grav-4", title: "4-Component", spec: { "Hoppers": 4, "Capacity": "250 kg/h" }, priceUSD: 9200, image: "/images/gravimetric-dosing.svg" },
      { id: "grav-6", title: "6-Component", spec: { "Hoppers": 6, "Capacity": "300 kg/h" }, priceUSD: 11200, image: "/images/gravimetric-dosing.svg" },
    ]
  },
  {
    id: "chiller",
    name: "Chiller",
    selectLimit: 1,
    options: [
      { id: "ch-10tr", title: "10 TR", spec: { "Capacity": "10 TR" }, priceUSD: 5400, image: "/images/chiller.svg" },
      { id: "ch-20tr", title: "20 TR", spec: { "Capacity": "20 TR" }, priceUSD: 8900, image: "/images/chiller.svg" },
    ]
  },
  {
    id: "air-compressor",
    name: "Air Compressor",
    selectLimit: 1,
    options: [
      { id: "ac-7bar", title: "7 bar • 5 kW", spec: { "Pressure": "7 bar", "Power": "5 kW" }, priceUSD: 2400, image: "/images/air-compressor.svg" },
      { id: "ac-10bar", title: "10 bar • 7.5 kW", spec: { "Pressure": "10 bar", "Power": "7.5 kW" }, priceUSD: 3900, image: "/images/air-compressor.svg" },
    ]
  },
  {
    id: "electrical",
    name: "Electrical Control",
    selectLimit: 1,
    options: [
      { id: "plc-basic", title: "7" HMI + PLC", spec: { "HMI": "7 inch", "PLC": "Siemens Basic" }, priceUSD: 4800, image: "/images/electrical-control.svg" },
      { id: "plc-advanced", title: "10" HMI + PLC", spec: { "HMI": "10 inch", "PLC": "Siemens Advanced" }, priceUSD: 7400, image: "/images/electrical-control.svg" },
    ]
  },
]
