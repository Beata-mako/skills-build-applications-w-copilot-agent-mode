import { useEffect, useMemo, useState } from 'react'

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.leaderboard)) {
    return payload.leaderboard
  }

  return []
}

function Leaderboard() {
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const apiPath = '/api/leaderboard/'

  const endpoint = useMemo(() => {
    const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
    if (!codespaceName) {
      return apiPath
    }

    return `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadLeaderboard = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(endpoint, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setRows(normalizeCollection(payload))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Leaderboard</h2>
        <p className="text-muted mb-3">Endpoint: {endpoint}</p>

        {isLoading && <p className="mb-0">Loading leaderboard...</p>}

        {!isLoading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            Could not load leaderboard: {error}
          </div>
        )}

        {!isLoading && !error && rows.length === 0 && (
          <p className="mb-0">No leaderboard rows found.</p>
        )}

        {!isLoading && !error && rows.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Score</th>
                  <th scope="col">Raw Data</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id ?? row._id ?? `leaderboard-${index}`}>
                    <th scope="row">{row.rank ?? index + 1}</th>
                    <td>{row.user ?? row.username ?? row.name ?? 'Unknown user'}</td>
                    <td>{row.score ?? row.points ?? '-'}</td>
                    <td>
                      <pre className="m-0 small bg-light p-2 rounded border">
                        {JSON.stringify(row, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Leaderboard
