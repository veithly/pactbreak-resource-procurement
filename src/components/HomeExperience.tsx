"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LockKeyhole,
  ShieldAlert,
  WalletCards
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const proofSteps = [
  {
    title: "The agent selects a vendor",
    body: "RiskOps Agent compares price, SLA, risk score, and wallet allowlist before requesting spend authority."
  },
  {
    title: "CAW scopes the payment",
    body: "The Pact limits chain, token, destination, amount, and completion behavior for one procurement order."
  },
  {
    title: "The judge mutates the order",
    body: "Price or wallet substitution turns the resource purchase into a blocked overspend attempt."
  },
  {
    title: "The proof board keeps receipts",
    body: "Pact ID, denial code, tx hash, and audit counts stay visible after refresh."
  }
];

const quotes = [
  {
    quote: "This is easy to judge: buy one resource, mutate the order, inspect the boundary.",
    source: "Sponsor reviewer path"
  },
  {
    quote: "The denial is not a UI trick. It is a CAW policy response with a code.",
    source: "Technical proof path"
  },
  {
    quote: "The allowed transfer leaves a real hash, then the unsafe route gets refused.",
    source: "Demo close"
  }
];

const marqueeItems = ["Pact active", "SETH transfer", "ADDRESS_NOT_WHITELISTED", "Audit synced", "Proof stored"];

export function HomeExperience() {
  const root = useRef<HTMLElement | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = quotes[quoteIndex];
  const marquee = marqueeItems;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".hero-copy > *", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power4.out"
      });

      gsap.fromTo(
        ".proof-slab",
        { y: 36, rotate: -1.5, opacity: 0 },
        { y: 0, rotate: 0, opacity: 1, duration: 1, ease: "power4.out" }
      );

      gsap.utils.toArray<HTMLElement>(".scroll-media").forEach((item) => {
        gsap.fromTo(
          item,
          { scale: 0.86, opacity: 0.62 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
              end: "bottom 28%",
              scrub: true
            }
          }
        );
        gsap.to(item, {
          opacity: 0.28,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "bottom 34%",
            end: "bottom top",
            scrub: true
          }
        });
      });

      if (window.innerWidth > 1080) {
        ScrollTrigger.create({
          trigger: ".pin-sequence",
          start: "top 88px",
          end: "bottom bottom",
          pin: ".pin-title",
          pinSpacing: false
        });
      }
    },
    { scope: root }
  );

  return (
    <main ref={root} className="home-root overflow-x-hidden w-full max-w-full">
      <nav className="home-nav shell">
        <Link href="/" className="brand-lockup" aria-label="PactBreak home">
          <span className="brand-mark" aria-hidden="true">
            <img src="/brand/logomark.svg" alt="" />
          </span>
          <span>PactBreak Resource Procurement</span>
        </Link>
        <div className="home-nav-links">
          <Link href="/app/proof">Proof</Link>
          <Link href="/about">Architecture</Link>
          <Link className="control-button primary" href="/app/queue" data-cta-primary>
            Procure resource
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </nav>

      <section className="home-hero shell" data-hero-text>
        <div className="hero-copy">
          <h1>Compare 3 quotes. Send 1 CAW payment. CAW blocks edits.</h1>
          <p>
            RiskOps Agent selects an approved security-audit API package, attaches existing live Cobo Agentic Wallet
            payment proof, then lets a judge mutate the order into a blocked overspend or vendor-switch attempt.
          </p>
          <div className="hero-actions">
            <Link className="control-button primary" href="/app/queue" data-cta-primary>
              Procure resource
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link className="control-button" href="/app/proof">
              Open proof board
              <ClipboardCheck size={18} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="proof-slab" aria-label="Live CAW proof summary">
          <div className="proof-slab-top">
            <span>CAW boundary</span>
            <BadgeCheck size={18} aria-hidden />
          </div>
          <div className="proof-route">
            <span>Vendor quote</span>
            <span>CAW Pact</span>
            <span>Judge mutation</span>
            <span>Proof board</span>
          </div>
          <div className="proof-hash mono">0xae5e23759f56182d286a89ef55161e5e6af517e963e1f83a6e37d14f30c3e0ea</div>
          <div className="proof-slab-grid">
            <div>
              <strong>allowed</strong>
              <span>safe transfer signed</span>
            </div>
            <div>
              <strong>denied</strong>
              <span>address not whitelisted</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-marquee" aria-label="Proof states">
        <div>
          {marquee.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="home-bento shell">
        <article className="bento-card bento-large group">
          <div>
            <LockKeyhole size={24} aria-hidden />
            <h2>One narrow authority, four visible checkpoints</h2>
          </div>
          <p>
            The product shows the full commerce path: quote selection, CAW-scoped payment, mutated order, and saved
            evidence. Nothing depends on a hidden happy path.
          </p>
        </article>
        <article className="bento-card bento-tall group scroll-media">
          <ShieldAlert size={24} aria-hidden />
          <h3>Vendor substitution</h3>
          <p>CAW returns `ADDRESS_NOT_WHITELISTED` when the transfer leaves the pact boundary.</p>
        </article>
        <article className="bento-card bento-tall group scroll-media">
          <WalletCards size={24} aria-hidden />
          <h3>Approved purchase</h3>
          <p>The approved path signs and later resolves to a real Sepolia ETH transaction hash.</p>
        </article>
        <article className="bento-card bento-wide group">
          <h3>Reviewer scan</h3>
          <p>Every route uses the same nouns: vendor, order, pact, denial, receipt, audit. The judge never has to decode a dashboard.</p>
        </article>
        <article className="bento-card bento-wide group">
          <h3>Durable proof</h3>
          <p>Local storage keeps the run trace. Existing live CAW evidence is labeled separately from imported proof.</p>
        </article>
      </section>

      <section className="home-accordion shell">
        {proofSteps.map((step, index) => (
          <article key={step.title} className="accordion-slice">
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="pin-sequence shell">
        <div className="pin-title">
        <h2>The procurement path keeps moving after the first click.</h2>
        <p>Each panel is a different product surface, not another marketing claim.</p>
        </div>
        <div className="pin-cards">
          {proofSteps.map((step, index) => (
            <article key={step.title} className="pin-card scroll-media">
              <div className="pin-card-media" aria-hidden="true" />
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-quote shell">
        <div className="quote-portraits" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <blockquote>
          <p>{quote.quote}</p>
          <footer>{quote.source}</footer>
        </blockquote>
        <div className="quote-controls" aria-label="Proof quote controls">
          <button
            type="button"
            className="min-h-12 min-w-12"
            onClick={() => setQuoteIndex((current) => (current + quotes.length - 1) % quotes.length)}
            aria-label="Previous proof quote"
            title="Previous proof quote"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            className="min-h-12 min-w-12"
            onClick={() => setQuoteIndex((current) => (current + 1) % quotes.length)}
            aria-label="Next proof quote"
            title="Next proof quote"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </section>

      <section className="home-action shell">
        <h2>Mutate the agent purchase in under a minute.</h2>
        <p>Then open the proof packet and verify the CAW boundary yourself.</p>
        <Link className="control-button primary" href="/app/queue">
          Start procurement
          <ArrowRight size={18} aria-hidden />
        </Link>
      </section>
    </main>
  );
}
