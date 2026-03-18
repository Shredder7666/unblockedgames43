/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => { setSelectedGame(null); setIsFullscreen(false); }}
          >
            <div className="p-2 bg-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">UNBLOCKED<span className="text-emerald-500">HUB</span></h1>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-xs font-medium uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
              Request Game
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="game-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { setSelectedGame(null); setIsFullscreen(false); }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Library
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Toggle Cinema Mode"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={selectedGame.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className={`relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${isFullscreen ? 'aspect-video w-full' : 'aspect-video max-w-5xl mx-auto'}`}>
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>

              <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold">{selectedGame.title}</h2>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20">
                      {selectedGame.category}
                    </span>
                  </div>
                  <p className="text-zinc-400 max-w-2xl">{selectedGame.description}</p>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Controls</h4>
                    <p className="text-sm text-zinc-300">Use Arrow Keys or WASD to play. Space to interact.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="library-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="relative h-64 rounded-3xl overflow-hidden flex items-center px-12 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent z-0" />
                <img 
                  src="https://picsum.photos/seed/gaming/1200/400?blur=10" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 -z-10"
                  alt="Hero Background"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10 max-w-xl space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter leading-none">PLAY ANYTHING.<br/>ANYWHERE.</h2>
                  <p className="text-zinc-400 text-lg">The ultimate collection of web-based games, unblocked and ready to play in your browser.</p>
                </div>
              </section>

              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat 
                        ? 'bg-emerald-500 text-[#0a0a0a]' 
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div className="md:hidden relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleGameSelect(game)}
                    className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg group-hover:text-emerald-500 transition-colors">{game.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{game.category}</span>
                      </div>
                      <p className="text-zinc-400 text-sm line-clamp-2">{game.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20 space-y-4">
                  <div className="inline-flex p-4 bg-white/5 rounded-full">
                    <Search className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-bold">No games found</h3>
                  <p className="text-zinc-500">Try adjusting your search or category filters.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="text-emerald-500 hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500 rounded">
              <Gamepad2 className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <span className="font-bold tracking-tight">UNBLOCKED<span className="text-emerald-500">HUB</span></span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">DMCA</a>
          </div>

          <p className="text-sm text-zinc-600">© 2026 UnblockedHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
