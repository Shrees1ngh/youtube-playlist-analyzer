"use client";
import { useState, useEffect } from 'react';
import { Clock, Play, AlertCircle, Loader2, Calendar, Moon, Sun } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import SkeletonLoader from './SkeletonLoader';
import Image from 'next/image';

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [isAnimating, setIsAnimating] = useState(false);
  const [url, setUrl] = useState("");
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Exam planner
  const [startTime, setStartTime] = useState("");
  const [examTime, setExamTime] = useState("");
  const [showExamPlanner, setShowExamPlanner] = useState(false);
  const [examSpeed, setExamSpeed] = useState("1x");

  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
  }, []);

  function toggleTheme() {
    setIsAnimating(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  }

  async function analyze() {
    if (!url.trim()) {
      setError("Please paste a YouTube playlist URL");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);

    try {
      const qs = new URLSearchParams({ 
        url: url.trim(), 
        start: String(start), 
        end: String(end) 
      });
      const res = await fetch(`/api/analyze?${qs}`);
      const json = await res.json();

      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (err) {
      setError("Failed to analyze playlist. Please try again.");
    }

    setLoading(false);
  }

  function formatDecimalHours(decimalHours) {
    const totalSeconds = Math.round(decimalHours * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h ${minutes}m ${seconds}s`;
    } else if (hours === 0) {
      return `${minutes}m ${seconds}s`;
    } else if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }

  function formatHoursWithFullWords(decimalHours) {
    const totalSeconds = Math.round(decimalHours * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} days ${remainingHours} hours ${minutes} minutes ${seconds} seconds`;
    } else if (hours === 0) {
      return `${minutes} minutes, ${seconds} seconds`;
    } else {
      return `${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
  }

  function examPlan() {
    if (!data || !startTime || !examTime) return null;
    
    const studyStart = new Date(startTime);
    const examDate = new Date(examTime);
    
    if (examDate <= studyStart) return null;
    
    const speedMultiplier = parseFloat(examSpeed.replace('x', ''));
    const neededHours = data.totalHours / speedMultiplier;
    
    const studyDays = [];
    const currentDate = new Date(studyStart);
    currentDate.setHours(0, 0, 0, 0);
    const examDateOnly = new Date(examDate);
    examDateOnly.setHours(0, 0, 0, 0);
    
    while (currentDate < examDateOnly) {
      studyDays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (studyDays.length === 0) return null;
    
    const hoursPerDay = neededHours / studyDays.length;
    const formattedHoursPerDay = formatDecimalHours(hoursPerDay);
    
    const dayBreakdown = studyDays.map(day => {
      const dayName = day.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      return `${dayName}: ${formattedHoursPerDay}/day`;
    });
    
    const examDayName = examDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    dayBreakdown.push(`${examDayName}: Revision Only`);
    
    return {
      studyDays: studyDays.length,
      needed: formatHoursWithFullWords(neededHours),
      perDay: formattedHoursPerDay,
      dayBreakdown,
      achievable: true,
    };
  }

  const plan = examPlan();

  function formatTime(timeObj) {
    const { hours, minutes, seconds } = timeObj;
    
    if (hours >= 24) {
      const approxDays = Math.round((hours + minutes / 60 + seconds / 3600) / 24);
      return {
        full: `${hours}h ${minutes}m ${seconds}s`,
        approx: `(~${approxDays} days)`
      };
    } else if (hours === 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  }

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen py-12 px-4 ${
      isDark ? 'bg-gray-900' : 'bg-linear-to-br from-red-50 to-white'
    }`} style={{transition: 'background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1)'}}>
      
      {/* Theme Flash Overlay */}
      {isAnimating && (
        <div className={`fixed inset-0 pointer-events-none z-50 ${
          theme === "dark" ? 'animate-theme-flash-dark' : 'animate-theme-flash-light'
        }`} />
      )}
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Image src="/logo.svg" alt="Logo" width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16" priority />
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-950'}`}>
              YouTube Playlist Analyzer
            </h1>
          </div>
          <p className={`text-base sm:text-lg px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Calculate watch time and plan your study sessions
          </p>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`absolute right-0 top-0 p-2 sm:p-3 rounded-xl transition-all duration-300 group ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-white hover:bg-black text-gray-700 hover:text-white shadow-lg group-hover:shadow-xl'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <>
                <Sun className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-500 ${
                  isAnimating ? 'animate-sun-rise rotate-180' : ''
                } group-hover:rotate-180 group-hover:animate-sun-rise`} />
                <div className={`absolute inset-0 ${
                  isAnimating ? 'animate-sun-glow' : ''
                } group-hover:animate-sun-glow pointer-events-none rounded-xl`}></div>
              </>
            ) : (
              <>
                <Moon className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-500 ${
                  isAnimating ? 'animate-moon-rise' : ''
                } group-hover:animate-moon-rise`} />
              </>
            )}
          </button>
        </div>

        {/* Input Section */}
        <div className={`rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <label className={`block text-sm font-semibold mb-2 sm:mb-3 ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Playlist URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
              className={`w-full sm:flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm sm:text-base ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && analyze()}
            />
            <button
              onClick={analyze}
              disabled={loading || !url}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {/* Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Start Video
              </label>
              <input
                type="number"
                value={start}
                onChange={(e) => setStart(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                placeholder="1"
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                End Video
              </label>
              <input
                type="number"
                value={end}
                onChange={(e) => setEnd(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                placeholder="Last video"
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Leave as 0 to include entire playlist
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
              isDark ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
            }`}>
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`} />
              <p className={isDark ? 'text-red-300' : 'text-red-700'}>{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading && <SkeletonLoader isDark={isDark} />}

        {data && !loading && (
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-fade-in ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="space-y-6">
            <div>
                <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Playlist Details
                </h3>
                <p className={`text-xl sm:text-2xl font-bold mb-2 wrap-break-word ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {data.playlistTitle}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  by {data.channelName}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t" style={{
                borderColor: isDark ? '#404854' : '#e5e7eb'
              }}>
                <div className={`p-4 sm:p-5 rounded-xl transition-all ${
                  isDark ? 'bg-gray-700/40' : 'bg-linear-to-br from-red-50 to-orange-50'
                }`}>
                  <div className={`text-xs font-semibold mb-2 opacity-60 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Total Videos
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}>
                    <AnimatedNumber value={data.totalVideos} />
                  </div>
                </div>
                <div className={`p-4 sm:p-5 rounded-xl transition-all ${
                  isDark ? 'bg-gray-700/40' : 'bg-linear-to-br from-red-50 to-orange-50'
                }`}>
                  <div className={`text-xs font-semibold mb-2 opacity-60 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Range
                  </div>
                  <div className={`text-base sm:text-lg font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {data.range}
                  </div>
                  <div className={`text-xs opacity-70 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {data.rangeVideos} videos
                  </div>
                </div>
                <div className={`p-4 sm:p-5 rounded-xl transition-all ${
                  isDark ? 'bg-gray-700/40' : 'bg-linear-to-br from-red-50 to-orange-50'
                }`}>
                  <div className={`text-xs font-semibold mb-2 opacity-60 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Average Duration
                  </div>
                  <div className={`text-base sm:text-lg font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatTime(data.averageVideo)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
              <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <Clock className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                Total Watch Time
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(data.total).map(([speed, duration]) => {
                  const formatted = formatTime(duration);
                  const isObject = typeof formatted === 'object';
                  return (
                    <div
                      key={speed}
                      className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700/40 border-gray-600' 
                          : 'bg-linear-to-br from-red-50 to-orange-50 border-red-200'
                      }`}
                    >
                      <div className={`text-sm font-bold mb-2 ${
                        isDark ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {speed}
                      </div>
                      {isObject ? (
                        <div>
                          <div className={`text-xs mb-1 opacity-70 ${
                            isDark ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {formatted.approx}
                          </div>
                          <div className={`text-sm sm:text-base font-bold wrap-break-word ${
                            isDark ? 'text-white' : 'text-red-700'
                          }`}>
                            {formatted.full}
                          </div>
                        </div>
                      ) : (
                        <div className={`text-sm sm:text-base font-bold wrap-break-word ${
                          isDark ? 'text-white' : 'text-red-700'
                        }`}>
                          {formatted}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Study Planner Toggle */}
            <div className="flex justify-center mt-6 sm:mt-8">
              <button
                onClick={() => setShowExamPlanner(!showExamPlanner)}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 ${
                  isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Calendar className="w-5 h-5" />
                {showExamPlanner ? 'Hide Study Plan' : 'Create Study Plan'}
              </button>
            </div>

            {/* Study Planner Section */}
            {showExamPlanner && (
              <div className={`rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8 animate-fade-in ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h4 className={`text-lg sm:text-xl font-bold mb-6 sm:mb-8 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  📅 Study Schedule
                </h4>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Exam Date
                    </label>
                    <input
                      type="datetime-local"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  {/* Speed Selector */}
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Study Speed
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["1x", "1.25x", "1.5x", "2x"].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setExamSpeed(speed)}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                            examSpeed === speed
                              ? 'bg-red-600 text-white'
                              : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {plan && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className={`p-4 sm:p-6 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 ${
                      isDark ? 'bg-gray-700/40' : 'bg-linear-to-br from-red-50 to-orange-50'
                    }`}>
                      <div className="text-center">
                        <div className={`text-xs font-semibold mb-2 opacity-60 ${
                          isDark ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          Study Days
                        </div>
                        <div className={`text-2xl sm:text-3xl font-bold ${
                          isDark ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {plan.studyDays}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-semibold mb-2 opacity-60 ${
                          isDark ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          Total Hours
                        </div>
                        <div className={`text-xs sm:text-sm font-bold wrap-break-word ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {plan.needed}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-semibold mb-2 opacity-60 ${
                          isDark ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          Per Day
                        </div>
                        <div className={`text-lg sm:text-xl font-bold ${
                          isDark ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {plan.perDay}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-sm font-bold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Daily Schedule
                      </h3>
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {plan.dayBreakdown.map((day, idx) => (
                          <div
                            key={idx}
                            className={`py-3 px-4 rounded-lg border text-sm ${
                              day.includes("Revision")
                                ? isDark
                                  ? 'bg-green-900/20 border-green-700 text-green-300'
                                  : 'bg-green-50 border-green-200 text-green-800'
                                : isDark
                                ? 'bg-gray-700/30 border-gray-600 text-gray-300'
                                : 'bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                          >
                            {day.includes("Revision") ? "📖" : "📝"} {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!plan && startTime && examTime && (
                  <p className={`text-sm text-center p-4 rounded-lg ${
                    isDark 
                      ? 'text-yellow-300 bg-yellow-900/20' 
                      : 'text-yellow-800 bg-yellow-50'
                  }`}>
                    ⚠️ Exam must be after start time
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`mt-12 sm:mt-20 text-center text-xs sm:text-sm px-4 transition-colors duration-300 ${
        isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-600 hover:text-gray-900'
      }`}>
        <p className="font-medium">
          made with 💖 by{" "}
          <a
            href="https://github.com/Shrees1ngh"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline underline-offset-4 transition-colors ${
              isDark ? 'hover:text-red-400' : 'hover:text-red-600'
            }`}
          >
            श्री
          </a>
        </p>
      </div>
    </div>
  );
}