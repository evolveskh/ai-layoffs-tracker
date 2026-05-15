export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-slate-500 mb-4">404</h1>
      <p className="text-slate-400 mb-6">Company not found</p>
      <a href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
        Back to Home
      </a>
    </div>
  );
}
