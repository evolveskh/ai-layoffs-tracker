export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-[#525252] mb-4">404</h1>
      <p className="text-[#a3a3a3] mb-6">Company not found</p>
      <a href="/" className="px-4 py-2 border border-[#262626] text-[#fafafa] hover:bg-[#0a0a0a] hover:border-[#525252] transition-colors duration-150">
        Back to Home
      </a>
    </div>
  );
}
