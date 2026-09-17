import { useState, useEffect } from "react";

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
   .then((response) => response.json())
   .then((data) => { setHealth(data) })
   .catch((error) => setError(error.message));

  }, []);
 return (
  <>
  <main>
    <h1>Campaign Health</h1>
    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    {health && (
      <div>
        <p>Status: {health.status}</p>
        <p>Service: {health.service}</p>
        <p>Database: {health.database}</p>
        <p>Timestamp: {health.timestamp}</p>
      </div>
    )}
  </main>
  </>
 )
}

export default HealthCheck;