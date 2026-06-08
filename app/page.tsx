'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wind,
  Sparkles,
  LayoutDashboard,
  CheckCircle2,
  Zap,
  Layers,
  ShieldCheck,
  Palette,
  Globe,
  BarChart3,
  ArrowRight,
  FileText,
  Clock,
  MessageSquare,
  Video,
  Printer,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = 'en' | 'es' | 'fr' | 'de';

type Translations = {
  [key: string]: {
    en: string;
    es: string;
    fr: string;
    de: string;
  };
};

// ─── Translations ─────────────────────────────────────────────────────────────

const t: Translations = {
  navFeatures: {
    en: 'Features',
    es: 'Funciones',
    fr: 'Fonctionnalités',
    de: 'Funktionen',
  },
  navServices: {
    en: 'Services',
    es: 'Servicios',
    fr: 'Services',
    de: 'Dienste',
  },
  navPricing: { en: 'Pricing', es: 'Precios', fr: 'Tarifs', de: 'Preise' },
  navGetStarted: {
    en: 'Get Started',
    es: 'Comenzar',
    fr: 'Démarrer',
    de: 'Loslegen',
  },

  heroTag: {
    en: 'Creative Operations Platform',
    es: 'Plataforma de Operaciones Creativas',
    fr: "Plateforme d'Opérations Créatives",
    de: 'Kreativoperationen-Plattform',
  },
  heroH1a: {
    en: 'Design without',
    es: 'Diseño sin',
    fr: 'Design sans',
    de: 'Design ohne',
  },
  heroH1b: { en: 'limits.', es: 'límites.', fr: 'limites.', de: 'Grenzen.' },
  heroH1c: {
    en: 'Brands that',
    es: 'Marcas que',
    fr: 'Marques qui',
    de: 'Marken die',
  },
  heroH1d: { en: 'move.', es: 'avanzan.', fr: 'bougent.', de: 'wachsen.' },
  heroSub: {
    en: 'Your subscription-based creative partner. Unlimited design, web, and marketing — delivered fast, at a flat monthly rate.',
    es: 'Tu socio creativo por suscripción. Diseño, web y marketing ilimitados — entregados rápido, a tarifa mensual fija.',
    fr: 'Votre partenaire créatif par abonnement. Design, web et marketing illimités — livrés vite, à tarif mensuel fixe.',
    de: 'Ihr Abo-basierter Kreativpartner. Unbegrenztes Design, Web und Marketing — schnell geliefert, zum monatlichen Festpreis.',
  },
  heroCtaPrimary: {
    en: 'Start Creating',
    es: 'Empezar',
    fr: 'Commencer',
    de: 'Starten',
  },
  heroCtaSecond: {
    en: 'Watch Demo',
    es: 'Ver Demo',
    fr: 'Voir Démo',
    de: 'Demo ansehen',
  },

  activeWorkspace: {
    en: 'Active workspace',
    es: 'Espacio activo',
    fr: 'Espace actif',
    de: 'Aktiver Bereich',
  },
  live: { en: 'Live', es: 'En vivo', fr: 'En direct', de: 'Live' },
  taskBrand: {
    en: 'Brand identity refresh',
    es: 'Renovación de marca',
    fr: 'Refonte identité',
    de: 'Marken-Auffrischung',
  },
  taskLanding: {
    en: 'Landing page V3',
    es: 'Página de aterrizaje V3',
    fr: "Page d'accueil V3",
    de: 'Landingpage V3',
  },
  taskAd: {
    en: 'Q4 ad creatives',
    es: 'Creativos para Q4',
    fr: 'Créatifs pub Q4',
    de: 'Q4 Werbemittel',
  },
  taskEmail: {
    en: 'Email sequence copy',
    es: 'Copia de correos',
    fr: 'Séquence email',
    de: 'E-Mail-Sequenz',
  },
  avgTurnaround: {
    en: 'Avg. turnaround',
    es: 'Tiempo promedio',
    fr: 'Délai moyen',
    de: 'Ø Lieferzeit',
  },
  revisions: {
    en: 'Revisions',
    es: 'Revisiones',
    fr: 'Révisions',
    de: 'Revisionen',
  },
  avgRating: {
    en: 'Avg. rating',
    es: 'Calificación',
    fr: 'Note moyenne',
    de: 'Ø Bewertung',
  },
  design: { en: 'Design', es: 'Diseño', fr: 'Design', de: 'Design' },
  copy: { en: 'Copy', es: 'Texto', fr: 'Texte', de: 'Text' },

  trustedBy: {
    en: 'Trusted by forward-thinking brands',
    es: 'Con la confianza de marcas innovadoras',
    fr: 'Approuvé par des marques avant-gardistes',
    de: 'Vertraut von zukunftsorientierten Marken',
  },

  whyCrafterkite: {
    en: 'Why Crafterkite',
    es: 'Por qué Crafterkite',
    fr: 'Pourquoi Crafterkite',
    de: 'Warum Crafterkite',
  },
  featH2: {
    en: 'A smarter way to run creative ops',
    es: 'Una forma más inteligente de operar creativamente',
    fr: 'Une façon plus intelligente de gérer le créatif',
    de: 'Kreativarbeit smarter organisieren',
  },
  featSub: {
    en: 'No more juggling agencies, freelancers, and tools. One subscription, one team, zero friction.',
    es: 'Sin agencias, freelancers ni herramientas fragmentadas. Una suscripción, un equipo, cero fricción.',
    fr: 'Fini les agences, freelances et outils en désordre. Un abonnement, une équipe, zéro friction.',
    de: 'Schluss mit Agenturen, Freelancern und Tools. Ein Abo, ein Team, null Reibung.',
  },

  whatWeDo: {
    en: 'What We Do',
    es: 'Lo que hacemos',
    fr: 'Ce que nous faisons',
    de: 'Was wir tun',
  },
  servH2: {
    en: 'Every creative service, under one roof',
    es: 'Todos los servicios creativos, bajo un mismo techo',
    fr: 'Tous les services créatifs, sous un même toit',
    de: 'Alle Kreativleistungen aus einer Hand',
  },

  howItWorks: {
    en: 'How It Works',
    es: 'Cómo funciona',
    fr: 'Comment ça marche',
    de: 'Wie es funktioniert',
  },
  processH2: {
    en: 'Up and running in days, not months',
    es: 'En marcha en días, no en meses',
    fr: 'Opérationnel en jours, pas en mois',
    de: 'In Betrieb in Tagen, nicht Monaten',
  },

  socialProof: {
    en: 'Social Proof',
    es: 'Testimonios',
    fr: 'Témoignages',
    de: 'Referenzen',
  },
  testiH2: {
    en: 'Loved by brands that move fast',
    es: 'Amado por marcas que se mueven rápido',
    fr: 'Adoré par les marques qui bougent vite',
    de: 'Geliebt von Marken, die schnell handeln',
  },

  pricing: { en: 'Pricing', es: 'Precios', fr: 'Tarifs', de: 'Preise' },
  pricingH2: {
    en: 'Flat-rate. No surprises. Cancel anytime.',
    es: 'Tarifa fija. Sin sorpresas. Cancela cuando quieras.',
    fr: 'Tarif fixe. Sans surprises. Annulez à tout moment.',
    de: 'Festpreis. Keine Überraschungen. Jederzeit kündbar.',
  },
  monthly: { en: 'Monthly', es: 'Mensual', fr: 'Mensuel', de: 'Monatlich' },
  annual: { en: 'Annual', es: 'Anual', fr: 'Annuel', de: 'Jährlich' },
  save20: { en: 'Save 20%', es: 'Ahorra 20%', fr: '-20%', de: '20% sparen' },
  perMonth: { en: 'per month', es: 'por mes', fr: 'par mois', de: 'pro Monat' },
  mostPopular: {
    en: 'Most Popular',
    es: 'Más Popular',
    fr: 'Plus Populaire',
    de: 'Beliebteste',
  },
  getStarted: {
    en: 'Get Started',
    es: 'Comenzar',
    fr: 'Démarrer',
    de: 'Loslegen',
  },
  startFreeTrial: {
    en: 'Start Free Trial',
    es: 'Prueba Gratis',
    fr: 'Essai Gratuit',
    de: 'Gratis Testen',
  },
  talkToSales: {
    en: 'Talk to Sales',
    es: 'Hablar con ventas',
    fr: 'Parler aux ventes',
    de: 'Mit Vertrieb sprechen',
  },

  faqTitle: {
    en: "Questions? We've got answers.",
    es: '¿Preguntas? Tenemos respuestas.',
    fr: 'Questions? On a les réponses.',
    de: 'Fragen? Wir haben die Antworten.',
  },

  ctaH2: {
    en: 'Ready to build something great?',
    es: '¿Listo para construir algo grande?',
    fr: 'Prêt à construire quelque chose de grand?',
    de: 'Bereit, etwas Großes aufzubauen?',
  },
  ctaSub: {
    en: 'Join 500+ brands that grow with Crafterkite. Start with a free 7-day trial.',
    es: 'Únete a más de 500 marcas que crecen con Crafterkite. Empieza con una prueba de 7 días gratis.',
    fr: 'Rejoignez 500+ marques qui grandissent avec Crafterkite. Commencez avec un essai gratuit de 7 jours.',
    de: 'Schließen Sie sich 500+ Marken an, die mit Crafterkite wachsen. Starten Sie mit einer kostenlosen 7-Tage-Testphase.',
  },
  bookDemo: {
    en: 'Book a Demo',
    es: 'Reservar Demo',
    fr: 'Réserver une Demo',
    de: 'Demo Buchen',
  },

  footerTagline: {
    en: 'Elevating brands through structured creative operations and high-velocity design systems.',
    es: 'Elevando marcas a través de operaciones creativas estructuradas y sistemas de diseño de alta velocidad.',
    fr: 'Élevant les marques grâce à des opérations créatives structurées et des systèmes de design haute vélocité.',
    de: 'Marken durch strukturierte Kreativoperationen und Hochgeschwindigkeits-Designsysteme elevieren.',
  },
  product: { en: 'Product', es: 'Producto', fr: 'Produit', de: 'Produkt' },
  company: {
    en: 'Company',
    es: 'Empresa',
    fr: 'Entreprise',
    de: 'Unternehmen',
  },
  legal: { en: 'Legal', es: 'Legal', fr: 'Légal', de: 'Rechtliches' },
  allRightsReserved: {
    en: 'All rights reserved.',
    es: 'Todos los derechos reservados.',
    fr: 'Tous droits réservés.',
    de: 'Alle Rechte vorbehalten.',
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function T({ k, lang }: { k: string; lang: Lang }) {
  return <>{t[k]?.[lang] ?? t[k]?.en ?? k}</>;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  wide = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`relative p-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:shadow-xl transition-all duration-300 ${
        wide ? 'md:col-span-2' : ''
      }`}
    >
      <div className="absolute top-0 left-0 w-10 h-[3px] bg-orange-600 rounded-br" />
      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 mb-5">
        <span className="text-orange-600">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}

function ServiceItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative group p-10 bg-stone-950 hover:bg-stone-900 transition-colors duration-200 cursor-pointer border-b border-stone-800 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="absolute top-10 right-9 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-5 h-5 text-yellow-400" />
      </div>
      <div className="font-mono text-xs text-stone-600 mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-stone-100 mb-3">{title}</h3>
      <p className="text-sm text-stone-500 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group text-center px-4">
      <div className="w-11 h-11 rounded-full border-2 border-stone-300 dark:border-stone-700 flex items-center justify-center mx-auto mb-6 font-serif text-lg font-bold text-stone-800 dark:text-stone-200 group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-all duration-200">
        {number}
      </div>
      <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h4>
      <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  initials,
  bg,
  color,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  bg: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-7">
      <div className="text-yellow-500 text-sm mb-4">★★★★★</div>
      <blockquote className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-light italic mb-5">
        “{quote}”
      </blockquote>
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: bg, color }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {name}
          </div>
          <div className="text-xs text-stone-400">{role}</div>
        </div>
      </div>
    </div>
  );
}

