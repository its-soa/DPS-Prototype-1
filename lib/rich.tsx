import { Fragment } from "react";

/** Renders **bold** markers inside translated strings, so translators control emphasis position. */
export function rich(text: string): React.ReactNode {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}
