export interface Toast {
  id: number;
  msg: string;
  kind: 'ok' | 'error';
}

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`} role={t.kind === 'error' ? 'alert' : 'status'}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
