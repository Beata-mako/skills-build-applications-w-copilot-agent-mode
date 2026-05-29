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

  return []
}

function Teams() {
  const [teams, setTeams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const apiPath = '/api/teams/'

  const endpoint = useMemo(() => {
    const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
    if (!codespaceName) {
      return apiPath
    }

    return `https://${codespaceName}-8000.app.github.dev/api/teams/`
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadTeams = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(endpoint, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setTeams(normalizeCollection(payload))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTeams()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Teams</h2>
        <p className="text-muted mb-3">Endpoint: {endpoint}</p>

        {isLoading && <p className="mb-0">Loading teams...</p>}

        {!isLoading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            Could not load teams: {error}
          </div>
        )}

        {!isLoading && !error && teams.length === 0 && <p className="mb-0">No teams found.</p>}

        {!isLoading && !error && teams.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Team Name</th>
                  <th scope="col">Members</th>
                  <th scope="col">Raw Data</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.id ?? team._id ?? `team-${index}`}>
                    <th scope="row">{index + 1}</th>
                    <td>{team.name ?? team.teamName ?? 'Unnamed team'}</td>
                    <td>{team.membersCount ?? team.members?.length ?? '-'}</td>
                    <td>
                      <pre className="m-0 small bg-light p-2 rounded border">
                        {JSON.stringify(team, null, 2)}
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

export default Teams
