import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarRange, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';
import { Task } from '../types';

interface YearlyOverviewProps {
  tasks: Task[];
  isDarkMode?: boolean;
}

const YearlyOverview: React.FC<YearlyOverviewProps> = ({ tasks, isDarkMode = false }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const changeYear = (offset: number) => {
    setCurrentYear(prev => prev + offset);
  };

  const yearlyData = useMemo(() => {
    // Initialize months
    const months = Array.from({ length: 12 }, (_, i) => {
      return {
        name: new Date(0, i).toLocaleString('default', { month: 'short' }),
        total: 0,
        done: 0,
        index: i
      };
    });

    tasks.forEach(task => {
      const date = new Date(task.created_date);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        months[monthIndex].total += 1;
        if (task.status_extra_info.name === 'DONE') {
          months[monthIndex].done += 1;
        }
      }
    });

    return months;
  }, [tasks, currentYear]);

  const totalTasksInYear = yearlyData.reduce((acc, curr) => acc + curr.total, 0);

  // Custom Chart Colors
  const barColor = '#6366f1'; // Indigo
  const doneColor = '#10b981'; // Emerald
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      
      {/* Year Picker Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <CalendarRange size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Yearly Overview {currentYear}</h2>
            <p className="text-sm text-slate-500">Total Tasks Created: <span className="font-semibold text-slate-800 dark:text-slate-200">{totalTasksInYear}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
          <button onClick={() => changeYear(-1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-slate-600 dark:text-slate-300">
            <ChevronLeft size={20} />
          </button>
          <span className="min-w-[80px] text-center font-bold text-xl text-slate-800 dark:text-slate-200">
            {currentYear}
          </span>
          <button onClick={() => changeYear(1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-slate-600 dark:text-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
           <TrendingUp size={18} className="text-slate-400" /> 
           Task Volume by Month
        </h3>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: textColor }} 
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: textColor }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
                contentStyle={{ 
                  backgroundColor: tooltipBg,
                  color: isDarkMode ? '#f8fafc' : '#0f172a',
                  borderRadius: '12px', 
                  border: `1px solid ${tooltipBorder}`,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar name="Total Tasks" dataKey="total" fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar name="Completed" dataKey="done" fill={doneColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default YearlyOverview;
