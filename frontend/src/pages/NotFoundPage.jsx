import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-maroon-500">404</p>
      <h1 className="mt-3 font-heading text-5xl text-maroon">Page not found</h1>
      <p className="mt-5 text-lg text-ink/70">The page you are looking for does not exist. Head back to the hotel homepage.</p>
      <Link to="/" className="mt-8 rounded-full bg-maroon px-6 py-3 font-semibold text-white">
        Return Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
