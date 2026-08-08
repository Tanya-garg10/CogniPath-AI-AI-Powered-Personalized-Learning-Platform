import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BarChart3, TrendingUp, Clock, Target, Calendar, Award, Download, FileText, CheckCircle2 } from 'lucide-react';
import { KnowledgeGapsMap } from '../components/KnowledgeGapsMap';
import jsPDF from 'jspdf';

interface StudentAnalyticsViewProps {
  onNavigate?: (view: string) => void;
}

export const StudentAnalyticsView: React.FC<StudentAnalyticsViewProps> = ({ onNavigate }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const weeklyData = [
    { day: 'Mon', solved: 12, errors: 3, accuracy: 75 },
    { day: 'Tue', solved: 18, errors: 2, accuracy: 88 },
    { day: 'Wed', solved: 15, errors: 4, accuracy: 73 },
    { day: 'Thu', solved: 22, errors: 1, accuracy: 95 },
    { day: 'Fri', solved: 20, errors: 2, accuracy: 90 },
    { day: 'Sat', solved: 14, errors: 2, accuracy: 85 },
    { day: 'Sun', solved: 16, errors: 1, accuracy: 93 },
  ];

  const errorDistribution = [
    { name: 'Distribution Error', value: 40, color: '#a855f7' },
    { name: 'Sign Error', value: 25, color: '#f59e0b' },
    { name: 'Variable Confusion', value: 18, color: '#3b82f6' },
    { name: 'Formula Misuse', value: 10, color: '#f43f5e' },
    { name: 'Arithmetic Error', value: 7, color: '#10b981' },
  ];

  const radarData = [
    { subject: 'Linear Equations', A: 85 },
    { subject: 'Distributive Law', A: 65 },
    { subject: 'Fractions', A: 78 },
    { subject: 'Sign Operations', A: 70 },
    { subject: 'Quadratic Expressions', A: 55 },
    { subject: 'Polynomials', A: 60 },
  ];

  // Learning heatmap days simulation (28 days)
  const heatmapDays = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    intensity: i % 7 === 0 ? 0 : (i * 3) % 4, // 0 to 3
  }));

  const handleExportPDF = () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const doc = new jsPDF();

      // Title & Branding Header
      doc.setFillColor(15, 23, 42); // slate-900 background
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('CogniPath AI - Knowledge Gaps & Progress Report', 14, 18);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(192, 132, 252);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | Student ID: STU-8924`, 14, 27);

      // Executive Summary Card
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 42, 182, 32, 3, 3, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 42, 182, 32, 3, 3, 'D');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Learning Summary', 20, 52);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text('• Overall Accuracy: 86.5% | Error Reduction Rate: +14% (Last 30 Days)', 20, 60);
      doc.text('• Primary Misconception Focus: Distributive Law (Sign inversion on negative multipliers)', 20, 67);

      // Section 1: Concept Knowledge Gaps & Mastery Levels
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Concept Knowledge Gaps & Mastery Levels', 14, 86);

      // Draw Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 91, 182, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('CONCEPT TOPIC', 18, 96.5);
      doc.text('MASTERY', 85, 96.5);
      doc.text('STATUS', 115, 96.5);
      doc.text('RECOMMENDED ACTION', 145, 96.5);

      const concepts = [
        { topic: 'Linear Equations', mastery: '85%', status: 'Mastered', action: 'Advance to Systems of Equations' },
        { topic: 'Distributive Law', mastery: '65%', status: 'Needs Practice', action: 'Review negative sign distribution' },
        { topic: 'Fraction Operations', mastery: '78%', status: 'Proficient', action: 'Practice LCD common denominators' },
        { topic: 'Sign Handling', mastery: '70%', status: 'Proficient', action: 'Focus on double negatives' },
        { topic: 'Quadratic Expressions', mastery: '55%', status: 'Knowledge Gap', action: 'Complete AI Tutor Step-by-Step' },
        { topic: 'Polynomials', mastery: '60%', status: 'Needs Practice', action: 'Review combining like terms' },
      ];

      let yPos = 105;
      concepts.forEach((c, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, yPos - 5, 182, 8, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(c.topic, 18, yPos);
        doc.text(c.mastery, 85, yPos);

        if (c.status === 'Knowledge Gap') {
          doc.setTextColor(225, 29, 72);
        } else if (c.status === 'Needs Practice') {
          doc.setTextColor(217, 119, 6);
        } else {
          doc.setTextColor(16, 185, 129);
        }
        doc.text(c.status, 115, yPos);

        doc.setTextColor(71, 85, 105);
        doc.text(c.action, 145, yPos);
        yPos += 8;
      });

      // Section 2: Misconception Distribution
      yPos += 6;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Misconception Diagnostics Summary', 14, yPos);

      const misconceptions = [
        { name: 'Distribution Error', pct: '40%', desc: 'Forgetting to distribute negative signs across terms inside parentheses.' },
        { name: 'Sign Error', pct: '25%', desc: 'Inverting signs when shifting variables across equals sign.' },
        { name: 'Variable Confusion', pct: '18%', desc: 'Combining unlike algebraic terms (e.g., 3x + 4 = 7x).' },
        { name: 'Formula Misuse', pct: '10%', desc: 'Applying wrong formulas or incorrect order of operations.' },
        { name: 'Arithmetic Error', pct: '7%', desc: 'Minor mental math calculation slips.' },
      ];

      misconceptions.forEach((m) => {
        yPos += 6;
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(147, 51, 234);
        doc.text(`• ${m.name} (${m.pct}):`, 18, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(m.desc, 70, yPos);
      });

      // Section 3: AI Recommendations
      yPos += 12;
      doc.setFillColor(243, 232, 255);
      doc.roundedRect(14, yPos, 182, 26, 3, 3, 'F');

      doc.setTextColor(126, 34, 206);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('CogniPath AI Tutor Recommendations:', 20, yPos + 7);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(58, 12, 107);
      doc.text('1. Allocate 10 minutes daily on the Voice Reasoning Dictator for distributive property practice.', 20, yPos + 14);
      doc.text('2. Review the Micro-Lesson on "Mastering Negative Parentheses" in the AI Tutor Studio.', 20, yPos + 20);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('CogniPath AI Diagnostic System - Confidentially Generated Report', 14, 285);
      doc.text('Page 1 of 1', 185, 285);

      doc.save('CogniPath_Student_Knowledge_Gaps_Report.pdf');
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <span>Student Learning Analytics</span>
          </h1>
          <p className="text-xs text-slate-300">Deep cognitive insights into error reduction and concept mastery</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="hidden md:flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-purple-300 font-semibold">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>+14% Error Reduction</span>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`px-4 py-2 rounded-xl font-poppins font-bold text-xs shadow-lg transition-all flex items-center space-x-2 ${
              exportSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
            }`}
          >
            {exportSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className={`w-4 h-4 text-amber-300 ${isExporting ? 'animate-bounce' : ''}`} />
                <span>{isExporting ? 'Exporting Report...' : 'Export PDF Report'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Concept Knowledge Gaps Heatmap Matrix */}
      <KnowledgeGapsMap 
        onPracticeConcept={(topic) => {
          if (onNavigate) {
            onNavigate('solver');
          }
        }}
      />

      {/* Row 1: Weekly Solved vs Errors & Error Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Solved vs Errors */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-poppins font-bold text-base text-white">Weekly Practice Volume & Errors</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="solved" fill="#a855f7" radius={[6, 6, 0, 0]} name="Problems Solved" />
                <Bar dataKey="errors" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Misconceptions Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Distribution Pie */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-poppins font-bold text-base text-white">Misconception Distribution</h3>
          <div className="h-48 w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={errorDistribution} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {errorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {errorDistribution.map((ed, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ed.color }} />
                  <span>{ed.name}</span>
                </span>
                <span className="font-bold text-slate-200">{ed.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Concept Mastery Radar & Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Concept Mastery */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="font-poppins font-bold text-base text-white">Concept Mastery Polygon</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#64748b" domain={[0, 100]} />
                <Radar name="Mastery %" dataKey="A" stroke="#c084fc" fill="#a855f7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 28-Day Learning Heatmap Grid */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-bold text-base text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>28-Day Practice Heatmap</span>
            </h3>
            <span className="text-xs text-slate-400">July 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {heatmapDays.map((hd) => {
              const bgColors = ['bg-slate-900', 'bg-purple-900/40', 'bg-purple-700/60', 'bg-purple-500'];
              return (
                <div
                  key={hd.day}
                  className={`h-10 rounded-xl border border-slate-800/80 flex items-center justify-center text-xs font-semibold text-slate-300 transition-all ${bgColors[hd.intensity]}`}
                  title={`Day ${hd.day}: Level ${hd.intensity}`}
                >
                  {hd.day}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end space-x-2 text-[10px] text-slate-400 pt-2">
            <span>Less Practice</span>
            <div className="w-3 h-3 rounded bg-slate-900" />
            <div className="w-3 h-3 rounded bg-purple-900/40" />
            <div className="w-3 h-3 rounded bg-purple-700/60" />
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span>High Intensity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
