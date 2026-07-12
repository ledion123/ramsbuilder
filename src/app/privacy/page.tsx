import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — RAMS Generator",
  description: "How RAMS Generator handles your data under UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: July 2026</p>

        <div className="prose prose-slate prose-invert max-w-none space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Who we are</h2>
            <p>
              RAMS Generator (&quot;we&quot;, &quot;our&quot;) is an online tool that helps UK construction subcontractors
              generate CDM 2015 compliant Risk Assessment and Method Statement documents. This policy explains how we
              handle information you provide when using the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. What data we collect</h2>
            <p>When you use RAMS Generator you may provide:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Company name, address, registration number, phone, and email</li>
              <li>Project details (name, site address, principal contractor, dates)</li>
              <li>Activity descriptions and scope of works text</li>
              <li>Operative and supervisor names</li>
              <li>Emergency contact details and nearest hospital</li>
              <li>An optional company logo image (uploaded by you)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. How your data is processed</h2>
            <p>
              <strong className="text-white">No server-side storage.</strong> We do not store your form data, generated
              documents, or uploaded files on our servers after your request is processed. All data is handled
              in-memory and discarded immediately after the response is returned.
            </p>
            <p className="mt-3">
              <strong className="text-white">Browser storage.</strong> Your generated RAMS document and form input are
              saved to your browser&apos;s <code className="text-blue-400">localStorage</code> (or{" "}
              <code className="text-blue-400">sessionStorage</code> as a fallback in private browsing mode) so the
              preview and export functions work. This data stays on your device and is not transmitted to us.
            </p>
            <p className="mt-3">
              <strong className="text-white">AI generation (when API key is active).</strong> When the AI generation
              path is used, your form data (excluding any logo image) is sent to the Anthropic API to generate the
              RAMS document. Anthropic processes this data in accordance with their{" "}
              <a
                href="https://www.anthropic.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Privacy Policy
              </a>
              . Do not include personally sensitive data beyond what is necessary for the RAMS document.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Cookies and local storage</h2>
            <p>
              We do not use tracking cookies. We use browser <code className="text-blue-400">localStorage</code> and{" "}
              <code className="text-blue-400">sessionStorage</code> solely to retain your generated document within
              your browser session. You can clear this at any time by clearing your browser data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Your rights (UK GDPR)</h2>
            <p>
              Because we do not persistently store personal data on our servers, most UK GDPR rights (access,
              rectification, erasure) can be exercised by you directly by clearing your browser&apos;s local storage.
              For any queries regarding data processed via the Anthropic API, contact Anthropic directly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Contact</h2>
            <p>
              For any privacy-related queries, contact us at{" "}
              <a href="mailto:ledjo.lutaj@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                ledjo.lutaj@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
