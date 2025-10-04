'use client';
import axios from "axios";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from 'lucide-react';
import useAuthStore from '@/utility/justAuth';
import ProfileDropdown from './ProfileDropdown';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    articles: 0,
    books: 0,
    journals: 0,
    loading: true
  });
  const [animatedNumbers, setAnimatedNumbers] = useState({
    articles: 0,
    books: 0,
    journals: 0
  });

  const { isLoggedIn, logout } = useAuthStore();

  // Handle logout functionality
  const handleLogout = async () => {
    logout();
    localStorage.clear();
    await fetch('/api/logout');
    window.location.href = '/auth';
  };

  // Animated counter while loading
  useEffect(() => {
    let interval;
    if (stats.loading) {
      interval = setInterval(() => {
        setAnimatedNumbers(prev => ({
          articles: Math.floor(Math.random() * 999999) + 100000,
          books: Math.floor(Math.random() * 99999) + 10000,
          journals: Math.floor(Math.random() * 9999) + 1000
        }));
      }, 150);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stats.loading]);

  // Number formatting
  const formatNumber = (num) => {
    if (num >= 100000) return Math.floor(num / 100000) + "L+";
    if (num >= 1000) return Math.floor(num / 1000) + "K+";
    return num + "+";
  };

  // Data fetching functions
  const fetchDOAJCount = async () => {
    try {
      const response = await axios.get('/api/doaj-stats');
      return {
        articles: response.data?.articles || 0,
        journals: response.data?.journals || 0,
        total: response.data?.total || 0
      };
    } catch {
      return { articles: 0, journals: 0, total: 0 };
    }
  };

  const fetchLocalCount = async () => {
    try {
      const response = await axios.get(`/api/journal`);
      const journals = response.data?.journals || [];
      const articleCount = journals.filter(j => j.type && !j.type.toLowerCase().includes('book')).length;
      const bookCount = journals.filter(j => j.type && j.type.toLowerCase().includes('book')).length;
      return { articles: articleCount, books: bookCount, total: journals.length };
    } catch {
      return { articles: 0, books: 0, total: 0 };
    }
  };

  const fetchStats = async () => {
    try {
      const [doajData, localData] = await Promise.all([
        fetchDOAJCount(),
        fetchLocalCount()
      ]);
      setStats({
        articles: localData.articles + doajData.articles,
        books: localData.books,
        journals: doajData.journals,
        loading: false
      });
    } catch {
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Initialize data
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      {/* Navbar - Outside hero section */}
      <Navbar />
      
      {/* Hero Section with Background */}
      <div
        className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 relative overflow-hidden"
        style={{
          backgroundImage: "url('/library.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundBlendMode: "multiply"
        }}
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 z-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-green-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-purple-400/10 rounded-full blur-lg animate-ping"></div>
        </div>

        {/* Background Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-teal-800/40 to-cyan-900/60 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-10"></div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 z-15" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px, 40px 40px'
        }}></div>

        {/* Hero Content - Centered Layout */}
        <div className="relative z-20 flex flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          
          {/* Floating Cards Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-8 w-16 h-20 bg-white/5 rounded-lg rotate-12 animate-float"></div>
            <div className="absolute top-1/3 right-12 w-12 h-16 bg-white/5 rounded-lg -rotate-6 animate-float delay-500"></div>
            <div className="absolute bottom-1/4 left-1/4 w-14 h-18 bg-white/5 rounded-lg rotate-45 animate-float delay-1000"></div>
          </div>

          {/* Main Content Container */}
          <div className="text-center w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-5xl mx-auto">
            
            {/* Badge/Tagline */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-400/30 mb-4 animate-fadeInUp">
              <span className="text-white text-sm font-medium">🎓 Excellence in Education</span>
            </div>

            {/* Main Heading with Different Typography */}
            <h1 className="font-bold text-white leading-tight mb-4 animate-fadeInUp delay-200">
              <span 
                className="block text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white"
                style={{
                  textShadow: `0 4px 12px rgba(0, 0, 0, 0.5)`,
                  letterSpacing: '-0.02em'
                }}
              >
                Digital Knowledge Awaits You
              </span>
              <span 
                className="block mt-3 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white"
                style={{
                  textShadow: `0 2px 6px rgba(0, 0, 0, 0.6)`
                }}
              >
                College of Education, Nagaon
              </span>
            </h1>
            
            {/* Enhanced Subtitle with Visual Elements */}
            <div className="mb-5 animate-fadeInUp delay-300">
              {/* Decorative line */}
              <div className="flex items-center justify-center mb-3">
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-24"></div>
                <div className="mx-4">
                  <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-24"></div>
              </div>
              
              {/* Main subtitle text with enhanced styling */}
              <p 
                className="leading-relaxed font-medium mx-auto text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl px-4 text-white"
                style={{
                  textShadow: `0 4px 8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.1)`,
                  lineHeight: '1.4',
                  letterSpacing: '0.01em'
                }}
              >
                <span className="inline-block">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent font-semibold">
                    Unlock a world of academic excellence
                  </span>
                </span>
                <br className="hidden sm:block" />
                <span className="inline-block mt-2 sm:mt-0">
                  <span className="text-white/90 font-normal">
                    with cutting-edge research, comprehensive resources,
                  </span>
                </span>
                <br className="hidden sm:block" />
                <span className="inline-block mt-2 sm:mt-0">
                  <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent font-medium">
                    and innovative learning experiences.
                  </span>
                </span>
              </p>
            </div>
            
            {/* Enhanced Search Section */}
            <div className="w-full mb-4 animate-fadeInUp delay-400">
              <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-0">
                <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl border border-emerald-200/30 overflow-hidden ring-1 ring-white/20 transform hover:scale-105 transition-all duration-300">
                  <div className="p-2 lg:p-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          placeholder="Discover journals, research papers, articles..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchTerm.trim()) {
                              window.location.href = `/search/${encodeURIComponent(searchTerm.trim())}`;
                            }
                          }}
                          className="w-full px-2 py-2 sm:py-3 text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-500 text-sm sm:text-base font-medium"
                          aria-label="Search for academic resources"
                        />
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        <button
                          onClick={() => {
                            if (searchTerm.trim()) {
                              window.location.href = `/search/${encodeURIComponent(searchTerm.trim())}`;
                            }
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-3 sm:px-4 py-2 font-bold text-sm transition-all duration-200 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                          aria-label="Submit search"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Advanced Search Button */}
                <div className="flex justify-center mt-2">
                  <Link
                    href="/advanceSearch"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white border border-white/30 hover:border-white/50 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-1.5 transform hover:scale-105"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Advanced Search
                  </Link>
                </div>
              </div>
            </div>

            {/* Modern Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto animate-fadeInUp delay-500">
              <Link
                href="/advanceSearch"
                className="group bg-gradient-to-r from-white to-gray-50 text-emerald-600 hover:text-emerald-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center text-sm sm:text-base border border-emerald-200/30"
              >
                <span className="flex items-center justify-center gap-1.5">
                  🔍 Start Exploring
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/subjects"
                className="group bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm text-white hover:bg-emerald-500/30 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 text-center text-sm sm:text-base"
              >
                <span className="flex items-center justify-center gap-1.5">
                  📚 Browse Subjects
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16">
          {/* Mobile Layout - Single Column */}
          <div className="block sm:hidden space-y-4 max-w-sm mx-auto">
            {[
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", count: stats.loading ? formatNumber(animatedNumbers.articles) : "115L+", label: "Articles Available", gradient: "from-blue-500 to-blue-600", ring: "ring-blue-200/50" },
              { icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", count: stats.loading ? formatNumber(animatedNumbers.journals) : "21K+", label: "Journals Available", gradient: "from-indigo-500 to-indigo-600", ring: "ring-indigo-200/50" },
              { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", count: stats.loading ? formatNumber(animatedNumbers.books) : "0+", label: "Books Available", gradient: "from-emerald-500 to-emerald-600", ring: "ring-emerald-200/50" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", count: "24/7", label: "Always Available", gradient: "from-purple-500 to-purple-600", ring: "ring-purple-200/50" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/60 flex items-center gap-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                <div className={`bg-gradient-to-br ${stat.gradient} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ring-2 ${stat.ring}`}>
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-800 leading-tight">{stat.count}</div>
                  <div className="text-sm text-gray-600 font-medium leading-relaxed">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet Layout - 2x2 Grid */}
          <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", count: stats.loading ? formatNumber(animatedNumbers.articles) : "115L+", label: "Articles", gradient: "from-blue-500 to-blue-600", ring: "ring-blue-200/50" },
              { icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", count: stats.loading ? formatNumber(animatedNumbers.journals) : "21K+", label: "Journals", gradient: "from-indigo-500 to-indigo-600", ring: "ring-indigo-200/50" },
              { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", count: stats.loading ? formatNumber(animatedNumbers.books) : "0+", label: "Books", gradient: "from-emerald-500 to-emerald-600", ring: "ring-emerald-200/50", colSpan: false },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", count: "24/7", label: "Always Available", gradient: "from-purple-500 to-purple-600", ring: "ring-purple-200/50", colSpan: true }
            ].map((stat, index) => (
              <div key={index} className={`bg-white/90 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-xl border border-white/60 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${stat.colSpan ? 'col-span-2' : ''}`}>
                <div className={`bg-gradient-to-br ${stat.gradient} w-16 h-16 md:w-18 md:h-18 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 ring-2 ${stat.ring}`}>
                  <svg className="h-8 w-8 md:h-9 md:w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-2">{stat.count}</div>
                <div className="text-base md:text-lg text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Desktop Layout - Horizontal Row */}
          <div className="hidden lg:flex justify-between items-center divide-x divide-gray-300">
            {[
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", count: stats.loading ? formatNumber(animatedNumbers.articles) : "115L+", label: "Articles", gradient: "from-blue-500 to-blue-600" },
              { icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", count: stats.loading ? formatNumber(animatedNumbers.journals) : "21K+", label: "Journals", gradient: "from-indigo-500 to-indigo-600" },
              { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", count: stats.loading ? formatNumber(animatedNumbers.books) : "0+", label: "Books", gradient: "from-emerald-500 to-emerald-600" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", count: "24/7", label: "Always Available", gradient: "from-purple-500 to-purple-600" }
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-4 flex-1 justify-center px-4 first:pl-0 last:pr-0">
                <div className={`bg-gradient-to-br ${stat.gradient} w-16 h-16 xl:w-18 xl:h-18 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <svg className="h-8 w-8 xl:h-9 xl:w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-3xl xl:text-4xl font-bold text-gray-800 leading-tight">{stat.count}</div>
                  <div className="text-base xl:text-lg text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}