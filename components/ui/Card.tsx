interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-lg dark:shadow-black/20 dark:ring-1 dark:ring-white/5 ${className}`}
    >
      {children}
    </div>
  );
}
