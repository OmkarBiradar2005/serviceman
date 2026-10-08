import React, { useState, useEffect } from 'react';

const Timer = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    // Calculate initial elapsed time
    const calculateElapsed = () => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      return Math.floor((now - start) / 1000); // elapsed time in seconds
    };

    // Set initial time
    setElapsedTime(calculateElapsed());

    // Update timer every second
    const interval = setInterval(() => {
      setElapsedTime(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (!startTime) return null;

  return (
    <div className="d-flex align-items-center">
      <span 
        className="badge bg-info me-2" 
        style={{ 
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          minWidth: '80px'
        }}
      >
        ⏱️ {formatTime(elapsedTime)}
      </span>
    </div>
  );
};

export default Timer;
