import { useEffect, useRef, useState } from "react";
import {
  SkinViewer,
  WalkingAnimation,
  IdleAnimation,
  RunningAnimation,
} from "skinview3d";
import { apiClient } from "../api/client";
import PlayerAvatar from "./PlayerAvatar";

const ANIMATIONS = [
  { value: "idle", label: "Idle" },
  { value: "walk", label: "Walk" },
  { value: "run", label: "Run" },
];

export default function SkinViewer3D({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);
  const [animation, setAnimation] = useState("walk");
  const [error, setError] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;

    async function load() {
      try {
        const res = await apiClient.get(`/players/${name}/skin`, {
          responseType: "blob",
        });
        if (cancelled) return;
        url = URL.createObjectURL(res.data);

        const viewer = new SkinViewer({
          canvas: canvasRef.current!,
          width: 300,
          height: 400,
        });
        viewerRef.current = viewer;
        await viewer.loadSkin(url);
        viewer.animation = new WalkingAnimation();
        setAnimation("walk");
      } catch {
        setError(true);
      }
    }
    load();

    return () => {
      cancelled = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
      if (url) URL.revokeObjectURL(url);
    };
  }, [name]);

  function changeAnimation(type: string) {
    const viewer = viewerRef.current;
    if (!viewer) return;
    setAnimation(type);
    if (type === "idle") viewer.animation = new IdleAnimation();
    if (type === "walk") viewer.animation = new WalkingAnimation();
    if (type === "run") viewer.animation = new RunningAnimation();
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 p-2">
        <PlayerAvatar name={name} size={128} />
        <p className="mc-error">Could not load the skin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mc-slot w-full p-2">
        <canvas
          ref={canvasRef}
          className="block h-auto max-w-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {ANIMATIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              "mc-btn mc-btn-sm" +
              (animation === option.value ? " mc-btn-primary" : "")
            }
            onClick={() => changeAnimation(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
