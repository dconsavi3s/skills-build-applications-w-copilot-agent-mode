import React, { useEffect, useState } from 'react';

const ENDPOINT = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    console.log('[Users] Fetching from:', ENDPOINT);
    fetch(ENDPOINT, { headers: { 'Accept': 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json) ? json : (json.results ?? []);
        console.log('[Users] Raw data:', json);
        console.log('[Users] Items:', items);
        setData(items);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Users</h2>
          <div>
            <button className="btn btn-sm btn-primary me-2" onClick={() => { setLoading(true); load(); }}>Refresh</button>
            <a className="btn btn-sm btn-outline-secondary" href={ENDPOINT} target="_blank" rel="noreferrer">Open API</a>
          </div>
        </div>
        {loading && <div className="alert alert-info">Loading users...</div>}
        {error && <div className="alert alert-danger">Error: {error}</div>}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="4" className="text-center">No users found.</td></tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={item.id ?? idx}>
                      <td>{item.id ?? idx + 1}</td>
                      <td>{item.username ?? '—'}</td>
                      <td>{item.email ?? '—'}</td>
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
