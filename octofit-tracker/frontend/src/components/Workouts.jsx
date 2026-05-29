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

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const apiPath = '/api/workouts/'

  const endpoint = useMemo(() => {
    const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
    if (!codespaceName) {
      return apiPath
    }

    return `https://${codespaceName}-8000.app.github.dev${apiPath}`
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadWorkouts = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(endpoint, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setWorkouts(normalizeCollection(payload))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkouts()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Workouts</h2>
        <p className="text-muted mb-3">Endpoint: {endpoint}</p>

        {isLoading && <p className="mb-0">Loading workouts...</p>}

        {!isLoading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            Could not load workouts: {error}
          </div>
        )}

        {!isLoading && !error && workouts.length === 0 && (
          <p className="mb-0">No workouts found.</p>
        )}

        {!isLoading && !error && workouts.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Raw Data</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={workout.id ?? workout._id ?? `workout-${index}`}>
                    <th scope="row">{index + 1}</th>
                    <td>{workout.title ?? workout.name ?? 'Untitled workout'}</td>
                    <td>{workout.difficulty ?? '-'}</td>
                    <td>
                      <pre className="m-0 small bg-light p-2 rounded border">
                        {JSON.stringify(workout, null, 2)}
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

export default Workouts
