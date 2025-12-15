import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  Sun, 
  Moon, 
  RotateCcw, 
  Loader2, 
  LayoutDashboard,
  CalendarDays,
  Calendar,
  CalendarRange,
  TrendingUp,
  CheckCircle,
  CheckSquare,
  Clock,
  AlertOctagon,
  ListFilter,
  Users
} from 'lucide-react';
import { Task, UserInfo } from './types';
// import { fetchMockTasks } from './services/mockService'; // Deprecated
import { taigaService } from './services/taigaService';
import { MAIN_GRADIENT } from './constants';
import CounterCard from './components/CounterCard';
import StatsChart from './components/StatsChart';
import MonthlyRanking from './components/MonthlyRanking';
import YearlyOverview from './components/YearlyOverview';
import WeeklyTracker from './components/WeeklyTracker';
import { 
  SummaryCard, 
  CompletionRate, 
  StatusDistribution, 
  TeamCard, 
  SummaryStats 
} from './components/DashboardWidgets';

type Tab = 'overview' | 'weekly' | 'monthly' | 'yearly';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('counttrack-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Auto-login and fetch
        const data = await taigaService.getAllTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('counttrack-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('counttrack-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const resetAllTasks = () => {
    if (window.confirm("Reload data from Taiga?")) {
        setIsLoading(true);
        taigaService.getAllTasks().then(data => {
            setTasks(data);
            setIsLoading(false);
        });
    }
  };

  // --- Filter Logic ---
  const filteredTasks = useMemo(() => {
    return tasks;
  }, [tasks]);

  // --- Calculations ---
  const stats: SummaryStats = useMemo(() => {
    const dataToAnalyze = tasks;
    return {
      total: dataToAnalyze.length,
      done: dataToAnalyze.filter(t => t.status_extra_info.name === 'DONE').length,
      mr: dataToAnalyze.filter(t => t.status_extra_info.name === 'MR').length,
      inProgressIncoming: dataToAnalyze.filter(t => ['In Coming', 'In Progress'].includes(t.status_extra_info.name)).length,
      pending: dataToAnalyze.filter(t => t.status_extra_info.name === 'Pending').length,
    };
  }, [tasks]);

  // --- Specific User Calculations (185 vs 193) ---
  const leadStats = useMemo(() => {
    const getStats = (id: number) => {
        const userTasks = tasks.filter(t => t.assigned_to === id);
        return {
            id,
            user: userTasks[0]?.assigned_to_extra_info || { full_name_display: `User ${id}`, photo: null } as Partial<UserInfo>,
            total: userTasks.length,
            done: userTasks.filter(t => t.status_extra_info.name === 'DONE').length,
            mr: userTasks.filter(t => t.status_extra_info.name === 'MR').length,
            progress: userTasks.filter(t => ['In Coming', 'In Progress'].includes(t.status_extra_info.name)).length,
            pending: userTasks.filter(t => t.status_extra_info.name === 'Pending').length
        };
    };

    return {
        user185: getStats(185),
        user193: getStats(193)
    };
  }, [tasks]);

  const completionRate = useMemo(() => {
    if (stats.total === 0) return 0;
    return parseFloat(((stats.done / stats.total) * 100).toFixed(1));
  }, [stats]);

  const teamData = useMemo(() => {
    // Team Stats used only in Overview
    const users = new Map<number, { info: UserInfo, tasks: Task[] }>();
    tasks.forEach(task => {
      if (task.assigned_to && task.assigned_to_extra_info) {
        if (!users.has(task.assigned_to)) {
          users.set(task.assigned_to, { info: task.assigned_to_extra_info, tasks: [] });
        }
        users.get(task.assigned_to)?.tasks.push(task);
      }
    });
    return Array.from(users.values());
  }, [tasks]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'weekly': return 'Weekly Tracker';
      case 'monthly': return 'Monthly Ranking Board';
      case 'yearly': return 'Yearly Analytics';
      default: return 'Dashboard Overview';
    }
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 group w-full
        ${activeTab === tab 
          ? 'text-white shadow-md' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
    >
      {/* Active Background Gradient for Sidebar Item */}
      {activeTab === tab && (
        <div className={`absolute inset-0 rounded-xl ${MAIN_GRADIENT} opacity-100 -z-10`} />
      )}
      
      {/* Hover Background Gradient (Subtle) */}
      {activeTab !== tab && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10`} />
      )}
      
      <Icon size={20} className={activeTab === tab ? 'text-white' : 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'} />
      <span className={`text-[10px] md:text-sm font-medium ${activeTab === tab ? 'text-white' : 'group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors'}`}>{label}</span>
    </button>
  );

  const MobileNavItem = ({ tab, icon: Icon }: { tab: Tab, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-300
        ${activeTab === tab 
          ? 'text-white shadow-lg -translate-y-2' 
          : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
    >
      {activeTab === tab && (
        <div className={`absolute inset-0 rounded-xl ${MAIN_GRADIENT} opacity-100 -z-10`} />
      )}
      <Icon size={24} />
    </button>
  );

  const LeadCard = ({ data, colorClass }: { data: any, colorClass: string }) => (
     <div className={`bg-white dark:bg-slate-900 rounded-xl p-5 border shadow-sm flex flex-col gap-4 relative overflow-hidden ${colorClass}`}>
         <div className="flex items-center gap-3 relative z-10">
             <img src={data.user.photo || ''} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-md object-cover bg-slate-200" alt="" />
             <div>
                 <h4 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{data.user.full_name_display}</h4>
                 <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 w-fit mt-1">
                    ID: {data.id}
                 </div>
             </div>
         </div>
         <div className="grid grid-cols-4 gap-2 relative z-10">
             <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                 <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{data.total}</div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold">Total</div>
             </div>
             <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                 <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.done}</div>
                 <div className="text-[10px] uppercase text-emerald-600/70 font-bold">Done</div>
             </div>
             <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                 <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{data.mr}</div>
                 <div className="text-[10px] uppercase text-purple-600/70 font-bold">MR</div>
             </div>
             <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/10">
                 <div className="text-xl font-bold text-red-600 dark:text-red-400">{data.pending}</div>
                 <div className="text-[10px] uppercase text-red-600/70 font-bold">Pend</div>
             </div>
         </div>
     </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-40">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
          <div 
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg ${MAIN_GRADIENT}`}
          >
            <LayoutGrid size={22} />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
            TaskTrack
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem tab="overview" label="Overview" icon={LayoutDashboard} />
          <NavItem tab="weekly" label="Weekly Tracker" icon={CalendarDays} />
          <NavItem tab="monthly" label="Monthly Board" icon={Calendar} />
          <NavItem tab="yearly" label="Yearly Analytics" icon={TrendingUp} />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center">
          v2.4.0 Pro
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col pb-24 md:pb-8">
        
        {/* Top Header with Gradient */}
        <header className={`${MAIN_GRADIENT} text-white shadow-md sticky top-0 z-30`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
               {getPageTitle()}
            </h2>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={resetAllTasks} className="p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
                 <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
               <Loader2 size={40} className="animate-spin text-indigo-500" />
            </div>
          ) : (
            <>
              {/* --- OVERVIEW TAB CONTENT --- */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  
                  {/* Team Split Counter (185 vs 193) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <LeadCard data={leadStats.user185} colorClass="border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors" />
                      <LeadCard data={leadStats.user193} colorClass="border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors" />
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <SummaryCard title="Total Tasks" count={stats.total} type="blue" icon={<TrendingUp size={24} />} />
                    <SummaryCard title="DONE" count={stats.done} type="green" icon={<CheckCircle size={24} />} />
                    <SummaryCard title="MR" count={stats.mr} type="purple" icon={<CheckSquare size={24} />} />
                    <SummaryCard title="In Progress" count={stats.inProgressIncoming} type="orange" icon={<Clock size={24} />} />
                    <SummaryCard title="Pending" count={stats.pending} type="red" icon={<AlertOctagon size={24} />} />
                  </div>

                  {/* Progress & Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CompletionRate percentage={completionRate} estimatedHours={411} actualHours={411} />
                    <StatusDistribution stats={stats} />
                  </div>

                  {/* Team Stats */}
                  <div className="mt-8">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 px-1 flex items-center gap-2">
                      <Users size={20} />
                      Full Team Statistics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamData.map((data) => (
                        <TeamCard key={data.info.id} user={data.info} tasks={data.tasks} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- WEEKLY REPORT --- */}
              {activeTab === 'weekly' && (
                 <WeeklyTracker tasks={tasks} />
              )}

              {/* --- MONTHLY RANKING BOARD --- */}
              {activeTab === 'monthly' && (
                <MonthlyRanking tasks={tasks} />
              )}

              {/* --- YEARLY ANALYTICS --- */}
              {activeTab === 'yearly' && (
                <YearlyOverview tasks={tasks} isDarkMode={isDarkMode} />
              )}

            </>
          )}
        </div>
      </main>
      
      {/* Mobile Footer */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center p-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <MobileNavItem tab="overview" icon={LayoutDashboard} />
        <MobileNavItem tab="weekly" icon={CalendarDays} />
        <MobileNavItem tab="monthly" icon={Calendar} />
        <MobileNavItem tab="yearly" icon={TrendingUp} />
      </nav>

    </div>
  );
};

export default App;
