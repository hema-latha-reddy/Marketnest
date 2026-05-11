import React from 'react';

const MetricCard = ({ title, value, icon, color = "bg-indigo-50 text-indigo-600" }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</p>
        <h4 className="text-3xl font-bold text-slate-900 mt-2">{value}</h4>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        {icon || (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default MetricCard;