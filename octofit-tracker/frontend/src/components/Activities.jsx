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

function Activities() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const apiPath = '/api/activities/'

  const endpoint = useMemo(() => {
    const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
    if (!codespaceName) {
      return apiPath
    }

    return `https://${codespaceName}-8000.app.github.dev/api/activities/`
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadActivities = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(endpoint, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setActivities(normalizeCollection(payload))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Activities</h2>
        <p className="text-muted mb-3">Endpoint: {endpoint}</p>

        {isLoading && <p className="mb-0">Loading activities...</p>}

        {!isLoading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            Could not load activities: {error}
          </div>
        )}

        {!isLoading && !error && activities.length === 0 && (
          <p className="mb-0">No activities found.</p>
        )}

        {!isLoading && !error && activities.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity.id ?? activity._id ?? `activity-${index}`}>
                    <th scope="row">{index + 1}</th>
                    <td>{activity.name ?? activity.activityName ?? 'Unnamed activity'}</td>
                    <td>
                      <pre className="m-0 small bg-light p-2 rounded border">
                        {JSON.stringify(activity, null, 2)}
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

export default Activities
