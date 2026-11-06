export default function Brand({
  subtitle = "Server control panel",
}: {
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="mc-grass-block" aria-hidden="true" />
      <div>
        <p className="mc-logo">
          Craft<span className="mc-logo-accent">Admin</span>
        </p>
        {subtitle && <p className="mc-logo-sub">{subtitle}</p>}
      </div>
    </div>
  );
}
