export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm sm:flex-row">
        <p>© {new Date().getFullYear()} Pensil. Kumpulan blog random.</p>
        <p>Ditulis pelan-pelan, dibaca santai.</p>
      </div>
    </footer>
  );
}
