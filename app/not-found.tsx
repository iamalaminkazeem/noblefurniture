import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] text-center px-6">
      <div>
        <div className="serif text-7xl text-[#0B3D2E] mb-4">404</div>
        <h1 className="serif text-2xl font-light mb-3">This page doesn't exist</h1>
        <p className="text-[#1E1E1E]/60 mb-8">The page you're looking for may have moved or been removed.</p>
        <Link href="/" className="inline-block bg-[#0B3D2E] text-white px-7 py-3.5 text-sm">Back to Home</Link>
      </div>
    </div>
  );
}