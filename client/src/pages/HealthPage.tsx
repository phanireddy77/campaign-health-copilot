import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";

interface CampaignHealthData {
  status: string;
  service: string;
  database: string;
  timestamp: string;
}
const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function HealthCheck() {
 const [health, setHealth] = useState<CampaignHealthData | null>(null);
 const  [error, setError] = useState<string | null>(null);

 useEffect(()=> {
   fetch(`${APP_BASE_URL}/health`)
   .then(async (response) => {
     const body = await response.json();
     if (!response.ok) {
       throw new Error(body.error?.message ?? `API returned ${response.status}`);
     }
     return body;
   })
   .then((data) => { setHealth(data) })
   .catch((error) => setError(error.message));

  }, []);
 return (
  <section>
    <div className="page-header">
      <h2>System status</h2>
      <p className="page-subtitle">Live status of the Campaign Health API and its database.</p>
    </div>
    {!health && !error && <p className="state-message">Checking system status...</p>}
    {error && <p className="state-message state-error" role="alert">Error: {error}</p>}
    {health && (
      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">API</span>
          <StatusBadge value={health.status} />
        </div>
        <div className="stat">
          <span className="stat-label">Database</span>
          <StatusBadge value={health.database} />
        </div>
        <div className="stat">
          <span className="stat-label">Service</span>
          <span className="stat-value-sm">{health.service}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Checked at</span>
          <span className="stat-value-sm">{new Date(health.timestamp).toLocaleString()}</span>
        </div>
      </div>
    )}
  </section>
 )
}

export default HealthCheck;
