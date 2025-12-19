'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faUpRightFromSquare, faBars, faTimes, faArrowDown, faCheckCircle, faRocket, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faFile, faPenToSquare, faStar as farStar } from '@fortawesome/free-regular-svg-icons';

function Demo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src='logo192.png' alt="AskNAU logo" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-bold tracking-tight">AskNAU</span>
          </div>

          <button className="md:hidden text-2xl text-gray-300 hover:text-white transition-colors" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>

          <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-full left-0 right-0 bg-neutral-950 md:bg-transparent border-b md:border-none border-white/10 p-6 md:p-0 gap-6 items-center shadow-2xl md:shadow-none`}>
            <li>
              <a href="https://github.com/zkalykov/asknau" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faGithub} />
                Github
              </a>
            </li>
            <li>
              <Link href="/chat" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-medium transition-all hover:scale-105 active:scale-95">
                <FontAwesomeIcon icon={faUpRightFromSquare} />
                Try Now
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center space-y-8 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-400 animate-fade-in-up">
            First ever AI assistant for NAU students
          </h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400 animate-fade-in-up delay-100">
            Meet AskNAU
          </h1>

          <div className="flex justify-center animate-fade-in-up delay-200">
            <Link href="/chat" className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1">
              Start chatting
              <FontAwesomeIcon icon={faUpRightFromSquare} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Video Demo */}
        <div className="max-w-6xl mx-auto mb-32 px-4 animate-fade-in-up delay-300">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/10 bg-neutral-900">
            <video
              src="/demo_asknau.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-blue-500/50 hover:bg-neutral-900 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faFile} size="lg" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Courses Info</h3>
              <p className="text-gray-400 leading-relaxed">
                Instant access to detailed information about courses, prerequisites, and faculty requirements.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-amber-500/50 hover:bg-neutral-900 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={farStar} size="lg" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Grade Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload your transcript to visualize your GPA trends and get personalized improvement insights.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-emerald-500/50 hover:bg-neutral-900 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faPenToSquare} size="lg" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Smart Planning</h3>
              <p className="text-gray-400 leading-relaxed">
                Strategic semester planning and career path guidance tailored to your major.
              </p>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <FontAwesomeIcon icon={faArrowDown} className="text-blue-500 animate-bounce" />
              Why AskNAU?
            </h2>
          </div>

          <div className="space-y-12">
            <div className="relative pl-8 border-l-2 border-blue-500/30 hover:border-blue-500 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
                The Project Idea
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                AskNAU was born from the need to save time for both students and teachers.
                Instead of searching through dozens of pages or waiting for emails, AskNAU provides instant, accurate answers
                using advanced AI that understands our university's specific context.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-amber-500/30 hover:border-amber-500 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-amber-500" />
                Under the Hood
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                A powerful Hybrid AI system combining <span className="text-amber-400 font-semibold">GPT API</span> intelligence
                with a specialized <span className="text-amber-400 font-semibold">Local Knowledge Base</span>.
                Built with Next.js, Flask, and TailwindCSS, deployed on Vercel and Heroku for maximum reliability.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-emerald-500/30 hover:border-emerald-500 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <FontAwesomeIcon icon={faGraduationCap} className="text-emerald-500" />
                Simple & Intuitive
              </h3>
              <div className="space-y-6">
                <p className="text-lg text-gray-400 leading-relaxed">
                  Everything you need is just one click away. Manage your profile, check viewing history,
                  start new chats, or explore the demo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <img src="chat-first-pic.png" alt="Interface 1" className="rounded-xl border border-white/10 shadow-lg" />
                  <img src="chat-second-pic.png" alt="Interface 2" className="rounded-xl border border-white/10 shadow-lg" />
                  <img src="chat-third-pic.png" alt="Interface 3" className="rounded-xl border border-white/10 shadow-lg" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-blue-900/10 border border-blue-500/20 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Contribute</h3>
            <p className="text-gray-400">
              Open source and ready for your ideas.
              <br />
              Code available at <a href="https://github.com/zkalykov/asknau" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">github.com/zkalykov/asknau</a>
            </p>
            <p className="text-gray-400">
              Questions? Email <a href="mailto:zkalykov@na.edu" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">zkalykov@na.edu</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-neutral-950 py-12 text-center">
        <p className="text-gray-500">© {new Date().getFullYear()} AskNAU. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Demo;
