import { useState, useEffect } from 'react'
import {
  Monitor, Users, Shield, Zap, Download, ExternalLink,
  CheckCircle, ArrowRight, Menu, X, Headphones, BarChart3,
  Globe, Lock, ChevronDown
} from 'lucide-react'

const ADMIN_REPO = 'mohamedbenhadjer/ultimate-rdp-admin'
const AGENT_REPO = 'Flower-City-Online/ultimate-rdp'

function useLatestRelease(repo) {
  const [release, setRelease] = useState(null)
  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}/releases/latest`)
      .then(r => r.json())
      .then(data => setRelease(data))
      .catch(() => {})
  }, [repo])
  return release
}

function getAsset(release, pattern) {
  if (!release?.assets) return null
  return release.assets.find(a => a.name.match(pattern))
}

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0b0f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">RDP Bridge</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#download" className="hover:text-white transition-colors">Download</a>
        </div>
        <a href="#download" className="hidden md:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" /> Get the app
        </a>
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0b0f] px-6 py-4 flex flex-col gap-4 text-sm">
          <a href="#features" className="text-slate-400 hover:text-white" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-slate-400 hover:text-white" onClick={() => setOpen(false)}>How it works</a>
          <a href="#download" className="text-slate-400 hover:text-white" onClick={() => setOpen(false)}>Download</a>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3 h-3" /> Remote support, simplified
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          Manage your support<br />
          <span className="text-blue-400">team effortlessly</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          RDP Bridge connects admins, managers, and agents in one seamless platform.
          Invite your team, monitor sessions in real-time, and deliver exceptional remote support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#download" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Download className="w-5 h-5" /> Download the app
          </a>
          <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-slate-300 font-medium px-6 py-3 rounded-xl transition-colors">
            See how it works <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <a href="#features" className="text-slate-600 hover:text-slate-400 transition-colors animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  )
}

const adminFeatures = [
  { icon: Users, title: 'Team management', desc: 'Invite managers and agents with a single click. Manage permissions, teams, and roles from one dashboard.' },
  { icon: BarChart3, title: 'Session analytics', desc: 'Track agent performance, session durations, and support metrics with detailed real-time reports.' },
  { icon: Shield, title: 'Access control', desc: 'Define teams, assign devices, and enforce role-based access across your entire support operation.' },
]

const agentFeatures = [
  { icon: Headphones, title: 'Smart support queue', desc: 'Receive support requests as they come in, accept them, and start remote sessions instantly.' },
  { icon: Globe, title: 'Cross-platform', desc: 'Run on Windows, Linux, or Android. The agent app works wherever your team works.' },
  { icon: Lock, title: 'Secure by default', desc: 'All sessions are authenticated via Supabase. No session starts without a valid identity.' },
]

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all">
      <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Two apps, one ecosystem</h2>
          <p className="text-slate-400 max-w-xl mx-auto">The Admin app gives you full control. The Agent app puts your team in action.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">Admin App</p>
                <p className="text-white font-semibold">Windows · Linux</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {adminFeatures.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Agent App</p>
                <p className="text-white font-semibold">Android · Windows · Linux</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {agentFeatures.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    num: '01',
    title: 'Admin invites the team',
    desc: 'From the admin app, invite managers or agents by entering their name and email. An invitation email is sent instantly.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    num: '02',
    title: 'Invitee downloads the app',
    desc: 'The invitee clicks the email link, which detects their platform and shows the correct download for Windows, Linux, or Android.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    num: '03',
    title: 'Set password & start',
    desc: 'After installing, the app opens automatically with the invite token. The invitee sets their password and is ready to work.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How the invite works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Getting your team up and running takes less than 5 minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className={`relative border ${s.border} ${s.bg} rounded-2xl p-6`}>
              <span className={`text-4xl font-black ${s.color} opacity-30 block mb-4`}>{s.num}</span>
              <h3 className="text-white font-semibold text-lg mb-3">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DownloadButton({ href, label, sub, disabled }) {
  if (disabled || !href) {
    return (
      <div className="flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-5 py-3 opacity-40 cursor-not-allowed">
        <Download className="w-5 h-5 text-slate-400 shrink-0" />
        <div className="text-left">
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-slate-500 text-xs">{sub || 'Unavailable'}</p>
        </div>
      </div>
    )
  }
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="flex items-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/40 rounded-xl px-5 py-3 transition-all group">
      <Download className="w-5 h-5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
      <div className="text-left">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-slate-400 text-xs">{sub}</p>
      </div>
    </a>
  )
}

function AppCard({ title, badge, badgeColor, tagline, release, repo, platforms }) {
  return (
    <div className="border border-white/10 bg-white/5 rounded-2xl p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className={`text-xs font-medium uppercase tracking-wider ${badgeColor} mb-1 block`}>{badge}</span>
          <h3 className="text-white text-xl font-bold">{title}</h3>
          <p className="text-slate-400 text-sm mt-1">{tagline}</p>
        </div>
        <a href={`https://github.com/${repo}/releases`} target="_blank" rel="noreferrer"
          className="text-slate-500 hover:text-white transition-colors">
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
      <div className="flex flex-col gap-3">
        {platforms.map(p => (
          <DownloadButton key={p.label} {...p} href={getAsset(release, p.pattern)?.browser_download_url} sub={release ? `v${release.tag_name?.replace(/^(admin|agent)-/, '')}` : 'Loading...'} />
        ))}
      </div>
      {release && (
        <p className="text-slate-600 text-xs mt-4 flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-500" />
          Latest release: {release.name}
        </p>
      )}
    </div>
  )
}

function Downloads() {
  const adminRelease = useLatestRelease(ADMIN_REPO)
  const agentRelease = useLatestRelease(AGENT_REPO)

  return (
    <section id="download" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Download RDP Bridge</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Choose the app for your role. Already invited? Check your email for the direct link.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <AppCard
            title="Admin App"
            badge="For admins & managers"
            badgeColor="text-blue-400"
            tagline="Manage your team and monitor sessions"
            release={adminRelease}
            repo={ADMIN_REPO}
            platforms={[
              { label: 'Windows', pattern: /-setup\.exe$/ },
              { label: 'Linux (.deb)', pattern: /\.deb$/ },
            ]}
          />
          <AppCard
            title="Agent App"
            badge="For support agents"
            badgeColor="text-emerald-400"
            tagline="Receive requests and run remote sessions"
            release={agentRelease}
            repo={AGENT_REPO}
            platforms={[
              { label: 'Android (APK)', pattern: /\.apk$/ },
              { label: 'Windows', pattern: /-setup\.exe$/ },
              { label: 'Linux (.deb)', pattern: /\.deb$/ },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
            <Monitor className="w-3 h-3 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">RDP Bridge</span>
        </div>
        <p className="text-slate-600 text-sm">© {new Date().getFullYear()} RDP Bridge. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-500 text-sm">
          <a href={`https://github.com/${ADMIN_REPO}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            <ExternalLink className="w-4 h-4" /> Admin
          </a>
          <a href={`https://github.com/${AGENT_REPO}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            <ExternalLink className="w-4 h-4" /> Agent
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-slate-300">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Downloads />
      </main>
      <Footer />
    </div>
  )
}
