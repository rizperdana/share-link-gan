import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>This page doesn&apos;t exist. Maybe the username is wrong?</p>
      <Link href="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}
