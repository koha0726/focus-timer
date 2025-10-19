"use client";
import { useState, useEffect } from "react";

const DEFAULT_TIME = 25 * 60; //25分(秒単位)


export default function FocusTimer() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);

  // 残り時間を分:秒の形式に変換
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // タイマーの動作
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎯 Focus Timer</h1>
      <h2>{formatTime(time)}</h2>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={() => setTime(DEFAULT_TIME)}>Reset</button>
      </div>
    </div>
  );
}
