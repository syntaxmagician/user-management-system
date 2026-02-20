export function UserTableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Nama</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Email</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Tanggal Dibuat</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
