const REPOS = {
  admin: 'mohamedbenhadjer/ultimate-rdp-admin',
  agent: 'Flower-City-Online/ultimate-rdp',
}

export default async function handler(req, res) {
  const { app } = req.query
  const repo = REPOS[app]

  if (!repo) {
    return res.status(400).json({ error: 'Invalid app param. Use ?app=admin or ?app=agent' })
  }

  const token = process.env.GITHUB_TOKEN
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    let release = null

    const latestRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers })
    if (latestRes.ok) {
      const data = await latestRes.json()
      if (data?.assets?.length > 0) release = data
    }

    if (!release) {
      const listRes = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=5`, { headers })
      if (listRes.ok) {
        const list = await listRes.json()
        release = Array.isArray(list) ? (list.find(r => r?.assets?.length > 0) ?? null) : null
      }
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json(release ?? null)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch release', detail: err.message })
  }
}
