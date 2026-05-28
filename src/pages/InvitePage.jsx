import { useEffect, useState } from 'react'
import { Monitor, Download, Headphones, RefreshCw, AlertCircle, CheckCircle, Smartphone, Laptop } from 'lucide-react'

const ADMIN_REPO = 'mohamedbenhadjer/ultimate-rdp-admin'
const AGENT_REPO = 'Flower-City-Online/ultimate-rdp'

const ADMIN_SCHEME = 'rdpadmin'
const AGENT_SCHEME = 'rdpagent'

function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase()
  if (/android/.test(ua)) return 'android'
  if (/win/.test(ua)) return 'windows'
  if (/linux/.test(ua)) return 'linux'
  if (/mac/.test(ua)) return 'mac'
  return 'unknown'
}

function parseHash(hash) {
  const str = hash.startsWith('#') ? hash.slice(1) : hash
  const params = {}
  str.split('&').forEach(part => {
    const [k, v] = part.split('=')
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '')
  })
  return params
}

async function fetchLatestRelease(app) {
  try {
    const res = await fetch(`/api/releases?app=${app}`)
    if (res.ok) {
      const data = await res.json()
      if (data?.assets?.length > 0) return data
    }
  } catch { /* ignore */ }
  return null
}

function getAssetUrl(release, pattern) {
  return release?.assets?.find(a => a.name.match(pattern))?.browser_download_url || null
}

const STATUS = {
  LOADING: 'loading',
  TRYING_DEEPLINK: 'trying',
  NEEDS_DOWNLOAD: 'download',
  INVALID: 'invalid',
  SUCCESS: 'success',
}

function PlatformIcon({ platform }) {
  if (platform === 'android') return <Smartphone className="w-5 h-5" />
  return <Laptop className="w-5 h-5" />
}

function DownloadCard({ href, label, sub, icon: Icon, accent }) {
  if (!href) {
    return (
      <div className="flex items-center gap-4 border border-white/5 bg-white/[0.03] rounded-xl px-5 py-4 opacity-40 cursor-not-allowed">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
        <div className="text-left">
          <p className="text-slate-400 font-semibold">{label}</p>
          <p className="text-slate-600 text-sm">Not available in this release</p>
        </div>
      </div>
    )
  }
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className={`flex items-center gap-4 border rounded-xl px-5 py-4 transition-all group
        ${accent
          ? 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
        }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-blue-500/20' : 'bg-white/10'}`}>
        <Icon className={`w-5 h-5 ${accent ? 'text-blue-400' : 'text-slate-400'}`} />
      </div>
      <div className="text-left">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-slate-400 text-sm">{sub}</p>
      </div>
      <Download className="w-4 h-4 text-slate-500 ml-auto group-hover:text-blue-400 transition-colors" />
    </a>
  )
}

