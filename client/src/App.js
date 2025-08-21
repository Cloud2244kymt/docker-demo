// client/src/App.js
import "./App.css";

const Badge = ({ children }) => <span className="badge">{children}</span>;
const Card = ({ title, children }) => (
  <div className="card">
    <div className="card-title">{title}</div>
    {children}
  </div>
);

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <Badge>CI/CD Demo</Badge>
        <h1>Node + Jenkins + Docker</h1>
        <p>
          Automated <b>build</b> → <b>test</b> → <b>push</b> → <b>deploy</b>
        </p>
      </header>

      <main className="grid">
        <Card title="Deployment Status">
          <div className="status">
            <span className="dot" />
            <span>Healthy</span>
          </div>
          <p className="muted">
            This page is served from the running container.
          </p>
        </Card>

        <Card title="Pipeline">
          <ul className="list">
            <li>Checkout from GitHub</li>
            <li>Build Docker image</li>
            <li>
              Smoke test via <code>/healthz</code>
            </li>
            <li>Push to Docker Hub</li>
            <li>Deploy container</li>
          </ul>
        </Card>

        <Card title="Links">
          <ul className="list">
            <li>
              <a href="/healthz" target="_blank" rel="noreferrer">
                Health endpoint
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Cloud2244kymt/docker-demo"
                target="_blank"
                rel="noreferrer"
              >
                GitHub repo
              </a>
            </li>
            <li>
              <a
                href="https://hub.docker.com/r/cuddlycloud2244/docker-demo"
                target="_blank"
                rel="noreferrer"
              >
                Docker Hub repo
              </a>
            </li>
          </ul>
        </Card>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} CI/CD Sample
      </footer>
    </div>
  );
}
