import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ramsgen.co.uk";

const DESCRIPTION = "Free CDM 2015 compliant Risk Assessment & Method Statement generator for UK construction subcontractors. Covers groundworks, electrical, scaffolding, plumbing, demolition and more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "RAMS Generator — CDM 2015 Compliant",
    template: "%s — RAMS Generator",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "RAMS Generator",
    title: "RAMS Generator — CDM 2015 Compliant",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RAMS Generator",
  url: SITE,
  description: "CDM 2015 compliant Risk Assessment & Method Statement generator for UK construction subcontractors",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  audience: { "@type": "Audience", audienceType: "UK construction subcontractors" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
