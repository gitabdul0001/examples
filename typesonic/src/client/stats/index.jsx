import React from 'react';

export function SpeedWidget({ speed }) {
  return (
    <div className="text-2xl font-['Tahoma'] text-indigo-900 bg-white border border-gray-200 rounded-md px-2.5 py-1">
      {speed === null ? '---' : Math.round(speed)} WPM
    </div>
  );
}
