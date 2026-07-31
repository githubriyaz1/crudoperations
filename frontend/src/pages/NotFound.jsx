import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page-shell">
      <div className="container soft-card p-10 text-center">
        <p className="eyebrow">404</p>
        <h1 className="font-display mt-2 text-5xl font-bold">Page Not Found</h1>
        <p className="mt-3 text-[#746c60]">
          The page you are looking for does not exist.
        </p>
        <Link className="btn btn-gold mt-6" to="/">
          Back Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
