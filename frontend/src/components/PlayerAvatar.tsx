import { useState } from "react";

export default function PlayerAvatar({
  name,
  size = 32,
}: {
  name: string;
  size?: number;
}) {
  const [attempt, setAttempt] = useState(0);

  const avatarUrls = [
    `https://minotar.net/helm/${name}/${size}.png`,
    `https://mc-heads.net/avatar/${name}/${size}.png`,
  ];

  if (attempt >= avatarUrls.length) {
    return (
      <div
        className="mc-avatar mc-avatar-fallback"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={avatarUrls[attempt]}
      width={size}
      height={size}
      className="mc-avatar"
      alt={name}
      onError={() => setAttempt((prev) => prev + 1)}
    />
  );
}
