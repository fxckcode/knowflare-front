import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
      <h4 className="text-[120px] font-bold">404</h4>

      <div className="space-y-2 mt-9 flex flex-col justify-center items-center">
        <h2 className="text-2xl text-center font-bold">Page Not Found</h2>
        <p className="text-gray-500 text-center">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link href="/" className="mt-4">
          <button className="bg-brand-green text-white px-4 py-2 rounded-md cursor-pointer">
            Go back to the home page
          </button>
        </Link>
      </div>
    </div>
  );
}