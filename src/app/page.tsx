"use client";
import { useState, useEffect } from "react";

const DEFAULT_TIME = 25; //25分(秒単位)


export default function FocusTimer() {
  const [time, setTime] = useState<number>(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  // 残り時間を分:秒の形式に変換
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 起動時履歴読み込み
useEffect(() => {
  const saved = localStorage.getItem("focusHistory");
  if (saved) {
    setHistory(JSON.parse(saved));
  }
}, []);


  // タイマーの動作
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setTime(0);


          // 履歴
          
         setHistory((prevHistory) => {
            const newRecord = new Date().toLocaleString(); // 時刻付きに変更
            const updated = [newRecord, ...prevHistory];
            localStorage.setItem("focusHistory", JSON.stringify(updated));
            return updated;
          });
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
        <button onClick={() => {
          setIsRunning(false);
          setTime(DEFAULT_TIME);
          }}>Reset</button>
      </div>

          {/* 履歴表示 */}
          <div style={{marginTop: "40pz"}}>
            <h3>🕒 履歴</h3>
            {history.length === 0 ? (
              <p>まだ記録はありません。</p>
            ) : (
              <ul style={{listStyle: "none", padding: 0}}>
                {history.map((record, index) => (
                  <li key={index}>{record}</li>
                ))}
              </ul>
            )}
          </div>
    </div>
  );
}
