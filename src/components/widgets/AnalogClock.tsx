import { useState, useEffect } from "react";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="analog-clock-widget">
      <div className="clock-header">
        <h3>Waktu Real-Time</h3>
        <span className="time-display">
          {time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
      <div className="clock-container">
        <svg className="clock-face" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="white" stroke="#2563eb" strokeWidth="2" />

          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 50 + 42 * Math.cos(angle - Math.PI / 2);
            const y1 = 50 + 42 * Math.sin(angle - Math.PI / 2);
            const x2 = 50 + 45 * Math.cos(angle - Math.PI / 2);
            const y2 = 50 + 45 * Math.sin(angle - Math.PI / 2);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2563eb" strokeWidth="1.5" />
            );
          })}

          {/* Center dot */}
          <circle cx="50" cy="50" r="2" fill="#2563eb" />

          {/* Second hand */}
          <line
            x1="50"
            y1="50"
            x2={50 + 35 * Math.sin((secondDegrees * Math.PI) / 180)}
            y2={50 - 35 * Math.cos((secondDegrees * Math.PI) / 180)}
            stroke="#ef4444"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <line
            x1="50"
            y1="50"
            x2={50 + 30 * Math.sin((minuteDegrees * Math.PI) / 180)}
            y2={50 - 30 * Math.cos((minuteDegrees * Math.PI) / 180)}
            stroke="#1a202c"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Hour hand */}
          <line
            x1="50"
            y1="50"
            x2={50 + 20 * Math.sin((hourDegrees * Math.PI) / 180)}
            y2={50 - 20 * Math.cos((hourDegrees * Math.PI) / 180)}
            stroke="#1a202c"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="clock-date">
        {time.toLocaleDateString("id-ID", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
