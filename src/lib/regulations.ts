export interface RegEntry {
  id: string;
  name: string;
  shortCode: string;
  govukType: string;
  govukYear: number;
  govukNumber: number;
  lastVerified: string; // ISO date â€” update this after reviewing each regulation
}

// Central registry of every UK regulation cited by this app.
// To update: set lastVerified to today's date after confirming the regulation text
// is still current and your wording/duties reflect any amendments.
export const REGULATIONS: RegEntry[] = [
  {
    id: "hswa-1974",
    name: "Health & Safety at Work etc. Act 1974",
    shortCode: "HSWA 1974",
    govukType: "ukpga",
    govukYear: 1974,
    govukNumber: 37,
    lastVerified: "2026-06-21",
  },
  {
    id: "cdm-2015",
    name: "Construction (Design and Management) Regulations 2015",
    shortCode: "CDM 2015",
    govukType: "uksi",
    govukYear: 2015,
    govukNumber: 51,
    lastVerified: "2026-06-21",
  },
  {
    id: "mhswr-1999",
    name: "Management of Health and Safety at Work Regulations 1999",
    shortCode: "MHSWR 1999",
    govukType: "uksi",
    govukYear: 1999,
    govukNumber: 3242,
    lastVerified: "2026-06-21",
  },
  {
    id: "mhor-1992",
    name: "Manual Handling Operations Regulations 1992",
    shortCode: "MHOR 1992",
    govukType: "uksi",
    govukYear: 1992,
    govukNumber: 2793,
    lastVerified: "2026-06-21",
  },
  {
    id: "ppe-1992",
    name: "Personal Protective Equipment at Work Regulations 1992",
    shortCode: "PPE 1992",
    govukType: "uksi",
    govukYear: 1992,
    govukNumber: 2966,
    lastVerified: "2026-06-21",
  },
  {
    id: "nawr-2005",
    name: "Control of Noise at Work Regulations 2005",
    shortCode: "Noise 2005",
    govukType: "uksi",
    govukYear: 2005,
    govukNumber: 1643,
    lastVerified: "2026-06-21",
  },
  {
    id: "cvwr-2005",
    name: "Control of Vibration at Work Regulations 2005",
    shortCode: "Vibration 2005",
    govukType: "uksi",
    govukYear: 2005,
    govukNumber: 1093,
    lastVerified: "2026-06-21",
  },
  {
    id: "puwer-1998",
    name: "Provision and Use of Work Equipment Regulations 1998",
    shortCode: "PUWER 1998",
    govukType: "uksi",
    govukYear: 1998,
    govukNumber: 2306,
    lastVerified: "2026-06-21",
  },
  {
    id: "eawr-1989",
    name: "Electricity at Work Regulations 1989",
    shortCode: "EaWR 1989",
    govukType: "uksi",
    govukYear: 1989,
    govukNumber: 635,
    lastVerified: "2026-06-21",
  },
  {
    id: "coshh-2002",
    name: "Control of Substances Hazardous to Health Regulations 2002",
    shortCode: "COSHH 2002",
    govukType: "uksi",
    govukYear: 2002,
    govukNumber: 2677,
    lastVerified: "2026-06-21",
  },
  {
    id: "csr-1997",
    name: "Confined Spaces Regulations 1997",
    shortCode: "CSR 1997",
    govukType: "uksi",
    govukYear: 1997,
    govukNumber: 1713,
    lastVerified: "2026-06-21",
  },
  {
    id: "tma-2004",
    name: "Traffic Management Act 2004",
    shortCode: "TMA 2004",
    govukType: "ukpga",
    govukYear: 2004,
    govukNumber: 18,
    lastVerified: "2026-06-21",
  },
  {
    id: "loler-1998",
    name: "Lifting Operations and Lifting Equipment Regulations 1998",
    shortCode: "LOLER 1998",
    govukType: "uksi",
    govukYear: 1998,
    govukNumber: 2307,
    lastVerified: "2026-06-21",
  },
  {
    id: "riddor-2013",
    name: "Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013",
    shortCode: "RIDDOR 2013",
    govukType: "uksi",
    govukYear: 2013,
    govukNumber: 1471,
    lastVerified: "2026-06-21",
  },
  {
    id: "epa-1990",
    name: "Environmental Protection Act 1990",
    shortCode: "EPA 1990",
    govukType: "ukpga",
    govukYear: 1990,
    govukNumber: 43,
    lastVerified: "2026-06-21",
  },
  {
    id: "wahr-2005",
    name: "Work at Height Regulations 2005",
    shortCode: "WAH 2005",
    govukType: "uksi",
    govukYear: 2005,
    govukNumber: 735,
    lastVerified: "2026-06-21",
  },
  {
    id: "car-2012",
    name: "Control of Asbestos Regulations 2012",
    shortCode: "CAR 2012",
    govukType: "uksi",
    govukYear: 2012,
    govukNumber: 632,
    lastVerified: "2026-06-21",
  },
  {
    id: "bsa-2022",
    name: "Building Safety Act 2022",
    shortCode: "BSA 2022",
    govukType: "ukpga",
    govukYear: 2022,
    govukNumber: 30,
    lastVerified: "2026-06-21",
  },
  {
    id: "rrf-2005",
    name: "Regulatory Reform (Fire Safety) Order 2005",
    shortCode: "RRF 2005",
    govukType: "uksi",
    govukYear: 2005,
    govukNumber: 1541,
    lastVerified: "2026-06-21",
  },
  {
    id: "clwr-2002",
    name: "Control of Lead at Work Regulations 2002",
    shortCode: "CLWR 2002",
    govukType: "uksi",
    govukYear: 2002,
    govukNumber: 2676,
    lastVerified: "2026-06-21",
  },
  {
    id: "gsiur-1998",
    name: "Gas Safety (Installation and Use) Regulations 1998",
    shortCode: "GSIUR 1998",
    govukType: "uksi",
    govukYear: 1998,
    govukNumber: 2451,
    lastVerified: "2026-06-21",
  },
  {
    id: "epr-2016",
    name: "Environmental Permitting (England and Wales) Regulations 2016",
    shortCode: "EPR 2016",
    govukType: "uksi",
    govukYear: 2016,
    govukNumber: 1154,
    lastVerified: "2026-06-21",
  },
];

export function govukUrl(entry: RegEntry): string {
  return `https://www.legislation.gov.uk/${entry.govukType}/${entry.govukYear}/${entry.govukNumber}`;
}

export function govukDataUrl(entry: RegEntry): string {
  return `${govukUrl(entry)}/data.xml`;
}
