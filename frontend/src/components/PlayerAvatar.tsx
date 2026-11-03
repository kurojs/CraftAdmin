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
        className="bg-gray-300 rounded-full"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={avatarUrls[attempt]}
      width={size}
      height={size}
      className="rounded-full"
      alt={name}
      onError={() => setAttempt((prev) => prev + 1)}
    />
  );
}
