import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingNavContext = React.createContext<{
  navigateWithTransition: (to: string) => void;
  isExiting: boolean;
}>({
  navigateWithTransition: () => {},
  isExiting: false,
});

function SmoothLink({
  to,
  children,
  className,
  style,
  onClick,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  [key: string]: any;
}) {
  const { navigateWithTransition } = React.useContext(LandingNavContext);

  return (
    <a
      href={to}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        navigateWithTransition(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

const Link = SmoothLink;
import logoImg from '../assets/logo.png';
import emblemImg from '../assets/aurora-emblem.png';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';
import OrbitingCirclesGlobe from '../components/ui/orbiting-circles-02';
import '../styles/NewLanding.css';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Truck,
  Megaphone,
  Bot,
  Plug,
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';

/* ─── Intersection Observer hook for scroll-reveal ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Navbar headers matching dashboard & app pages ─── */
const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/products' },
  { label: 'Orders', path: '/orders' },
  { label: 'Shipments', path: '/shipments' },
  { label: 'Ads', path: '/ads' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Repricer', path: '/repricer' },
  { label: 'AI Assistant', path: '/ai' },
  { label: 'Integration', path: '/integration' },
  { label: 'Settings', path: '/settings' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header
      className="navbar-sticky-wrapper fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: '0.65rem 1rem 0.65rem',
        background: 'transparent',
      }}
    >
      <nav
        className="navbar"
        style={{
          width: 'fit-content',
          maxWidth: 'calc(100% - 2rem)',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            flexWrap: 'nowrap',
          }}
        >
          {/* Brand Emblem Link to Landing Page */}
          <Link
            to="/"
            title="Aurora AI"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
              paddingRight: '0.2rem',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = '1')}
          >
            <img
              src={emblemImg}
              alt="Aurora.AI"
              style={{
                height: '24px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
              }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="navbar-links hidden md:flex"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              gap: '0.2rem',
              overflowX: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  padding: '0.38rem 0.68rem',
                  flexShrink: 0,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <NotificationBell />
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="apple-btn-secondary"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="apple-btn-secondary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  padding: '0.38rem 0.85rem',
                }}
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-1.5 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {menuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          className="md:hidden mt-2 mx-auto max-w-[1280px] p-4 rounded-2xl shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #3B5488 0%, #2A3F68 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="space-y-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-2 px-3 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              <Link
                to="/login"
                className="apple-btn-secondary block w-full text-center py-2 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Login / Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Feature data ─── */
const features = [
  {
    Icon: LayoutDashboard,
    title: 'Dashboard',
    desc: 'Unified analytics across every channel. See what matters at a glance.',
    path: '/dashboard',
  },
  {
    Icon: Package,
    title: 'Inventory',
    desc: 'Real-time stock intelligence that prevents costly stockouts and overstocking.',
    path: '/products',
  },
  {
    Icon: DollarSign,
    title: 'Repricer',
    desc: 'AI-driven dynamic pricing that maximizes margin on every SKU.',
    path: '/repricer',
  },
  {
    Icon: Truck,
    title: 'Orders & Shipments',
    desc: 'End-to-end order lifecycle visibility from placement to delivery.',
    path: '/orders',
  },
  {
    Icon: Megaphone,
    title: 'Advertising',
    desc: 'Intelligent ad optimization that connects spend to real profit.',
    path: '/ads',
  },
  {
    Icon: Bot,
    title: 'AI Assistant',
    desc: 'Your always-on commerce copilot that surfaces insights and acts on them.',
    path: '/ai',
  },
  {
    Icon: Plug,
    title: 'Integration',
    desc: 'Seamless connectivity with Amazon, Walmart, Shopify and beyond.',
    path: '/integration',
  },
];

/* ─── Data Stream Pipeline (Straight Telemetry Bus) ─── */
function DataStreamPipeline() {
  const reveal = useReveal();
  const signals = [
    { label: 'Search', color: 'bg-blue-600' },
    { label: 'Pricing', color: 'bg-[#d4af37]' },
    { label: 'Inventory', color: 'bg-[#0b2545]' },
    { label: 'Competitors', color: 'bg-amber-600' },
    { label: 'Advertising', color: 'bg-indigo-600' },
    { label: 'Demand', color: 'bg-emerald-600' },
    { label: 'Returns', color: 'bg-[#133b6b]' },
  ];

  const actions = [
    { title: 'Price Adjusted +$2', desc: 'Margin protected on 12 SKUs', color: 'bg-emerald-600' },
    { title: 'Budget Reallocated', desc: 'Low-stock items deprioritized', color: 'bg-[#0b2545]' },
    { title: 'Alert: Buy Box', desc: 'Competitor OOS — opportunity', color: 'bg-[#d4af37]' },
  ];

  return (
    <div
      ref={reveal.ref}
      className={`transition-all duration-700 ${
        reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <style>{`
        @keyframes pulse-beam {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes beam-glow {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.8; }
        }
        @keyframes bar-pulse {
          0%, 100% { width: 55%; opacity: 0.8; }
          50% { width: 92%; opacity: 1; }
        }
        @keyframes bar-pulse-alt {
          0%, 100% { width: 40%; opacity: 0.65; }
          50% { width: 82%; opacity: 0.95; }
        }
        @keyframes engine-border {
          0%, 100% { border-color: rgba(212, 175, 55, 0.3); }
          50% { border-color: rgba(212, 175, 55, 0.6); }
        }
      `}</style>

      {/* ── Desktop: Rectilinear Telemetry Console ── */}
      <div className="hidden md:flex items-stretch justify-between gap-0 max-w-5xl mx-auto bg-gradient-to-b from-white via-[#f4f9fe] to-[#eaf3fc] rounded-2xl border border-[#cde0f5] shadow-sm p-6 relative overflow-hidden backdrop-blur-sm">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

        {/* LEFT COLUMN: 7 Signal Inputs with direct horizontal laser channels */}
        <div className="flex-1 flex flex-col justify-between py-1 pr-0 z-10">
          {signals.map((s, i) => (
            <div key={i} className="flex items-center h-[34px]">
              {/* Signal Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#cde0f5] bg-gradient-to-r from-white to-[#edf5fd] shadow-2xs hover:border-[#d4af37]/70 hover:from-[#fdfcf7] transition-all shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.color}`} />
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#0b2545] whitespace-nowrap">
                  {s.label}
                </span>
              </div>

              {/* Straight Horizontal Laser Track (Connects Badge directly to Engine in Vibrant Blue) */}
              <div className="flex-1 relative h-px mx-2 overflow-hidden flex items-center">
                <div
                  className="w-full h-[2px] bg-gradient-to-r from-[#60a5fa] via-[#2563eb] to-[#1d4ed8]"
                  style={{ animation: `beam-glow ${2.5 + i * 0.2}s ease-in-out infinite` }}
                />
                {/* Moving Vibrant Blue Data Packet */}
                <div
                  className="absolute w-2 h-2 rounded-full bg-[#2563eb] shadow-[0_0_10px_rgba(37,99,235,1)] -translate-y-1/2 top-1/2"
                  style={{
                    animation: `pulse-beam ${2 + (i % 3) * 0.4}s ease-in-out ${i * 0.25}s infinite`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* CENTER COLUMN: Central Aurora Processing Engine (Matches full height of signal lines) */}
        <div className="w-[230px] shrink-0 flex flex-col justify-stretch py-1 px-1 z-10">
          <div
            className="w-full h-full rounded-xl border-2 border-[#d4af37]/55 bg-gradient-to-br from-[#fdfcf7] via-[#f2f7fc] to-[#e8f1fa] p-4 shadow-sm relative flex flex-col justify-between"
            style={{ animation: 'engine-border 4s ease-in-out infinite' }}
          >
            {/* Input Docking Indicator Strip in Vibrant Blue (Left edge) */}
            <div className="absolute -left-[3px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-[#60a5fa] via-[#2563eb] to-[#1d4ed8] rounded-full" />
            
            {/* Output Docking Indicator Strip in Gold (Right edge) */}
            <div className="absolute -right-[3px] top-6 bottom-6 w-[3px] bg-gradient-to-b from-[#d4af37] via-emerald-500 to-[#d4af37] rounded-full" />

            <div className="flex items-center gap-2 mb-2">
              <img
                src={emblemImg}
                alt="Aurora.AI Emblem"
                className="h-7 w-auto object-contain shrink-0"
              />
              <div>
                <p className="text-xs font-bold text-[#0b2545] leading-none">Aurora Engine</p>
                <p className="text-[9px] text-[#476587] font-medium mt-0.5">Real-time optimization</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-around py-1 space-y-2">
              {[
                { label: 'Pricing', barColor: 'bg-[#d4af37]', anim: 'bar-pulse', dur: '3s' },
                { label: 'Bidding', barColor: 'bg-[#2563eb]', anim: 'bar-pulse-alt', dur: '2.8s' },
                { label: 'Inventory', barColor: 'bg-emerald-600', anim: 'bar-pulse', dur: '3.4s' },
                { label: 'Competitors', barColor: 'bg-[#1d4ed8]', anim: 'bar-pulse-alt', dur: '2.6s' },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="font-semibold text-[#234268]">{metric.label}</span>
                    <span className="font-bold text-emerald-700">Active</span>
                  </div>
                  <div className="h-[3px] rounded-full bg-[#dce9f8] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${metric.barColor}`}
                      style={{ animation: `${metric.anim} ${metric.dur} ease-in-out ${i * 0.3}s infinite` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3 Action Outputs with direct horizontal laser channels */}
        <div className="flex-1 flex flex-col justify-around py-3 pl-0 z-10">
          {actions.map((a, i) => (
            <div key={i} className="flex items-center">
              {/* Straight Horizontal Laser Track (Connects Engine directly to Action Card) */}
              <div className="flex-1 relative h-px mx-2 overflow-hidden flex items-center">
                <div
                  className="w-full h-[1.5px] bg-gradient-to-r from-[#d4af37] via-[#d4af37]/60 to-[#b5cbe8]/50"
                  style={{ animation: `beam-glow ${2.2 + i * 0.3}s ease-in-out infinite` }}
                />
                {/* Moving Action Dispatch Packet */}
                <div
                  className="absolute w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.9)] -translate-y-1/2 top-1/2"
                  style={{
                    animation: `pulse-beam ${1.8 + i * 0.3}s ease-in-out ${0.4 + i * 0.35}s infinite`,
                  }}
                />
              </div>

              {/* Action Card */}
              <div className="w-[210px] pl-3.5 pr-3 py-2.5 rounded-lg border border-[#cde0f5] bg-gradient-to-r from-white to-[#edf5fd] shadow-2xs overflow-hidden relative shrink-0 hover:border-[#d4af37]/70 transition-all hover:scale-[1.02]">
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${a.color} rounded-l-lg`} />
                <p className="text-[11px] font-bold text-[#0b2545] leading-tight">{a.title}</p>
                <p className="text-[10px] text-[#234268] mt-0.5 leading-snug">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: vertical stacked layout ── */}
      <div className="md:hidden flex flex-col items-center gap-3.5 px-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {signals.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#cde0f5] bg-gradient-to-r from-white to-[#edf5fd] text-[9px] font-bold tracking-wider uppercase text-[#0b2545] shadow-xs"
            >
              <span className={`w-1 h-1 rounded-full ${s.color}`} />
              {s.label}
            </span>
          ))}
        </div>
        <div className="w-px h-6 bg-gradient-to-b from-[#2563eb] to-[#d4af37]" />
        <div
          className="w-full max-w-[240px] rounded-xl border-2 border-[#d4af37]/55 bg-gradient-to-br from-[#fdfcf7] via-[#f2f7fc] to-[#e8f1fa] p-3.5 shadow-xs"
          style={{ animation: 'engine-border 4s ease-in-out infinite' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <img
              src={emblemImg}
              alt="Aurora.AI Emblem"
              className="h-6 w-auto object-contain shrink-0"
            />
            <p className="text-xs font-bold text-[#0b2545]">Aurora Engine</p>
          </div>
          <div className="space-y-1.5">
            {['Pricing', 'Bidding', 'Inventory', 'Competitors'].map((m, i) => (
              <div key={i}>
                <span className="text-[8px] font-semibold text-[#234268]">{m}</span>
                <div className="h-[2px] rounded-full bg-[#dce9f8] overflow-hidden mt-0.5">
                  <div
                    className={`h-full rounded-full ${['bg-[#d4af37]', 'bg-[#2563eb]', 'bg-emerald-600', 'bg-[#1d4ed8]'][i]}`}
                    style={{ animation: `bar-pulse ${2.8 + i * 0.3}s ease-in-out ${i * 0.3}s infinite` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-px h-6 bg-gradient-to-b from-[#d4af37] to-[#cde0f5]" />
        <div className="w-full max-w-[260px] flex flex-col gap-1.5">
          {actions.map((a, i) => (
            <div key={i} className="relative pl-3.5 pr-3 py-2 rounded-lg border border-[#cde0f5] bg-gradient-to-r from-white to-[#edf5fd] shadow-xs overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${a.color} rounded-l-lg`} />
              <p className="text-[11px] font-bold text-[#0b2545]">{a.title}</p>
              <p className="text-[10px] text-[#234268]">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-between overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-0 bg-gradient-to-b from-[#edf4fb] via-[#f7fafe] to-white">
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-gradient-to-br from-[#d4af37]/10 via-[#2563eb]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center shrink-0">
        <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-[#ba8c26] mb-1.5 animate-fade-in-up">
          INTRODUCING
        </p>

        <div className="flex items-center justify-center mb-2.5 sm:mb-3 animate-fade-in-up">
          <img
            src={logoImg}
            alt="Aurora.AI"
            className="h-15 sm:h-18 md:h-22 lg:h-24 w-auto object-contain drop-shadow-sm transition-transform hover:scale-[1.01]"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0b2545] leading-[1.15] mb-2.5 sm:mb-3 animate-fade-in-up max-w-2xl mx-auto">
          The Intelligent Platform for{' '}
          <span className="text-[#d4af37]">Commerce Growth</span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-[#234268] max-w-xl mx-auto leading-relaxed mb-4 sm:mb-5 animate-fade-in-up font-normal">
          Unifying advertising, dynamic repricing, and competitive intelligence into autonomous multi-marketplace growth.
        </p>

        {/* Enter User Dashboard CTA */}
        <div className="flex items-center justify-center animate-fade-in-up mb-1">
          <Link
            to="/dashboard"
            className="hero-cta-btn inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-[13px] font-bold rounded-full bg-[#0b2545] hover:bg-[#133b6b] border border-[#d4af37]/70 hover:border-[#d4af37] transition-all shadow-md hover:scale-[1.02]"
            style={{ color: '#ffffff', textDecoration: 'none' }}
          >
            <span style={{ color: '#ffffff', fontWeight: 700 }}>Enter User Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#f3d375]" style={{ color: '#f3d375' }} />
          </Link>
        </div>
      </div>

      {/* Orbiting Circles Globe Engine */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-1 sm:mt-2 animate-fade-in">
        <OrbitingCirclesGlobe />
      </div>
    </section>
  );
}

/* ─── Features Grid ─── */
function FeaturesSection() {
  const reveal = useReveal();
  return (
    <section id="features" className="py-14 md:py-18 bg-white border-t border-[#dbe7f7]">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={reveal.ref}
          className={`text-center max-w-2xl mx-auto mb-10 transition-all duration-700 ${
            reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#ba8c26] uppercase mb-2">Platform</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b2545] mb-2.5">
            Everything you need. <span className="text-[#d4af37] italic font-light">One platform.</span>
          </h2>
          <p className="text-[#234268] text-sm md:text-base leading-relaxed">
            Seven intelligent modules working together, not in silos. Every signal feeds every decision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {features.map((feature, i) => (
            <Link
              key={i}
              to={feature.path}
              className="group relative p-4.5 rounded-xl border border-[#cde0f5] hover:border-[#d4af37]/70 bg-gradient-to-br from-[#f8faff] via-[#edf5fc] to-[#e6f0fa] hover:from-[#fcfbf5] hover:via-[#f0f6fd] hover:to-[#e4eefa] transition-all duration-300 shadow-[0_2px_8px_rgba(11,37,69,0.03)] hover:shadow-[0_4px_16px_rgba(212,175,55,0.12)] overflow-hidden block text-inherit no-underline"
            >
              <div className="absolute top-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

              <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-[#dceaf9] to-[#cfe2f6] flex items-center justify-center mb-3 group-hover:from-[#fdf5dd] group-hover:to-[#dceaf9] transition-all border border-[#b8d4f4] group-hover:border-[#d4af37]/60 shadow-2xs">
                <feature.Icon className="w-4.5 h-4.5 text-[#0b2545] group-hover:text-[#ba8c26] transition-colors" strokeWidth={1.8} />
              </div>
              <h3 className="text-sm font-bold text-[#0b2545] mb-1">{feature.title}</h3>
              <p className="text-xs text-[#234268] leading-relaxed">{feature.desc}</p>
            </Link>
          ))}

          {/* CTA card */}
          <Link
            to="/dashboard"
            className="relative p-4.5 rounded-xl border-2 border-[#d4af37]/55 hover:border-[#d4af37] bg-gradient-to-br from-[#fcfbf3] via-[#edf5fc] to-[#e6f0fa] transition-all duration-300 flex flex-col justify-center shadow-xs hover:shadow-[0_4px_16px_rgba(212,175,55,0.14)] overflow-hidden no-underline"
          >
            <div className="absolute top-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
            <p className="text-xs text-[#0b2545] font-bold mb-2">Ready to transform your marketplace operations?</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ba8c26] group-hover:text-[#7a5518] transition-colors">
              Enter User Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorksSection() {
  const reveal = useReveal();
  return (
    <section id="how-it-works" className="relative py-14 md:py-18 bg-gradient-to-b from-[#f8fafd] via-[#edf4fb] to-[#f8fafd] border-t border-[#cde0f5]">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div
          ref={reveal.ref}
          className={`text-center max-w-2xl mx-auto mb-8 transition-all duration-700 ${
            reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#ba8c26] uppercase mb-2">How It Works</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b2545] mb-2.5">
            Every signal that matters. <span className="text-[#d4af37] italic font-light">One engine driving growth.</span>
          </h2>
          <p className="text-[#234268] text-sm md:text-base leading-relaxed">
            Aurora.AI ingests marketplace signals in real time, processes them through a unified intelligence layer, and outputs autonomous actions that protect margins and capture opportunities.
          </p>
        </div>
        <DataStreamPipeline />
      </div>
    </section>
  );
}

/* ─── Stats Bar ─── */
function StatsSection() {
  const reveal = useReveal();
  const stats = [
    { value: '40–60%', label: 'Average TACoS Improvement' },
    { value: '10%', label: 'Average Margin Expansion' },
    { value: '$8B+', label: 'GMV Optimized Annually' },
  ];
  return (
    <section id="stats" className="py-10 md:py-12 bg-white border-y border-[#cde0f5]">
      <div
        ref={reveal.ref}
        className={`max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 text-center transition-all duration-700 ${
          reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {stats.map((stat, i) => (
          <div key={i} className={`flex flex-col items-center ${i !== stats.length - 1 ? 'md:border-r md:border-[#cde0f5]' : ''}`}>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0b2545] mb-1">{stat.value}</p>
            <p className="text-[11px] font-bold tracking-[0.15em] text-[#476587] uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Pillars Section ─── */
function PillarsSection() {
  const pillars = [
    {
      label: 'INTELLIGENT ADVERTISING',
      heading: 'Ad platforms see your ads.',
      headingAccent: 'Aurora sees your business.',
      body: 'The gap between ad performance and business performance is growing. Aurora.AI closes that gap permanently by connecting the signals that matter and acting on them autonomously.',
      tags: ['SP ADS', 'DSP', 'INVENTORY', 'DEMAND'],
    },
    {
      label: 'DYNAMIC PRICING',
      heading: 'Optimal prices. Optimal margins.',
      headingAccent: 'Every SKU.',
      body: 'Optimal prices amplify the power of your ads — they convert better, protect margin, and eliminate the fees that erode profit. The same brain driving demand ensures every conversion is profitable.',
      tags: ['PRICE STRATEGY', 'COMPETITOR MAP', 'MARGIN GUARD'],
    },
    {
      label: 'MARKET INTELLIGENCE',
      heading: 'Know every competitor.',
      headingAccent: 'Outperform all of them.',
      body: 'Track competitors across every dimension: pricing, promotions, rank, reviews, units sold, advertising position, and Buy Box share. That intelligence flows directly into your decisions.',
      tags: ['COMPETITOR TRACKING', 'BUY BOX', 'SHARE OF VOICE'],
    },
  ];

  return (
    <section id="pillars" className="py-14 md:py-18 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#ba8c26] uppercase mb-2">The Pillars</p>
          <p className="text-xs font-semibold text-[#476587] tracking-widest uppercase">Advertising · Pricing · Intelligence</p>
        </div>
        <div className="relative">
          <div className="absolute left-3.5 md:left-4 top-0 bottom-0 w-px bg-[#b8d4f4]" />
          {pillars.map((pillar, i) => (
            <div key={i} className="relative pl-9 md:pl-11 pb-10 last:pb-0">
              <div className="absolute left-2 md:left-2.5 top-1 w-3 h-3 rounded-full bg-[#d4af37] border-2 border-white shadow-xs" />
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#ba8c26] uppercase mb-1.5">{pillar.label}</p>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b2545] mb-2 leading-tight">
                {pillar.heading} <em className="text-[#d4af37] font-light not-italic">{pillar.headingAccent}</em>
              </h3>
              <p className="text-[#234268] text-sm leading-relaxed mb-3.5 max-w-xl">{pillar.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {pillar.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 text-[9.5px] font-bold tracking-wider uppercase rounded-full border border-[#cde0f5] text-[#0b2545] bg-[#edf5fc]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA / Lead Section ─── */
function CTASection() {
  const reveal = useReveal();
  return (
    <section id="cta" className="relative py-14 md:py-18 bg-gradient-to-b from-[#f8fafd] via-[#edf4fb] to-[#f8fafd] overflow-hidden border-t border-[#cde0f5]">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div
        ref={reveal.ref}
        className={`relative max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-10 items-center transition-all duration-700 ${
          reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b2545] mb-3 leading-tight">
            Your margins tell the real story. <em className="text-[#d4af37] font-light not-italic">Let Aurora show you.</em>
          </h2>
          <p className="text-[#234268] text-sm leading-relaxed mb-4.5 font-medium">
            See a live demo built around your category, your products, and your competitive landscape — with specific actions to drive profitable growth.
          </p>
          <ul className="space-y-2 list-none p-0 m-0">
            {[
              'AI agents making real decisions on your data',
              'Margin and profit impact modeled for your business',
              'Benchmark head-to-head against your current platform',
              'No commitment — a real conversation, not a sales pitch',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-[13px] text-[#234268] font-medium">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-[#f8faff] via-[#edf5fc] to-[#e6f0fa] rounded-xl border border-[#cde0f5] hover:border-[#d4af37]/45 transition-colors p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          <h3 className="text-base font-bold text-[#0b2545] mb-4">Request a Live Demo</h3>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-2.5">
              <input type="text" placeholder="First Name" className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#c8ddf5] text-[#0b2545] placeholder-[#476587] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 outline-none transition-all bg-white" />
              <input type="text" placeholder="Last Name" className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#c8ddf5] text-[#0b2545] placeholder-[#476587] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 outline-none transition-all bg-white" />
            </div>
            <input type="email" placeholder="Work Email" className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#c8ddf5] text-[#0b2545] placeholder-[#476587] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 outline-none transition-all bg-white" />
            <input type="text" placeholder="Company Name" className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#c8ddf5] text-[#0b2545] placeholder-[#476587] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 outline-none transition-all bg-white" />
            <Link
              to="/dashboard"
              className="hero-cta-btn block w-full py-2.5 text-xs font-bold rounded-lg bg-[#0b2545] hover:bg-[#133b6b] border border-[#d4af37]/50 hover:border-[#d4af37] transition-all shadow-md text-center no-underline"
              style={{ color: '#ffffff', textDecoration: 'none' }}
            >
              <span style={{ color: '#ffffff', fontWeight: 700 }}>Enter User Dashboard →</span>
            </Link>
            <p className="text-[10px] text-[#476587] text-center font-medium">Instant sandbox access available.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="py-7 bg-[#0a192f] border-t border-[#d4af37]/30 text-slate-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoImg}
            alt="Aurora.AI Logo"
            className="h-7 w-auto object-contain"
          />
        </Link>
        <p className="text-[11px] text-slate-300 m-0">© {new Date().getFullYear()} Aurora.AI. All rights reserved.</p>
        <div className="flex gap-5 text-[11px] text-slate-200">
          <Link to="/settings" className="text-slate-200 hover:text-[#f3d375] transition-colors no-underline">Settings</Link>
          <Link to="/pricing" className="text-slate-200 hover:text-[#f3d375] transition-colors no-underline">Pricing</Link>
          <Link to="/integration" className="text-slate-200 hover:text-[#f3d375] transition-colors no-underline">Integrations</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Landing Page Component ─── */
export default function Home() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const navigateWithTransition = (to: string) => {
    if (to === '/' && window.location.pathname === '/') return;
    setIsExiting(true);
    setTimeout(() => {
      navigate(to, { state: { fromLanding: true } });
    }, 220);
  };

  return (
    <LandingNavContext.Provider value={{ navigateWithTransition, isExiting }}>
      <main className={`bg-white min-h-screen page-transition landing-page-root ${isExiting ? 'landing-exiting' : 'landing-entering'}`}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <PillarsSection />
        <CTASection />
        <Footer />
      </main>
    </LandingNavContext.Provider>
  );
}
