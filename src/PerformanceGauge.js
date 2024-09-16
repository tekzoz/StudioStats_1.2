import React, { useState, useEffect } from 'react';

const PerformanceGauge = ({ value, maxValue = 30 }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const percentage = (currentValue / maxValue) * 100;
  const angle = (percentage / 100) * 270 - 135; // -135 to 135 degrees

  useEffect(() => {
    const animationDuration = 2000; // 2 seconds
    const steps = 60; // 60 frames per second
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(timer);
        setIsAnimationComplete(true);
      }
      setCurrentValue(current);
    }, animationDuration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const getColor = (percent) => {
    if (percent < 33) return '#ff4d4d';
    if (percent < 66) return '#ffa500';
    return '#4CAF50';
  };

  const createTicks = () => {
    const ticks = [];
    for (let i = 0; i <= 5; i++) {
      const tickAngle = -135 + (i * 54); // 270 degrees / 5 = 54 degrees per tick
      const x1 = 50 + 38 * Math.cos(tickAngle * Math.PI / 180);
      const y1 = 50 + 38 * Math.sin(tickAngle * Math.PI / 180);
      const x2 = 50 + 45 * Math.cos(tickAngle * Math.PI / 180);
      const y2 = 50 + 45 * Math.sin(tickAngle * Math.PI / 180);
      
      ticks.push(
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeWidth="1.5" />
          <text 
            x={50 + 32 * Math.cos(tickAngle * Math.PI / 180)} 
            y={50 + 32 * Math.sin(tickAngle * Math.PI / 180)} 
            fontSize="6" 
            textAnchor="middle" 
            alignmentBaseline="middle"
            fill="#ffffff"
          >
            {i * 20}
          </text>
        </g>
      );
    }
    return ticks;
  };

  return (
    <div style={{ width: '200px', height: '200px', margin: '20px auto' }}>
      <svg viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r="49" fill="#121212" />
        
        {/* Outer circle (border) */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#555555" strokeWidth="8" />
        
        {/* Colored arc based on percentage */}
        <path
          d={`M50,50 L${50 + 45 * Math.cos(-135 * Math.PI / 180)},${50 + 45 * Math.sin(-135 * Math.PI / 180)} A45,45 0 ${percentage > 50 ? 1 : 0},1 ${50 + 45 * Math.cos(angle * Math.PI / 180)},${50 + 45 * Math.sin(angle * Math.PI / 180)} Z`}
          fill={getColor(percentage)}
        />
        
        {/* Tick marks and labels */}
        {createTicks()}
        
        {/* Needle */}
        <line
          x1="50"
          y1="50"
          x2={50 + 40 * Math.cos(angle * Math.PI / 180)}
          y2={50 + 40 * Math.sin(angle * Math.PI / 180)}
          stroke="#ffffff"
          strokeWidth="1.5"
          className={isAnimationComplete ? 'trembling' : ''}
        />
        
        {/* Center circle */}
        <circle cx="50" cy="50" r="3" fill="#ffffff" />
        
        {/* Percentage text */}
        <text x="27.5" y="55" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">
          {percentage.toFixed(1)}%
        </text>
      </svg>
      <style jsx>{`
        @keyframes tremble {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-0.5deg); }
          100% { transform: rotate(0deg); }
        }
        .trembling {
          animation: tremble 0.1s infinite;
          transform-origin: 50% 50%;
        }
      `}</style>
    </div>
  );
};

export default PerformanceGauge;