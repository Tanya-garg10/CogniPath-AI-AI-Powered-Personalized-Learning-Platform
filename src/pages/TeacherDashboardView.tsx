import React, { useState } from 'react';
import { ClassPerformanceStats, StudentMistakeLog } from '../types';
import { 
  Users, 
  BarChart3, 
  Download, 
  Plus, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Search, 
  ChevronRight, 
  Award, 
  BookOpen,
  Check,
  X
} from 'lucide-react';

interface TeacherDashboardViewProps {
  stats: ClassPerformanceStats;
  mistakeLogs: StudentMistakeLog[];
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  stats,
  mistakeLogs,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTopic, setAssignTopic] = useState('Distributive Property');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const studentRoster = [
    { id: 'usr_001', name: 'Alex Rivera', grade: 'Algebra I', accuracy: 88, streak: 7, weakTopic: 'Distribution Error', status: 'Active' },
    { id: 'usr_002', name: 'Maya Lin', grade: 'Algebra I', accuracy: 72, streak: 3, weakTopic: 'Variable Confusion', status: 'Needs Review' },
    { id: 'usr_003', name: 'Jordan Vance', grade: 'Algebra I', accuracy: 81, streak: 5, weakTopic: 'Sign Error', status: 'Active' },
    { id: 'usr_004', name: 'Chloe Bennett', grade: 'Algebra I', accuracy: 94, streak: 12, weakTopic: 'None (Mastered)', status: 'Top Performer' },
    { id: 'usr_005', name: 'Liam Patel', grade: 'Algebra I', accuracy: 65, streak: 2, weakTopic: 'Formula Misuse', status: 'At Risk' },
  ];

  const handleExportCSV = () => {
    const csvHeader = 'Student ID,Name,Grade,Accuracy %,Streak,Weak Topic,Status\n';
    const csvRows = studentRoster.map((s) => `${s.id},${s.name},${s.grade},${s.accuracy}%,${s.streak}d,${s.weakTopic},${s.status}`).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CogniPath_Class_Analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleAssignPractice = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignedSuccess(true);
    setTimeout(() => {
      setAssignedSuccess(false);
      setShowAssignModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-400" />
            <h1 className="font-poppins font-extrabold text-2xl text-white">Teacher Portal – Class 9A Algebra</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">Real-time misconception heatmaps and automated student AI reports</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-500/20 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Practice Set</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-blue-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Students</span>
          <p className="font-poppins font-extrabold text-2xl text-white">{stats.totalStudents} Active</p>
          <p className="text-[11px] text-emerald-400">100% Attendance today</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-blue-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Class Average Accuracy</span>
          <p className="font-poppins font-extrabold text-2xl text-blue-300">{stats.averageAccuracy}%</p>
          <p className="text-[11px] text-emerald-400">↑ +4.1% this week</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-blue-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Top Class Misconception</span>
          <p className="font-poppins font-extrabold text-lg text-rose-300">Distribution Error</p>
          <p className="text-[11px] text-rose-400">38% of class struggles</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-blue-500/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Avg. Streak</span>
          <p className="font-poppins font-extrabold text-2xl text-amber-400">{stats.activeStreakAvg} Days</p>
          <p className="text-[11px] text-slate-400">High engagement</p>
        </div>
      </div>

      {/* Row 2: Roster Table & Misconception Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Roster Table */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-bold text-base text-white">Student Roster & AI Insights</h3>
            <span className="text-xs text-slate-400">{studentRoster.length} Roster Students</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">Streak</th>
                  <th className="p-3">Primary Misconception</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {studentRoster.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-semibold text-white">{s.name}</td>
                    <td className="p-3 text-purple-300 font-bold">{s.accuracy}%</td>
                    <td className="p-3 text-amber-400 font-bold">{s.streak}d</td>
                    <td className="p-3 text-rose-300">{s.weakTopic}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Top Performer' ? 'bg-emerald-500/20 text-emerald-300' :
                        s.status === 'At Risk' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedStudent(s.name)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white transition-all text-[11px]"
                      >
                        AI Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Misconception Frequency Breakdown */}
        <div className="glass-card rounded-3xl p-6 border border-blue-500/20 space-y-4">
          <h3 className="font-poppins font-bold text-base text-white">Class Misconception Frequency</h3>
          <div className="space-y-3">
            {stats.topMisconceptions.map((tm, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{tm.type}</span>
                  <span className="text-rose-400">{tm.count} students ({tm.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-rose-500 h-full rounded-full"
                    style={{ width: `${tm.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Individual Student AI Diagnostic Report */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-card rounded-3xl p-6 border border-blue-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-poppins font-bold text-lg text-white">AI Diagnostic Report: {selectedStudent}</h3>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="font-semibold text-purple-300">Primary Cognitive Misconception: Distribution Error</p>
                <p className="text-slate-400 mt-1">Student frequently forgets to multiply the outside constant by the second term inside parentheses (e.g. 2(x+3) → 2x+3).</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="font-semibold text-emerald-300">Recommended Intervention</p>
                <p className="text-slate-400 mt-1">Assign 3 targeted practice sets focusing on the 'Distributive Rainbow' visual mental model.</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs"
            >
              Close Student Report
            </button>
          </div>
        </div>
      )}

      {/* Modal: Assign Practice Set */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form onSubmit={handleAssignPractice} className="w-full max-w-md glass-card rounded-3xl p-6 border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-poppins font-bold text-base text-white">Assign Targeted Practice</h3>
              <button type="button" onClick={() => setShowAssignModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignedSuccess ? (
              <div className="p-6 text-center text-emerald-400 space-y-2">
                <Check className="w-10 h-10 mx-auto" />
                <p className="font-bold">Practice Assigned Successfully!</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Topic Area:</label>
                  <select
                    value={assignTopic}
                    onChange={(e) => setAssignTopic(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  >
                    <option value="Distributive Property">Distributive Property (Target Distribution Errors)</option>
                    <option value="Negative Coefficients">Negative Coefficients (Target Sign Errors)</option>
                    <option value="Combining Like Terms">Combining Like Terms (Target Variable Confusion)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Target Group:</label>
                  <select className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white">
                    <option>Entire Class 9A (28 Students)</option>
                    <option>Students with Distribution Misconception (11 Students)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg"
                >
                  Confirm & Send Assignment
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
