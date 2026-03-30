interface PageStateProps {
  message: string;
  detail: string;
}

export function LoadingState({ message, detail }: PageStateProps) {
  return (
    <div className="min-h-screen bg-cosmos noise-overlay flex items-center justify-center">
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[hsl(var(--eleme))] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[hsl(var(--meituan))] animate-spin-slow"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[hsla(var(--eleme),0.2)] to-[hsla(var(--meituan),0.2)]"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-foreground/90">{message}</p>
          <p className="text-sm text-foreground/50 mt-1">{detail}</p>
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ message, detail }: PageStateProps) {
  return (
    <div className="min-h-screen bg-cosmos noise-overlay flex items-center justify-center">
      <div className="glass-card rounded-2xl p-8 border-red-500/30">
        <div className="flex items-center gap-3 text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-medium">{message}</p>
            <p className="text-sm text-red-200/80">{detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
