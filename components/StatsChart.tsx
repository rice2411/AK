import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Task } from '../types';

interface StatsChartProps {
  tasks: Task[];
  isDarkMode?: boolean;
}

const StatsChart: React.FC<StatsChartProps> = ({ tasks, isDarkMode = false }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500">
        No data to display
      </div>
    );
  }

  // Aggregate data by status
  const statusData = tasks.reduce((acc: any[], task) => {
    const existing = acc.find(item => item.name === task.status_extra_info.name);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({
        name: task.status_extra_info.name,
        count: 1,
        color: task.status_extra_info.color
      });
    }
    return acc;
  }, []);

  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#1e293b';

  return (
    <div className="h-72 w-full rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">Task Status Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: axisColor }} 
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: axisColor }} 
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
            contentStyle={{ 
              backgroundColor: tooltipBg,
              color: tooltipText,
              borderRadius: '8px', 
              border: isDarkMode ? '1px solid #334155' : 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
