export function FullScreenLoader() {
  return (
    <div
      aria-live="polite"
      className="flex min-h-dvh items-center justify-center bg-muted"
      role="status"
    >
      <p className="text-muted-foreground text-sm">Carregando…</p>
    </div>
  )
}
