import React, { useEffect, useState } from 'react';

const API_BASE = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
const ENDPOINT = `${API_BASE}/api/activities/`;

export default function Activities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    console.log('[Activities] Fetching from:', ENDPOINT);
    fetch(ENDPOINT, { headers: { 'Accept': 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json) ? json : (json.results ?? []);
        console.log('[Activities] Raw data:', json);
        console.log('[Activities] Items:', items);
        setData(items);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Activities</h2>
          <div>
            <button className="btn btn-sm btn-primary me-2" onClick={() => { setLoading(true); load(); }}>Refresh</button>
            <a className="btn btn-sm btn-outline-secondary" href={ENDPOINT} target="_blank" rel="noreferrer">Open API</a>
          </div>
        </div>
        {loading && <div className="alert alert-info">Loading activities...</div>}
        {error && <div className="alert alert-danger">Error: {error}</div>}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="3" className="text-center">No activities found.</td></tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={item.id ?? idx}>
                      <td>{item.id ?? idx + 1}</td>
                      <td>{item.name ?? item.title ?? '—'}</td>
                      <td><code>{JSON.stringify(item)}</code></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