export default function InvitePage() {
  const [status, setStatus] = useState(STATUS.LOADING)
  const [role, setRole] = useState(null)
  const [platform, setPlatform] = useState(null)
  const [release, setRelease] = useState(null)
  const [releaseFetched, setReleaseFetched] = useState(false)
  const [deepLinkAttempted, setDeepLinkAttempted] = useState(false)

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const hashParams = parseHash(window.location.hash)

    const roleParam = search.get('role')
    const accessToken = hashParams['access_token']
    const refreshToken = hashParams['refresh_token']
    const type = hashParams['type']

    const detectedPlatform = detectPlatform()
    setPlatform(detectedPlatform)
    setRole(roleParam)

    if (!accessToken || type !== 'invite') {
      setStatus(STATUS.INVALID)
      return
    }

    const scheme = roleParam === 'manager' ? ADMIN_SCHEME : AGENT_SCHEME
    const deepLink = `${scheme}://invite?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&type=invite`

    const app = roleParam === 'manager' ? 'admin' : 'agent'
    fetchLatestRelease(app).then(rel => { setRelease(rel); setReleaseFetched(true) })

    setStatus(STATUS.TRYING_DEEPLINK)
    setDeepLinkAttempted(true)

    window.location.href = deepLink

    const timer = setTimeout(() => {
      setStatus(STATUS.NEEDS_DOWNLOAD)
    }, 900)

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimeout(timer)
        setStatus(STATUS.SUCCESS)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const isManager = role === 'manager'
  const appName = isManager ? 'Admin App' : 'Agent App'
  const appColor = isManager ? 'text-blue-400' : 'text-emerald-400'
  const appIcon = isManager ? Monitor : Headphones

  const getDownloadLinks = () => {
    if (!release) return []
    if (isManager) {
      return [
        { label: 'Windows Installer', sub: 'Download & install, then re-open your invite email', icon: Laptop, href: getAssetUrl(release, /-setup\.exe$/), accent: platform === 'windows' },
        { label: 'Linux (.deb)', sub: 'Download & install, then re-open your invite email', icon: Laptop, href: getAssetUrl(release, /\.deb$/), accent: platform === 'linux' },
      ]
    }
    return [
      { label: 'Android (APK)', sub: 'Download & install, then re-open your invite email', icon: Smartphone, href: getAssetUrl(release, /\.apk$/), accent: platform === 'android' },
      { label: 'Windows Installer', sub: 'Download & install, then re-open your invite email', icon: Laptop, href: getAssetUrl(release, /-setup\.exe$/), accent: platform === 'windows' },
      { label: 'Linux (.deb)', sub: 'Download & install, then re-open your invite email', icon: Laptop, href: getAssetUrl(release, /\.deb$/), accent: platform === 'linux' },
    ]
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex flex-col">
      <nav className="border-b border-white/10 px-6 h-16 flex items-center">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">RDP Bridge</span>
        </a>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {status === STATUS.LOADING && (
            <div className="text-center">
              <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Processing your invitation…</p>
            </div>
          )}

          {status === STATUS.TRYING_DEEPLINK && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center mx-auto mb-6">
                {(() => { const Icon = appIcon; return <Icon className={`w-8 h-8 ${appColor}`} /> })()}
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">Opening {appName}…</h1>
              <p className="text-slate-400 text-sm mb-2">
                A dialog should appear to open RDP Bridge.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-slate-500 text-sm">Waiting for app…</span>
              </div>
            </div>
          )}

          {status === STATUS.SUCCESS && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">App opened!</h1>
              <p className="text-slate-400 text-sm">
                Complete your signup in the RDP Bridge app.
              </p>
            </div>
          )}

          {status === STATUS.INVALID && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">Invalid invitation link</h1>
              <p className="text-slate-400 text-sm mb-6">
                This link is missing required parameters or has already been used. Please ask your admin to resend the invitation.
              </p>
              <a href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                ← Back to homepage
              </a>
            </div>
          )}

          {status === STATUS.NEEDS_DOWNLOAD && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-6">
                  <Download className="w-8 h-8 text-amber-400" />
                </div>
                <h1 className="text-white text-2xl font-bold mb-2">
                  {appName} isn&apos;t installed yet
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Download and install the app below.
                  {platform !== 'unknown' && (
                    <span className="text-slate-300"> We detected you&apos;re on <strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}</strong> — your recommended download is highlighted.</span>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {!releaseFetched
                  ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-5 h-5 text-blue-400 animate-spin mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">Fetching latest release…</p>
                    </div>
                  )
                  : release
                    ? getDownloadLinks().map(dl => <DownloadCard key={dl.label} {...dl} />)
                    : (
                      <a
                        href={`https://github.com/${isManager ? ADMIN_REPO : AGENT_REPO}/releases`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-3 border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl px-5 py-4 transition-all">
                        <Download className="w-5 h-5 text-blue-400" />
                        <div className="text-left">
                          <p className="text-white font-semibold">View all releases on GitHub</p>
                          <p className="text-slate-400 text-sm">Download the latest version for your platform</p>
                        </div>
                      </a>
                    )
                }
              </div>

              {releaseFetched && release && (
                <div className="text-center mb-4">
                  <a
                    href={`https://github.com/${isManager ? ADMIN_REPO : AGENT_REPO}/releases`}
                    target="_blank" rel="noreferrer"
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                    View all releases on GitHub ↗
                  </a>
                </div>
              )}

              <div className="border border-white/10 bg-white/5 rounded-xl p-4 text-sm text-slate-400">
                <p className="font-medium text-white mb-1">After installing:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open the app once to complete setup</li>
                  <li>Come back and re-click the invite link in your email</li>
                  <li>The app will open automatically and prompt you to set your password</li>
                </ol>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Already installed? Try opening again →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
