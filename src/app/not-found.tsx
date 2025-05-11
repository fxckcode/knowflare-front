import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>Page Not Found</h2>
      <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Link href="/">
        Go back to the home page
      </Link>
    </div>
  );
}