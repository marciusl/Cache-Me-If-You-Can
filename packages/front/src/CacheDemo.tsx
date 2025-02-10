import React, { useState } from "react";

type CacheDemoProps = {
  strategy: string;
  apiUrl: string;
};

function CacheDemo({ strategy, apiUrl }: CacheDemoProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setUpdateStatus("");
      const start = Date.now();
      const response = await fetch("http://localhost:8000" + apiUrl);
      const result = await response.json();
      const latency = Date.now() - start;

      setData(result);
      setUpdateStatus(`Fetched in ${latency}ms`);
    } catch (error) {
      console.error("Error:", error);
      setUpdateStatus("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-box">
      <h2>{strategy} Strategy</h2>
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Data"}
      </button>

      {data && (
        <div className="data-box">
          <h3>Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {updateStatus && <div className="status">{updateStatus}</div>}
    </div>
  );
}

export default CacheDemo;
