"use client";
import { useState, useEffect, useRef } from "react";

const DEFAULT_TIME = 25; //25分(秒単位)


export default function FocusTimer() {
  const [time, setTime] = useState<number>(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [history, setHistory] = useState<{start: string; end: string}[]>([]);

  const hasRecorded = useRef(false); // 二重記録防止

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

    // 一旦リセット
    hasRecorded.current = false;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setTime(0);

          // 二重記録防止
          if (hasRecorded.current) {
            return 0;
          }
          hasRecorded.current = true;




          // 履歴
          
          // 終了時間の記録
          const endTime = new Date().toLocaleString();

          if (startTime) {
            const newRecord = {start: startTime, end: endTime};
            setHistory((prevHistory) => {
              const updated = [newRecord, ...prevHistory];
              localStorage.setItem("focusHistory", JSON.stringify(updated));
              return updated;
            });
            setStartTime(null); // リセット
          }
          return 0;

        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, startTime]);


// スタートボタン
const handleStart = () => {
  if (!isRunning) {
    setStartTime(new Date().toLocaleString());
    setIsRunning(true);
  }
};


// リセットボタン
const handleReset = () => {
  setIsRunning(false);
  setTime(DEFAULT_TIME);
  setStartTime(null);
};

// 履歴クリアボタン
const handleHistoryClear = () => {
  setHistory([]);
  localStorage.removeItem("focusHistory");
};




  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎯 Focus Timer</h1>
      <h2>{formatTime(time)}</h2>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleStart}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={handleReset}>Reset</button>
      </div>

          {/* 履歴表示 */}
          <div style={{marginTop: "40px"}}>
            <h3>🕒 履歴</h3>

            <button onClick={handleHistoryClear} style={{marginBottom: "10px"}}>履歴クリア</button>

            {history.length === 0 ? (
              <p>まだ記録はありません。</p>
            ) : (
              <ul style={{listStyle: "none", padding: 0}}>
                {history.map((record, index) => (
                  <li key={index}>
                    {record.start} → {record.end}</li>
                ))}
              </ul>
            )}
          </div>
    </div>
  );
}