function PriceCard({
  plan,
  price,
  period,
  features,
  featured = false,
  featuredLabel,
  btnLabel,
  btnStyle,
}: {
  plan: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  featuredLabel?: string;
  btnLabel: string;
  btnStyle: 'outline' | 'solid';
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 ${
        featured
          ? 'border-2 border-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.08)]'
          : 'border border-stone-200 dark:border-stone-800'
      } bg-white dark:bg-stone-900`}
    >
      {featured && featuredLabel && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          {featuredLabel}
        </div>
      )}
      <div className="font-mono text-xs text-stone-400 uppercase tracking-widest mb-4">
        {plan}
      </div>
      <div className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-100 leading-none mb-1">
        {price}
      </div>
      <div className="text-xs text-stone-400 mb-6">{period}</div>
      <div className="h-px bg-stone-200 dark:bg-stone-800 mb-5" />
      <ul className="space-y-3 mb-6">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-stone-500 dark:text-stone-400 font-light"
          >
            <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard/organizations/create-org"
        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all ${
          btnStyle === 'solid'
            ? 'bg-orange-600 text-white hover:bg-orange-700'
            : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
      >
        {btnLabel}
      </Link>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 dark:border-stone-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left text-base font-medium text-stone-900 dark:text-stone-100"
      >
        {question}
        {open ? (
          <ChevronUp className="w-5 h-5 text-stone-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-light">
          {answer}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const [dark, setDark] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(false);

  const langOptions: { code: Lang; flag: string; label: string }[] = [
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  ];

  const prices = {
    monthly: { starter: '$1,495', growth: '$2,495', scale: '$4,995' },
    annual: { starter: '$1,196', growth: '$1,996', scale: '$3,996' },
  };
  const activePrice = annualBilling ? prices.annual : prices.monthly;

  const marqueeItems = [
    'Design Subscription',
    'Unlimited Revisions',
    '48h Delivery',
    'Brand Strategy',
    'Web Development',
    'Motion Design',
    'Ad Creatives',
    'Copywriting',
    'Print & Packaging',
  ];

  return (
    <div className={dark ? 'dark' : ''}>
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-serif font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Wind className="w-4 h-4 text-white" />
              </div>
              Crafterkite
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500 dark:text-stone-400">
              <Link
                href="#features"
                className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <T k="navFeatures" lang={lang} />
              </Link>
              <Link
                href="#services"
                className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <T k="navServices" lang={lang} />
              </Link>
              <Link
                href="#pricing"
                className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <T k="navPricing" lang={lang} />
              </Link>
              <Link
                href="#faq"
                className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                FAQ
              </Link>
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  🌐 {lang.toUpperCase()} <ChevronDown className="w-3 h-3" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-[calc(100%+6px)] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl p-1.5 min-w-[130px] z-50">
                    {langOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          setLang(opt.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          lang === opt.code
                            ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                            : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        {opt.flag} {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {dark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* CTA */}
              <Link
                href="/dashboard/organizations/create-org"
                className="hidden sm:block px-5 py-2 text-sm font-semibold bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                <T k="navGetStarted" lang={lang} />
              </Link>
            </div>
          </div>
        </header>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-7 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
              <T k="heroTag" lang={lang} />
            </div>

            <h1 className="font-serif text-5xl md:text-[62px] font-black leading-[1.05] tracking-[-2px] text-stone-900 dark:text-stone-100 mb-6">
              <T k="heroH1a" lang={lang} />{' '}
              <em className="italic text-orange-600">
                <T k="heroH1b" lang={lang} />
              </em>
              <br />
              <T k="heroH1c" lang={lang} />{' '}
              <em className="italic text-orange-600">
                <T k="heroH1d" lang={lang} />
              </em>
            </h1>

            <p className="text-lg text-stone-500 dark:text-stone-400 leading-relaxed font-light max-w-md mb-9">
              <T k="heroSub" lang={lang} />
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/organizations/create-org"
                className="flex items-center gap-2 px-7 py-3.5 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-xl font-semibold text-base hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all"
              >
                <T k="heroCtaPrimary" lang={lang} />{' '}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-xl font-semibold text-base hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
              >
                <T k="heroCtaSecond" lang={lang} />{' '}
                <LayoutDashboard className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex">
                {[
                  { initials: 'JA', bg: '#D4A853', color: '#6B4A10' },
                  { initials: 'MP', bg: '#7BA8D4', color: '#1A4A70' },
                  { initials: 'SR', bg: '#A8C78F', color: '#2D5A1A' },
                ].map((av, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: av.bg,
                      color: av.color,
                      marginLeft: i > 0 ? '-6px' : 0,
                    }}
                  >
                    {av.initials}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                <T k="activeWorkspace" lang={lang} />
              </span>
              <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                <T k="live" lang={lang} />
              </span>
            </div>

            {[
              { key: 'taskBrand', done: true, tag: 'design' },
              { key: 'taskLanding', done: true, tag: 'web' },
              { key: 'taskAd', done: false, tag: 'design' },
              { key: 'taskEmail', done: false, tag: 'copy' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 py-2.5 border-b border-stone-100 dark:border-stone-800 last:border-0"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    item.done
                      ? 'bg-orange-600 border-orange-600'
                      : 'border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-sm font-medium flex-1 ${
                    item.done
                      ? 'line-through text-stone-400'
                      : 'text-stone-900 dark:text-stone-100'
                  }`}
                >
                  <T k={item.key} lang={lang} />
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    item.tag === 'design'
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400'
                      : item.tag === 'web'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                  }`}
                >
                  {item.tag === 'design' ? (
                    <T k="design" lang={lang} />
                  ) : item.tag === 'web' ? (
                    'Web'
                  ) : (
                    <T k="copy" lang={lang} />
                  )}
                </span>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800 rounded-xl overflow-hidden mt-4 border border-stone-200 dark:border-stone-800">
              {[
                { val: '48h', label: 'avgTurnaround' },
                { val: '∞', label: 'revisions' },
                { val: '4.9', label: 'avgRating' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-stone-50 dark:bg-stone-950 py-3 text-center"
                >
                  <div className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                    {s.val}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-stone-400 font-mono">
                    <T k={s.label} lang={lang} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGOS ───────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pb-16 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-7">
            <T k="trustedBy" lang={lang} />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              'Veritas',
              'Palomar',
              'Arclight',
              'Novatek',
              'Meridian',
              'Solstice',
            ].map((name) => (
              <span
                key={name}
                className="font-serif font-bold text-lg text-stone-300 dark:text-stone-700"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
        <div className="overflow-hidden border-y border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 py-4">
          <div
            className="flex gap-14 whitespace-nowrap"
            style={{
              animation: 'marquee 28s linear infinite',
              width: 'max-content',
            }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div key={i} className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-medium font-mono text-stone-500 dark:text-stone-400">
                  {item}
                </span>
                <span className="w-1 h-1 rounded-full bg-orange-600" />
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-xs font-mono uppercase tracking-widest text-orange-600 mb-4">
            <T k="whyCrafterkite" lang={lang} />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-stone-100 mb-4 leading-tight">
            <T k="featH2" lang={lang} />
          </h2>
          <p className="text-base text-stone-500 dark:text-stone-400 font-light max-w-lg mb-14">
            <T k="featSub" lang={lang} />
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard
              wide
              icon={<Layers className="w-5 h-5" />}
              title={t['navFeatures'][lang]}
              description={
                lang === 'es'
                  ? 'Nuestro onboarding guiado captura el ADN de tu marca desde el primer día. Sin ida y vuelta en los briefs.'
                  : lang === 'fr'
                  ? "Notre onboarding guidé capture l'ADN de votre marque dès le premier jour. Fini les allers-retours de brief."
                  : lang === 'de'
                  ? 'Unser geführtes Onboarding erfasst Ihre Marken-DNA vom ersten Tag an. Kein Brief-Hin-und-Her mehr.'
                  : 'Our guided onboarding captures your brand DNA — fonts, colors, tone, audience — so every deliverable is on-brand from day one. No briefing back-and-forth, ever again.'
              }
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title={
                lang === 'es'
                  ? 'Una Cola de Solicitudes'
                  : lang === 'fr'
                  ? "File d'attente unique"
                  : lang === 'de'
                  ? 'Einzelne Warteschlange'
                  : 'One Request Queue'
              }
              description={
                lang === 'es'
                  ? 'Envía, prioriza y rastrea cada solicitud desde un panel único. Sin emails, sin caos de Slack.'
                  : lang === 'fr'
                  ? 'Soumettez, priorisez et suivez chaque demande depuis un tableau de bord unique.'
                  : lang === 'de'
                  ? 'Einreichen, priorisieren und verfolgen Sie jede Anfrage über ein einziges Dashboard.'
                  : 'Submit, prioritize, and track every creative request from a single dashboard. No emails, no Slack chaos.'
              }
            />
            <FeatureCard
              icon={<ShieldCheck className="w-5 h-5" />}
              title={
                lang === 'es'
                  ? 'Equipo Sénior Dedicado'
                  : lang === 'fr'
                  ? 'Équipe Senior Dédiée'
                  : lang === 'de'
                  ? 'Dediziertes Senior-Team'
                  : 'Dedicated Senior Team'
              }
              description={
                lang === 'es'
                  ? 'Trabajas con diseñadores sénior, no juniors subcontratados. Expertos reales que entienden tu marca.'
                  : lang === 'fr'
                  ? 'Vous travaillez avec des seniors, pas des juniors externalisés. De vrais experts qui comprennent votre marque.'
                  : lang === 'de'
                  ? 'Sie arbeiten mit Senior-Designern, nicht ausgelagerten Junioren.'
                  : 'You work with senior designers and strategists, not outsourced juniors. Real experts who understand your brand deeply.'
              }
            />
            <FeatureCard
              icon={<Clock className="w-5 h-5" />}
              title={
                lang === 'es'
                  ? 'Entrega en 48h'
                  : lang === 'fr'
                  ? 'Livraison en 48h'
                  : lang === 'de'
                  ? '48h Lieferzeit'
                  : '48h Turnaround'
              }
              description={
                lang === 'es'
                  ? 'La mayoría de solicitudes en 1–2 días hábiles. Los proyectos complejos tienen desglose de hitos.'
                  : lang === 'fr'
                  ? 'La plupart des demandes en 1–2 jours ouvrés.'
                  : lang === 'de'
                  ? 'Die meisten Anfragen in 1–2 Werktagen erledigt.'
                  : "Most requests completed in 1–2 business days. Complex projects get milestone breakdowns so you always know what's next."
              }
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title={
                lang === 'es'
                  ? 'Revisiones Ilimitadas'
                  : lang === 'fr'
                  ? 'Révisions Illimitées'
                  : lang === 'de'
                  ? 'Unbegrenzte Revisionen'
                  : 'Unlimited Revisions'
              }
              description={
                lang === 'es'
                  ? 'Iteramos hasta que te encante. Sin cargos extra, sin límites pasivo-agresivos.'
                  : lang === 'fr'
                  ? "On itère jusqu'à ce que vous l'aimiez. Pas de frais supplémentaires."
                  : lang === 'de'
                  ? 'Wir iterieren, bis Sie es lieben. Keine Zusatzkosten, keine passiv-aggressiven Revisionslimits.'
                  : 'We iterate until you love it. No extra charges, no passive-aggressive revision limits. Your satisfaction is the only metric.'
              }
            />
          </div>
        </section>

        {/* ── SERVICES ────────────────────────────────────────────────────── */}
        <section id="services" className="bg-stone-950 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-widest text-yellow-400 mb-4">
              <T k="whatWeDo" lang={lang} />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-stone-100 mb-4 leading-tight">
              <T k="servH2" lang={lang} />
            </h2>
          </div>

          <div className="max-w-6xl mx-auto mt-14 grid md:grid-cols-2 border border-stone-800 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-stone-800">
            {[
              {
                num: '01',
                titleKey: 'Brand Identity',
                descKey:
                  'Logo systems, typography, color palettes, brand guidelines. Build a brand that tells a story at every touchpoint.',
              },
              {
                num: '02',
                titleKey: 'Web Design & Dev',
                descKey:
                  'From landing pages to full Webflow/Next.js builds. Fast, accessible, conversion-optimized.',
              },
              {
                num: '03',
                titleKey: 'Ad Creatives',
                descKey:
                  'Meta, Google, LinkedIn, TikTok. High-volume creative production built to perform at every stage of the funnel.',
              },
              {
                num: '04',
                titleKey: 'Motion & Video',
                descKey:
                  'Animated logos, explainer videos, social reels, and UI motion. We make your brand come alive in every format.',
              },
              {
                num: '05',
                titleKey: 'Copywriting',
                descKey:
                  'Website copy, email sequences, ad scripts, social captions. Words that sound like you — only sharper.',
              },
              {
                num: '06',
                titleKey: 'Print & Packaging',
                descKey:
                  'Business cards, packaging, pitch decks, billboards. We bridge digital and physical brand presence.',
              },
            ].map((s) => (
              <ServiceItem
                key={s.num}
                number={s.num}
                title={s.titleKey}
                description={s.descKey}
              />
            ))}
          </div>
        </section>

        {/* ── PROCESS ─────────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-orange-600 mb-4">
              <T k="howItWorks" lang={lang} />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
              <T k="processH2" lang={lang} />
            </h2>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-[22px] left-[calc(100%/8)] right-[calc(100%/8)] h-px border-t-2 border-dashed border-stone-300 dark:border-stone-700 z-0" />
            {[
              {
                n: '1',
                titleKey:
                  lang === 'es'
                    ? 'Suscríbete'
                    : lang === 'fr'
                    ? 'Abonnez-vous'
                    : lang === 'de'
                    ? 'Abonnieren'
                    : 'Subscribe',
                descKey:
                  lang === 'es'
                    ? 'Elige tu plan e incorpora en minutos. Sin contratos.'
                    : lang === 'fr'
                    ? 'Choisissez votre plan et embarquez en minutes. Sans contrat.'
                    : lang === 'de'
                    ? 'Plan wählen, in Minuten einsteigen.'
                    : 'Choose your plan and onboard in minutes. No contracts, cancel anytime.',
              },
              {
                n: '2',
                titleKey:
                  lang === 'es'
                    ? 'Incorporación'
                    : lang === 'fr'
                    ? 'Onboarding'
                    : lang === 'de'
                    ? 'Onboarding'
                    : 'Brand Onboarding',
                descKey:
                  lang === 'es'
                    ? 'Completa nuestro flujo inteligente. Sincronizamos visión y lenguaje visual.'
                    : lang === 'fr'
                    ? 'Remplissez notre formulaire. On synchronise vision et langage visuel.'
                    : lang === 'de'
                    ? 'Füllen Sie unseren Smart-Intake aus.'
                    : 'Complete our smart intake flow. We sync on vision, voice, and visual language.',
              },
              {
                n: '3',
                titleKey:
                  lang === 'es'
                    ? 'Envía Solicitudes'
                    : lang === 'fr'
                    ? 'Soumettez'
                    : lang === 'de'
                    ? 'Einreichen'
                    : 'Submit Requests',
                descKey:
                  lang === 'es'
                    ? 'Usa nuestro panel para encolar solicitudes ilimitadas.'
                    : lang === 'fr'
                    ? 'Utilisez notre tableau de bord pour soumettre des demandes illimitées.'
                    : lang === 'de'
                    ? 'Dashboard nutzen, um unbegrenzte Anfragen einzureichen.'
                    : 'Use our dashboard or Notion to queue unlimited requests. Prioritize freely.',
              },
              {
                n: '4',
                titleKey:
                  lang === 'es'
                    ? 'Revisa y Escala'
                    : lang === 'fr'
                    ? 'Révisez & Scalez'
                    : lang === 'de'
                    ? 'Überprüfen & Skalieren'
                    : 'Review & Scale',
                descKey:
                  lang === 'es'
                    ? 'Aprueba, solicita revisiones o envía directamente.'
                    : lang === 'fr'
                    ? 'Approuvez, demandez des révisions ou livrez directement.'
                    : lang === 'de'
                    ? 'Genehmigen, Revisionen anfordern oder direkt liefern.'
                    : 'Approve, request revisions, or ship directly. Your brand grows with every deliverable.',
              },
            ].map((step) => (
              <ProcessStep
                key={step.n}
                number={step.n}
                title={step.titleKey}
                description={step.descKey}
              />
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
        <section className="bg-stone-100 dark:bg-stone-900 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-widest text-orange-600 mb-4">
              <T k="socialProof" lang={lang} />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-stone-100 mb-14 leading-tight">
              <T k="testiH2" lang={lang} />
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <TestimonialCard
                quote="We replaced our entire design team overhead with Crafterkite. The quality is exceptional and the speed is unlike anything we've experienced with traditional agencies."
                name="Jordan Lee"
                role="CMO, Veritas Health"
                initials="JL"
                bg="#EDE8FC"
                color="#5B3DB5"
              />
              <TestimonialCard
                quote="From brand refresh to a full landing page in 6 days. Our conversion rate jumped 34% within the first month. Crafterkite is a secret weapon."
                name="Sofia Reyes"
                role="Founder, Arclight Studio"
                initials="SR"
                bg="#FDF0E0"
                color="#9B5C12"
              />
              <TestimonialCard
                quote="The best creative investment we've made. Senior-level talent, flat-rate pricing, and a team that actually understands our brand better than we do."
                name="Marcus Park"
                role="VP Growth, Novatek"
                initials="MP"
                bg="#E0F0FD"
                color="#0E5A9B"
              />
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────────── */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-xs font-mono uppercase tracking-widest text-orange-600 mb-4">
            <T k="pricing" lang={lang} />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-stone-100 mb-8 leading-tight">
            <T k="pricingH2" lang={lang} />
          </h2>

          {/* Billing toggle */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
              <T k="monthly" lang={lang} />
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                annualBilling
                  ? 'bg-orange-600'
                  : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  annualBilling ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
              <T k="annual" lang={lang} />
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800">
              <T k="save20" lang={lang} />
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <PriceCard
              plan="Starter"
              price={activePrice.starter}
              period={t['perMonth'][lang]}
              features={[
                lang === 'es'
                  ? '1 solicitud a la vez'
                  : lang === 'fr'
                  ? '1 demande à la fois'
                  : lang === 'de'
                  ? '1 Anfrage gleichzeitig'
                  : '1 request at a time',
                lang === 'es'
                  ? '72h tiempo promedio'
                  : lang === 'fr'
                  ? '72h délai moyen'
                  : lang === 'de'
                  ? '72h Ø Lieferzeit'
                  : '72h avg. turnaround',
                lang === 'es'
                  ? 'Diseño y texto'
                  : lang === 'fr'
                  ? 'Design & texte'
                  : lang === 'de'
                  ? 'Design & Text'
                  : 'Design & copy',
                lang === 'es'
                  ? 'Revisiones ilimitadas'
                  : lang === 'fr'
                  ? 'Révisions illimitées'
                  : lang === 'de'
                  ? 'Unbegrenzte Revisionen'
                  : 'Unlimited revisions',
              ]}
              btnLabel={t['getStarted'][lang]}
              btnStyle="outline"
            />
            <PriceCard
              plan="Growth"
              price={activePrice.growth}
              period={t['perMonth'][lang]}
              features={[
                lang === 'es'
                  ? '2 solicitudes a la vez'
                  : lang === 'fr'
                  ? '2 demandes à la fois'
                  : lang === 'de'
                  ? '2 Anfragen gleichzeitig'
                  : '2 requests at a time',
                lang === 'es'
                  ? '48h tiempo promedio'
                  : lang === 'fr'
                  ? '48h délai moyen'
                  : lang === 'de'
                  ? '48h Ø Lieferzeit'
                  : '48h avg. turnaround',
                lang === 'es'
                  ? 'Diseño, texto, web y motion'
                  : lang === 'fr'
                  ? 'Design, texte, web & motion'
                  : lang === 'de'
                  ? 'Design, Text, Web & Motion'
                  : 'Design, copy, web & motion',
                lang === 'es'
                  ? 'Canal de Slack dedicado'
                  : lang === 'fr'
                  ? 'Canal Slack dédié'
                  : lang === 'de'
                  ? 'Dedizierter Slack-Kanal'
                  : 'Dedicated Slack channel',
                lang === 'es'
                  ? 'Soporte prioritario'
                  : lang === 'fr'
                  ? 'Support prioritaire'
                  : lang === 'de'
                  ? 'Prioritätssupport'
                  : 'Priority support',
              ]}
              featured
              featuredLabel={t['mostPopular'][lang]}
              btnLabel={t['startFreeTrial'][lang]}
              btnStyle="solid"
            />
            <PriceCard
              plan="Scale"
              price={activePrice.scale}
              period={t['perMonth'][lang]}
              features={[
                lang === 'es'
                  ? 'Solicitudes paralelas ilimitadas'
                  : lang === 'fr'
                  ? 'Demandes parallèles illimitées'
                  : lang === 'de'
                  ? 'Unbegrenzte parallele Anfragen'
                  : 'Unlimited parallel requests',
                lang === 'es'
                  ? '24h tiempo promedio'
                  : lang === 'fr'
                  ? '24h délai moyen'
                  : lang === 'de'
                  ? '24h Ø Lieferzeit'
                  : '24h avg. turnaround',
                lang === 'es'
                  ? 'Todos los servicios + estrategia'
                  : lang === 'fr'
                  ? 'Tous services + stratégie'
                  : lang === 'de'
                  ? 'Alle Dienste + Strategie'
                  : 'All services + strategy',
                lang === 'es'
                  ? 'Director creativo dedicado'
                  : lang === 'fr'
                  ? 'Directeur créatif dédié'
                  : lang === 'de'
                  ? 'Dedizierter Creative Director'
                  : 'Dedicated creative director',
                lang === 'es'
                  ? 'Llamadas semanales de estrategia'
                  : lang === 'fr'
                  ? 'Appels stratégie hebdomadaires'
                  : lang === 'de'
                  ? 'Wöchentliche Strategie-Calls'
                  : 'Weekly strategy calls',
              ]}
              btnLabel={t['talkToSales'][lang]}
              btnStyle="outline"
            />
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" className="max-w-2xl mx-auto px-6 py-24">
          <div className="text-xs font-mono uppercase tracking-widest text-orange-600 mb-4">
            FAQ
          </div>
          <h2 className="font-serif text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100 mb-12 leading-tight">
            <T k="faqTitle" lang={lang} />
          </h2>
          <div>
            {[
              {
                q:
                  lang === 'es'
                    ? '¿En qué se diferencia de contratar un freelancer?'
                    : lang === 'fr'
                    ? "En quoi est-ce différent d'un freelance?"
                    : lang === 'de'
                    ? 'Was ist der Unterschied zu einem Freelancer?'
                    : 'How is this different from hiring a freelancer?',
                a:
                  lang === 'es'
                    ? 'Un freelancer es una persona con un conjunto de habilidades. Crafterkite es un equipo creativo completo a tarifa mensual fija. Sin reclutamiento, sin incorporación, sin brechas.'
                    : lang === 'fr'
                    ? 'Un freelance est une personne avec un ensemble de compétences. Crafterkite est une équipe créative complète à tarif mensuel fixe.'
                    : lang === 'de'
                    ? 'Ein Freelancer ist eine Person mit einem Fähigkeitenset. Crafterkite ist ein vollständiges Kreativteam zum monatlichen Festpreis.'
                    : 'A freelancer is one person with one skill set. Crafterkite is a full creative team — designers, developers, copywriters, and strategists — all coordinated for you, at a flat monthly rate.',
              },
              {
                q:
                  lang === 'es'
                    ? '¿Qué pasa si solo necesito algunos diseños al mes?'
                    : lang === 'fr'
                    ? "Et si je n'ai besoin que de quelques designs par mois?"
                    : lang === 'de'
                    ? 'Was, wenn ich nur wenige Designs pro Monat brauche?'
                    : 'What if I only need a few designs per month?',
                a:
                  lang === 'es'
                    ? 'Pausa tu suscripción y reanúdala cuando la necesites. Solo pagas los meses que usas activamente el servicio.'
                    : lang === 'fr'
                    ? "Mettez votre abonnement en pause et reprenez quand vous avez besoin. Vous ne payez que les mois d'utilisation active."
                    : lang === 'de'
                    ? 'Pausieren Sie Ihr Abonnement und nehmen Sie es bei Bedarf wieder auf. Sie zahlen nur für aktiv genutzte Monate.'
                    : "Pause your subscription and resume when you need it. You only pay for the months you're actively using the service.",
              },
              {
                q:
                  lang === 'es'
                    ? '¿Cómo manejan proyectos complejos?'
                    : lang === 'fr'
                    ? 'Comment gérez-vous les projets complexes?'
                    : lang === 'de'
                    ? 'Wie gehen Sie mit komplexen Projekten um?'
                    : 'How do you handle complex projects?',
                a:
                  lang === 'es'
                    ? 'Los proyectos complejos se dividen en hitos y se gestionan en nuestro panel. Siempre sabes qué está en progreso.'
                    : lang === 'fr'
                    ? 'Les projets complexes sont divisés en jalons et gérés dans notre tableau de bord.'
                    : lang === 'de'
                    ? 'Komplexe Projekte werden in Meilensteine aufgeteilt und in unserem Dashboard verwaltet.'
                    : "Complex projects are broken into milestones and managed inside our dashboard. You always know what's in progress, what's next, and what's been delivered.",
              },
              {
                q:
                  lang === 'es'
                    ? '¿Soy dueño de los archivos finales?'
                    : lang === 'fr'
                    ? 'Suis-je propriétaire des fichiers finaux?'
                    : lang === 'de'
                    ? 'Gehören mir die finalen Dateien?'
                    : 'Do I own the final files?',
                a:
                  lang === 'es'
                    ? 'Sí. 100%. Recibes todos los archivos fuente para cada entregable. Toda la propiedad intelectual se transfiere a ti.'
                    : lang === 'fr'
                    ? 'Oui. 100%. Vous recevez tous les fichiers sources pour chaque livrable. Toute propriété intellectuelle vous est transférée.'
                    : lang === 'de'
                    ? 'Ja. 100%. Sie erhalten alle Quelldateien für jeden Liefergegenstand. Das gesamte geistige Eigentum wird auf Sie übertragen.'
                    : 'Yes. 100%. You receive full source files (Figma, Illustrator, After Effects, code repos) for every deliverable. All intellectual property transfers to you upon delivery.',
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="mx-6 mb-20">
          <div className="max-w-6xl mx-auto rounded-2xl bg-stone-900 dark:bg-stone-950 text-white overflow-hidden relative px-16 py-20 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-orange-600/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-yellow-400/10 translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight mb-4">
                <T k="ctaH2" lang={lang} />
              </h2>
              <p className="text-stone-400 text-base font-light mb-10">
                <T k="ctaSub" lang={lang} />
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/dashboard/organizations/create-org"
                  className="px-8 py-3.5 bg-white text-stone-900 rounded-xl font-semibold text-base hover:bg-stone-100 transition-colors"
                >
                  <T k="startFreeTrial" lang={lang} />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-3.5 border border-stone-700 text-stone-400 rounded-xl font-semibold text-base hover:border-stone-500 hover:text-stone-200 transition-colors"
                >
                  <T k="bookDemo" lang={lang} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-stone-200 dark:border-stone-800 px-6 pt-14 pb-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mb-4">
                <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Wind className="w-3.5 h-3.5 text-white" />
                </div>
                Crafterkite
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-light">
                <T k="footerTagline" lang={lang} />
              </p>
            </div>
            {[
              {
                headKey: 'product',
                links: [
                  {
                    label:
                      lang === 'es'
                        ? 'Funciones'
                        : lang === 'fr'
                        ? 'Fonctionnalités'
                        : lang === 'de'
                        ? 'Funktionen'
                        : 'Features',
                    href: '#features',
                  },
                  {
                    label:
                      lang === 'es'
                        ? 'Servicios'
                        : lang === 'fr'
                        ? 'Services'
                        : lang === 'de'
                        ? 'Dienste'
                        : 'Services',
                    href: '#services',
                  },
                  {
                    label:
                      lang === 'es'
                        ? 'Precios'
                        : lang === 'fr'
                        ? 'Tarifs'
                        : lang === 'de'
                        ? 'Preise'
                        : 'Pricing',
                    href: '#pricing',
                  },
                  { label: 'Changelog', href: '#' },
                ],
              },
              {
                headKey: 'company',
                links: [
                  {
                    label:
                      lang === 'es'
                        ? 'Acerca de'
                        : lang === 'fr'
                        ? 'À propos'
                        : lang === 'de'
                        ? 'Über uns'
                        : 'About',
                    href: '#',
                  },
                  { label: 'Blog', href: '#' },
                  {
                    label:
                      lang === 'es'
                        ? 'Carreras'
                        : lang === 'fr'
                        ? 'Carrières'
                        : lang === 'de'
                        ? 'Karriere'
                        : 'Careers',
                    href: '#',
                  },
                  {
                    label:
                      lang === 'es'
                        ? 'Contacto'
                        : lang === 'fr'
                        ? 'Contact'
                        : lang === 'de'
                        ? 'Kontakt'
                        : 'Contact',
                    href: '#',
                  },
                ],
              },
              {
                headKey: 'legal',
                links: [
                  {
                    label:
                      lang === 'es'
                        ? 'Privacidad'
                        : lang === 'fr'
                        ? 'Confidentialité'
                        : lang === 'de'
                        ? 'Datenschutz'
                        : 'Privacy',
                    href: '#',
                  },
                  {
                    label:
                      lang === 'es'
                        ? 'Términos'
                        : lang === 'fr'
                        ? 'Conditions'
                        : lang === 'de'
                        ? 'Nutzungsbedingungen'
                        : 'Terms',
                    href: '#',
                  },
                  {
                    label:
                      lang === 'es'
                        ? 'Seguridad'
                        : lang === 'fr'
                        ? 'Sécurité'
                        : lang === 'de'
                        ? 'Sicherheit'
                        : 'Security',
                    href: '#',
                  },
                ],
              },
            ].map((col) => (
              <div key={col.headKey}>
                <h5 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-4">
                  <T k={col.headKey} lang={lang} />
                </h5>
                <nav className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors font-light"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-stone-400">
              © {new Date().getFullYear()} Crafterkite.{' '}
              <T k="allRightsReserved" lang={lang} />
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Twitter, href: '#' },
                { Icon: Linkedin, href: '#' },
                { Icon: Instagram, href: '#' },
              ].map(({ Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </footer>

        {/* Marquee keyframe */}
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </main>
    </div>
  );
}
