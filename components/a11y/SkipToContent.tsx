export function SkipToContent({ label = "Skip to main content" }: { label?: string }) {
  return (
    <a href="#main-content" className="skip-link">
      {label}
    </a>
  );
}
