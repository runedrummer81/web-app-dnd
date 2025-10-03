export default function HomePage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>Velkommen til vores React App! 🚀</h1>
        <p className="subtitle">
          En moderne SPA bygget med Vite, React 19 og React Router 7
        </p>
        <div className="features">
          <div className="feature-card">
            <h3>⚡ Lynhurtig</h3>
            <p>Vite giver instant hot module replacement</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Moderne</h3>
            <p>Nyeste React 19 features</p>
          </div>
          <div className="feature-card">
            <h3>🔀 Routing</h3>
            <p>React Router 7 til navigation!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
