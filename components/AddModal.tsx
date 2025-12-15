import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { CATEGORIES, COLORS, MAIN_COLOR } from '../constants';
import { getTaskSuggestions } from '../services/geminiService';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: string, color: string, goal?: number) => void;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [goal, setGoal] = useState<string>('');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, category, color, goal ? parseInt(goal) : undefined);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setCategory(CATEGORIES[0]);
    setColor(COLORS[0]);
    setGoal('');
    setSuggestions([]);
    setAiPrompt('');
    onClose();
  };

  const handleAiSuggest = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const results = await getTaskSuggestions(aiPrompt);
      setSuggestions(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-xl animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Tracker</h2>
          <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {/* AI Section */}
          <div className="mb-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 p-4 border border-indigo-100 dark:border-indigo-900/40">
            <label className="mb-2 block text-sm font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
              Not sure what to track?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., I want to learn Spanish..."
                className="flex-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleAiSuggest}
                disabled={isGenerating || !aiPrompt}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: MAIN_COLOR }}
              >
                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : 'Suggest'}
              </button>
            </div>
            
            {suggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTitle(s)}
                    className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Task Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Drink Water"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 focus:border-indigo-500 focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
               <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Daily Goal (Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ex: 8"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Color Tag</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === c ? 'border-slate-800 dark:border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg px-6 py-2 text-sm font-medium text-white hover:opacity-90"
                style={{ backgroundColor: MAIN_COLOR }}
              >
                Create Tracker
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
