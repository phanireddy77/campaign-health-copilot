import { useState, useEffect } from "react";

interface CampaignHealthData {
  status: string;
  service: string;
  database: string;
  timestamp: string;
}

function HealthCheck() {
 const [health, setHealth] = useState<CampaignHealthData | null>(null);
 const  [error, setError] = useState<string | null>(null);

 useEffect(()=> {
  fetch('http://localhost:3001/api/health')
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Campaign Health API returned status ${res.status}`);
    }
    return res.json();
  })
  .then((data) => setHealth(data))
  .catch((error) => {
    setError(error.message);
  })
 , []});
 return (
  <>
  <main>
    <h1>Campaign Health</h1>
    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    {health ? (
      <div>
        <p>Status: {health.status}</p>
        <p>Service: {health.service}</p>
        <p>Database: {health.database}</p>
        <p>Timestamp: {health.timestamp}</p>
      </div>
    ) : (
      !error && <p>Loading...</p>
    )}
  </main>
  </>
 )
}

export default HealthCheck;