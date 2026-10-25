import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state">
      <p className="eyebrow">OUTSIDE THE WORLD BORDER</p>
      <h1>This route hasn’t been mapped.</h1>
      <Link className="button" href="/">
        Back to your workspace
      </Link>
    </div>
  );
}
