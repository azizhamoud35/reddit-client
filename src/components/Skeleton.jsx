export default function Skeleton() {
  return (
    <div className="skeleton post" aria-hidden="true">
      <div className="skeleton__votes">
        <div className="skeleton__block skeleton__block--sm" />
        <div className="skeleton__block skeleton__block--sm" />
        <div className="skeleton__block skeleton__block--sm" />
      </div>
      <div className="skeleton__content">
        <div className="skeleton__block skeleton__block--xs" />
        <div className="skeleton__block skeleton__block--lg" />
        <div className="skeleton__block skeleton__block--img" />
        <div className="skeleton__block skeleton__block--sm" />
      </div>
    </div>
  );
}
