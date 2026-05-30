export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row">
        <p>© {new Date().getFullYear()} Pensil. Kumpulan blog random.</p>
        <p>Dibangun dengan Next.js, Express & Sequelize.</p>
      </div>
    </footer>
  );
}
