import type { ReactNode } from "react";

/* The page-wide content measure. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/* A section of the page. The rhythm is calmer than the flood-fill bands it
   replaces — 96px rather than 120px, because without big blocks of colour the
   whitespace no longer has to fight for separation. */
export function Band({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

/* Small tracked label above a heading, with an optional colour rule. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`eyebrow mb-4 text-brand ${className}`}>{children}</p>
  );
}

/* A quiet section header used across the page for consistent rhythm. */
export function SectionHead({
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto text-center" : ""} max-w-[52ch] ${className}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="heading display-section">{title}</h2>
      {body && (
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{body}</p>
      )}
    </div>
  );
}
