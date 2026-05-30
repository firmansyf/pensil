import Image from "next/image";
import { cn } from "@/lib/utils";

/** Avatar bulat: pakai foto bila ada, kalau tidak tampilkan inisial nama. */
export function Avatar({
  name,
  src,
  className,
}: {
  name?: string | null;
  src?: string | null;
  className?: string;
}) {
  const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={cn(
        "bg-muted text-muted-foreground relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold uppercase",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name ?? "Avatar"} fill sizes="40px" className="object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
