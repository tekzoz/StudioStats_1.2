import React from 'react';

export const MonthYearIcon = () => {
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  const monthAbbr = lastMonth.toLocaleString('it-IT', { month: 'short' }).toUpperCase();
  const year = lastMonth.getFullYear();

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <text x="50" y="40" fontSize="28" fontWeight="bold" textAnchor="middle" fill="#3B82F6" fontFamily="Arial, sans-serif">
        {monthAbbr}
      </text>
      <text x="50" y="75" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#3B82F6" fontFamily="Arial, sans-serif">
        {year}
      </text>
    </svg>
  );
};

export const DataInputIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

export const YearIcon = () => {
  const currentYear = new Date().getFullYear();

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <text x="50" y="60" fontSize="32" fontWeight="bold" textAnchor="middle" fill="#3B82F6" fontFamily="Arial, sans-serif">
        {currentYear}
      </text>
    </svg>
  );
};

export const CompareMonthsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="10" y="20" width="35" height="60" fill="#3B82F6" rx="5" ry="5" />
    <rect x="55" y="20" width="35" height="60" fill="#10B981" rx="5" ry="5" />
    <path d="M45,50 L55,50 M50,45 L55,50 L50,55" fill="none" stroke="#000" strokeWidth="2" />
  </svg>
);

export const CompareYearsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="10" y="20" width="35" height="60" fill="#3B82F6" rx="5" ry="5" />
    <rect x="55" y="20" width="35" height="60" fill="#10B981" rx="5" ry="5" />
    <text x="27" y="55" fontSize="12" fontWeight="bold" textAnchor="middle" fill="white">2023</text>
    <text x="72" y="55" fontSize="12" fontWeight="bold" textAnchor="middle" fill="white">2024</text>
    <path d="M45,50 L55,50 M50,45 L55,50 L50,55" fill="none" stroke="#000" strokeWidth="2" />
  </svg>
);

export const CalendarIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="10" y="20" width="80" height="70" fill="#f87171" />
    <rect x="20" y="30" width="20" height="20" fill="#fbbf24" />
    <rect x="60" y="30" width="20" height="20" fill="#fbbf24" />
  </svg>
);

export const PerformanceTrendIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <line x1="10" y1="90" x2="90" y2="90" stroke="#000" strokeWidth="2" />
    <line x1="10" y1="90" x2="10" y2="10" stroke="#000" strokeWidth="2" />
    <path d="M10,80 Q30,70 50,50 T90,20" fill="none" stroke="#10B981" strokeWidth="3" />
    <circle cx="10" cy="80" r="3" fill="#10B981" />
    <circle cx="50" cy="50" r="3" fill="#10B981" />
    <circle cx="90" cy="20" r="3" fill="#10B981" />
    <path d="M85,25 L90,20 L95,25" fill="none" stroke="#10B981" strokeWidth="2" />
  </svg>
);

export const InformationIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="45" fill="#3B82F6" />
    <text x="50" y="70" fontSize="60" fontWeight="bold" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif">
      i
    </text>
  </svg>
);