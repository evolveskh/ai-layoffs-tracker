const SECTORS = ['All', 'Big Tech', 'SaaS', 'Semiconductor', 'E-commerce', 'Enterprise', 'Other'];

export default function FilterBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#1e293b] border border-slate-600 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
    >
      {SECTORS.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
