import { useEffect, useRef, useState } from "react";
import {
  SkinViewer,
  WalkingAnimation,
  IdleAnimation,
  RunningAnimation,
} from "skinview3d";
import { apiClient } from "../api/client";
import PlayerAvatar from "./PlayerAvatar";

export default function SkinViewer3D({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);
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
    const v = viewerRef.current;
    if (!v) return;
    if (type === "idle") v.animation = new IdleAnimation();
    if (type === "walk") v.animation = new WalkingAnimation();
    if (type === "run") v.animation = new RunningAnimation();
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 text-red-500">
        <PlayerAvatar name={name} size={128} />
        <p>Could not load skin</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} />
      <select
        className="px-2 py-1 rounded border"
        onChange={(e) => changeAnimation(e.target.value)}
      >
        <option value="idle">Idle</option>
        <option value="walk">Walk</option>
        <option value="run">Run</option>
      </select>
    </div>
  );
}
