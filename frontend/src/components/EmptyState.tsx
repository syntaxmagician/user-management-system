interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 text-3xl">
        &#128101;
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">{title}</h2>
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}
