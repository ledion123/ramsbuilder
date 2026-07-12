import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Construction Regulation Checker",
  description:
    "Check whether CDM 2015, COSHH, PUWER, LOLER and other UK health & safety regulations are current — live check against legislation.gov.uk.",
  alternates: { canonical: "/regulations" },
  openGraph: {
    title: "UK Construction Regulation Checker",
    description:
      "Live currency check for UK construction H&S regulations against legislation.gov.uk.",
    url: "/regulations",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
