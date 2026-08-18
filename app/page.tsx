import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { SecurityNotice } from "@/components/SecurityNotice";

export default function LandingPage() {
  return <div className="flex min-h-screen flex-col"><SiteHeader />
    <main className="mx-auto w-full max-w-content flex-1 px-4 py-14 sm:px-6 sm:py-24">
      <span className="section-chip">Workforce</span>
      <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-6xl">AI Assisted CV Drafting</h1>
      <p className="mt-5 max-w-2xl text-xl font-semibold text-brand">Turn your military experience into a professionally written CV.</p>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">Designed for serving and retired military professionals. Enter your career information and let AI organise, strengthen and translate your experience without inventing facts.</p>
      <div className="mt-8"><Link className="btn-primary" href="/create">Start My CV</Link></div>
      <ul className="mt-8 grid max-w-2xl gap-3 text-sm text-ink-soft sm:grid-cols-3"><li>No registration required</li><li>No CV database</li><li>PDF and editable Word</li></ul>
      <div className="mt-10 max-w-3xl"><SecurityNotice /></div>
    </main><SiteFooter /></div>;
}
