import "./App.css";
import CacheDemo from "./CacheDemo";

function App() {
  return (
    <div className="App">
      <h1>Cache Me If You Can: Adventures in Service Workers</h1>

      <CacheDemo strategy="Cache First" apiUrl="/api/cache-first" />

      <CacheDemo strategy="Network First" apiUrl="/api/network-first" />

      <CacheDemo
        strategy="Stale-While-Revalidate"
        apiUrl="/api/stale-while-revalidate"
      />
    </div>
  );
}

export default App;
