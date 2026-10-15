import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  
  // States for Theatre Curtain & Clickable Intro Modal
  const [curtainOpened, setCurtainOpened] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);

  // Card Tilt & Particle States
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const lightRef = useRef(null);
  const canvasRef = useRef(null);

  // Automatic Theatre Curtain Opening Trigger on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurtainOpened(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Interactive 3D Card & Floating Ember Particles Effect
  useEffect(() => {
    const scene = sceneRef.current;
    const card = cardRef.current;
    const light = lightRef.current;
    const canvas = canvasRef.current;

    if (!scene || !card || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (scene) {
        canvas.width = scene.clientWidth * dpr;
        canvas.height = scene.clientHeight * dpr;
        canvas.style.width = scene.clientWidth + 'px';
        canvas.style.height = scene.clientHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handlePointerMove = (event) => {
      const rect = scene.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    scene.addEventListener('pointermove', handlePointerMove);
    scene.addEventListener('pointerleave', handlePointerLeave);

    // Warm Floating Embers
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * (scene.clientWidth || 500),
      y: Math.random() * (scene.clientHeight || 600),
      radius: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.45 + 0.15,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15
    }));

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = scene.clientWidth || 500;
      const h = scene.clientHeight || 600;

      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const flicker = 0.75 + Math.sin(frame * 0.04 + p.x) * 0.25;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 119, 65, ${p.alpha * flicker})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff542b';
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const render = () => {
      frame++;
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      const tiltY = currentX * 12;
      const tiltX = -currentY * 10;
      const floatY = Math.sin(frame * 0.015) * 6;

      if (card) {
        card.style.transform = `
          translate3d(${currentX * 10}px, ${floatY}px, 0)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          scale(1.015)
        `;
      }

      if (light) {
        light.style.transform = `translate(${currentX * 60}px, ${currentY * 60}px)`;
      }

      drawParticles();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      scene.removeEventListener('pointermove', handlePointerMove);
      scene.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormStatus('Pehle saare fields toh bharo, yaar! (Fill all fields)');
      return;
    }
    setFormStatus('Picture abhi baaki hai mere dost! Opening mail client...');
    const mailtoLink = `mailto:tiwarishivi261@gmail.com?subject=Cinematic Inquiry from ${encodeURIComponent(contactForm.name)}&body=${encodeURIComponent(contactForm.message + '\n\nFrom: ' + contactForm.email)}`;
    window.location.href = mailtoLink;
    setTimeout(() => {
      setFormStatus('Aapka message bhej diya gaya hai! 🎬✨');
      setContactForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  const projects = [
    {
      id: 'luma',
      title: 'LUMA 🧠✨',
      category: 'Mental Wellness & Good Vibes',
      status: 'Completed',
      description: 'Zindagi mein stress ho ya anxiety, LUMA is your ultimate emotional support companion with mood check-ins, journaling, and breathing exercises.',
      tags: ['React', 'Tailwind', 'Vibe Coding'],
      role: 'Lead Developer',
      github: 'https://github.com/tiwarishivi261-rgb',
      imageBg: 'from-[#b51f36]/20 to-[#541321]/40'
    },
    {
      id: 'bitwise',
      title: 'Bitwise 🏆🔥',
      category: 'Hackathon Selection',
      status: 'Completed & Selected',
      description: 'Selected internal rounds with algorithmic focus and practical implementation.',
      tags: ['Python', 'React', 'Hackathon Project'],
      role: 'Full Stack & Logic',
      github: 'https://github.com/tiwarishivi261-rgb',
      imageBg: 'from-[#24181B]/40 to-[#b51f36]/30'
    },
    {
      id: 'swasthya',
      title: 'Swasthya Setu 🌿',
      category: 'Digital Health Prototype',
      status: 'Completed',
      description: 'Bridging healthcare accessibility gaps with clean interface design and simple UX.',
      tags: ['UI/UX', 'Accessibility', 'Impact'],
      role: 'Frontend Architect',
      github: 'https://github.com/tiwarishivi261-rgb',
      imageBg: 'from-[#D99BA5]/20 to-[#b51f36]/30'
    },
    {
      id: 'scamtrace',
      title: 'ScamTrace 🕵️‍♀️💬',
      category: 'Hinglish Security Tool',
      status: 'In Progress',
      description: 'Detecting suspicious scam links and messages tailored for Indian conversational context.',
      tags: ['Python', 'NLP', 'Cybersecurity'],
      role: 'Developer',
      github: 'https://github.com/tiwarishivi261-rgb',
      imageBg: 'from-[#541321]/30 to-[#24181B]/50'
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : activeTab === 'completed' 
    ? projects.filter(p => p.status.includes('Completed')) 
    : projects.filter(p => p.status === 'In Progress');

  return (
    <div className="min-h-screen bg-[#100303] text-[#FFF1E9] font-serif selection:bg-[#B51F36] selection:text-[#FFF5E8] overflow-x-hidden relative">
      
      {/* THEATRE CURTAIN OPENING OVERLAY ON PAGE LOAD */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Left Velvet Curtain */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#210706] via-[#48130f] to-[#100303] border-r-2 border-[#B52B18]/50 shadow-2xl transition-transform duration-1200 ease-in-out z-50 ${curtainOpened ? '-translate-x-full' : 'translate-x-0'}`}
        ></div>
        {/* Right Velvet Curtain */}
        <div 
          className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#210706] via-[#48130f] to-[#100303] border-l-2 border-[#B52B18]/50 shadow-2xl transition-transform duration-1200 ease-in-out z-50 ${curtainOpened ? 'translate-x-full' : 'translate-x-0'}`}
        ></div>
      </div>

      {/* CINEMATIC INTRO POPUP MODAL (Triggers ONLY when clicking the Wine Card) */}
      {showIntroModal && (
        <div 
          onClick={() => setShowIntroModal(false)}
          className="fixed inset-0 z-50 bg-[#080202]/90 backdrop-blur-md flex flex-col items-center justify-center text-[#FFF1E9] cursor-pointer transition-all duration-500 p-4"
        >
          <div className="relative max-w-md w-full bg-[#100303] border border-[#B52B18] rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(181,43,24,0.4)] transform hover:scale-[1.02] transition-transform">
            
            {/* Wine Pouring Vector Animation Inside Modal */}
            <div className="w-full h-40 flex items-center justify-center mb-4">
              <svg width="180" height="140" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 20 L90 45 L80 60 L30 35 Z" fill="#210706" stroke="#FF9B78" strokeWidth="2" />
                <path d="M85 42 L110 55 L105 65 L80 52 Z" fill="#B52B18" />
                <path d="M105 60 C110 90, 112 110, 115 130" stroke="#B52B18" strokeWidth="5" strokeLinecap="round" className="animate-pulse" />
                <circle cx="115" cy="132" r="6" fill="#FF9B78" className="animate-ping" />
                <line x1="115" y1="125" x2="115" y2="150" stroke="#FFF1E9" strokeWidth="3" />
                <ellipse cx="115" cy="150" rx="20" ry="6" stroke="#FFF1E9" strokeWidth="3" fill="none" />
                <path d="M90 95 Q115 145 140 95 Z" stroke="#FFF1E9" strokeWidth="3" fill="none" />
                <path d="M96 108 Q115 140 134 108 Z" fill="#B52B18" />
              </svg>
            </div>

            <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#FF9B78] block mb-2">
              SHIVI TIWARI • DIRECTORS CUT
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif italic text-[#FFF1E9] mb-3">
              "A Little Wine. A Lot Of Code."
            </h2>
            <p className="font-sans text-xs text-[#E7B5A6] uppercase tracking-[0.2em] mb-6">
              B.Tech Computer Science • Class of '29
            </p>

            <button 
              onClick={() => setShowIntroModal(false)}
              className="px-8 py-3 rounded-full bg-[#B52B18] text-[#FFF1E9] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-[#48130f] transition-all shadow-lg shadow-[#B52B18]/40"
            >
              Close & Explore 🎬 ↗
            </button>
          </div>
        </div>
      )}

      {/* Film Grain Texture */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.12] bg-[radial-gradient(#24181B_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#100303]/80 border-b border-[#48130F]/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif italic text-2xl font-bold tracking-tight text-[#B52B18] group-hover:scale-105 transition-transform">
              SHIVI.
            </span>
            <span className="hidden sm:inline-block text-[10px] font-sans uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#210706] text-[#FF9B78] border border-[#48130F]">
              Filmy Chic Edition 🍷
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-sans tracking-wide">
            <a href="#work" className="hover:text-[#FF9B78] transition-colors">FILMS & WORK 🎥</a>
            <a href="#about" className="hover:text-[#FF9B78] transition-colors">THE VIBE ✨</a>
            <a href="#skills" className="hover:text-[#FF9B78] transition-colors">SUPERPOWERS ⚡</a>
            <a href="#journey" className="hover:text-[#FF9B78] transition-colors">EXPERIENCES 🚀</a>
            <a href="#experiments" className="hover:text-[#FF9B78] transition-colors">MASALA PLAYGROUND 🍿</a>
            <a href="#contact" className="px-5 py-2.5 rounded-full bg-[#B52B18] text-[#FFF1E9] hover:bg-[#48130F] transition-all shadow-sm flex items-center gap-2 font-medium">
              <span>Baat Karein? ↗</span>
            </a>
          </nav>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#FFF1E9] hover:bg-[#210706] transition-colors"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#100303] border-b border-[#48130F] shadow-xl py-6 px-8 flex flex-col gap-4 font-sans">
            <a href="#work" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-[#FF9B78] py-2 border-b border-[#210706]">FILMS & WORK 🎥</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-[#FF9B78] py-2 border-b border-[#210706]">THE VIBE ✨</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-[#FF9B78] py-2 border-b border-[#210706]">SUPERPOWERS ⚡</a>
            <a href="#journey" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-[#FF9B78] py-2 border-b border-[#210706]">EXPERIENCES 🚀</a>
            <a href="#experiments" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-[#FF9B78] py-2 border-b border-[#210706]">MASALA PLAYGROUND 🍿</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mt-2 text-center py-3 rounded-xl bg-[#B52B18] text-[#FFF1E9] font-medium">Baat Karein? ↗</a>
          </div>
        )}
      </header>

      {/* HERO SECTION WITH CLICKABLE WINE POURING CARD */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 pt-12 pb-24">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#210706] border border-[#48130F] text-xs font-sans font-semibold tracking-wider uppercase text-[#FF9B78]">
              <span className="w-2 h-2 rounded-full bg-[#B52B18] animate-pulse"></span>
              <span>⚡ TARGETING MICROSOFT & BEYOND • CLASS OF '29</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif italic tracking-tight leading-[1.05] text-[#FFF1E9]">
              Main apni <span className="text-[#FF9B78] underline decoration-[#B52B18]/60 decoration-wavy">favorite</span> hoon.
            </h1>

            <p className="text-lg sm:text-xl text-[#E7B5A6] max-w-xl font-sans font-normal leading-relaxed">
              Hi, main hoon <strong className="text-[#FFF1E9] font-semibold">Shivi Tiwari</strong>! Code mera junoon hai, cinematic aesthetic meri pehchan, aur continuous learning mera style. *Picture abhi baaki hai mere dost!* 🍷🎬
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-sans">
              <a href="#work" className="px-8 py-4 rounded-full bg-[#B52B18] text-[#FFF1E9] hover:bg-[#48130F] transition-all font-medium flex items-center gap-2 shadow-lg shadow-[#B52B18]/30">
                <span>Projects Dekho 🍿</span>
              </a>
              <a href="#about" className="px-8 py-4 rounded-full bg-[#210706] text-[#FFF1E9] hover:bg-[#320a09] transition-all font-medium border border-[#48130F]">
                Meri Kahani 📖
              </a>
            </div>

            <div className="pt-6 flex items-center gap-6 text-xs font-sans text-[#E7B5A6]/60 uppercase tracking-widest border-t border-[#48130F] w-full">
              <span>B.Tech CS Undergrad</span>
              <span>•</span>
              <span>Full-Stack Enthusiast</span>
              <span>•</span>
              <span>Hackathon Participant</span>
            </div>
          </div>

          {/* Right Column: CLICKABLE WINE POURING 3D CARD */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div 
              ref={sceneRef} 
              onClick={() => setShowIntroModal(true)}
              className="relative w-full min-h-[580px] sm:min-h-[640px] flex items-center justify-center p-4 cursor-pointer select-none overflow-hidden rounded-3xl bg-radial from-[#48130f]/40 via-[#210706]/60 to-[#080202] border border-[#48130F]/50 group"
              style={{ perspective: '1100px' }}
            >
              {/* Ambient Light Glow */}
              <div 
                ref={lightRef} 
                className="absolute w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-[#b52b18] blur-[130px] opacity-20 rounded-full pointer-events-none transition-transform duration-300 ease-out"
              ></div>

              <div className="absolute top-6 left-6 font-sans text-[10px] tracking-[4px] text-[#F1B5A0] z-20 uppercase">
                S H I V I &nbsp; T I W A R I
              </div>

              {/* Floating Embers Canvas */}
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

              {/* CLICKABLE 3D TILT CARD WITH WINE POURING */}
              <article 
                ref={cardRef} 
                className="relative w-[88%] sm:w-[380px] h-[500px] rounded-[140px_140px_16px_16px] shadow-[0_0_60px_rgba(157,39,29,0.25),0_35px_100px_rgba(0,0,0,0.8)] border border-[#FF9B78]/30 group-hover:border-[#FF9B78] overflow-hidden transition-all duration-300 z-20"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* WINE POURING ARTWORK */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#210706] to-[#080202] flex items-center justify-center overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 400 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="object-cover scale-105">
                    <circle cx="200" cy="220" r="140" fill="#B52B18" fillOpacity="0.25" />

                    {/* Wine Stream & Splash */}
                    <path d="M190 20 C 195 100, 205 180, 200 320" stroke="#B52B18" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="200" cy="320" r="12" fill="#FF9B78" />

                    {/* Wine Glass Base & Bowl */}
                    <line x1="200" y1="320" x2="200" y2="420" stroke="#FFF1E9" strokeWidth="4" />
                    <ellipse cx="200" cy="420" rx="35" ry="10" stroke="#FFF1E9" strokeWidth="4" fill="none" />
                    <path d="M150 260 Q200 360 250 260 Z" stroke="#FFF1E9" strokeWidth="4" fill="none" />
                    {/* Liquid Fill */}
                    <path d="M160 280 Q200 350 240 280 Z" fill="#B52B18" />

                    {/* Elegant Sparkling Particles around Glass */}
                    <circle cx="160" cy="240" r="3" fill="#FF9B78" />
                    <circle cx="240" cy="230" r="4" fill="#FF9B78" />
                    <circle cx="180" cy="200" r="2" fill="#FFF1E9" />
                  </svg>
                </div>

                {/* Card Gradient Overlay Shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#100303] via-transparent to-[#210706]/40 pointer-events-none"></div>

                {/* Card Caption */}
                <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
                  <div className="text-[#FF9B78] tracking-[5px] uppercase font-sans text-[10px] mb-2">
                    CLICK TO OPEN INTRO 🍷
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-serif italic font-normal leading-[0.95] text-[#FFF1E9] drop-shadow-lg">
                    Directors<br />Cut.
                  </h2>
                  <p className="mt-3 font-sans text-[10px] tracking-[3px] text-[#E7B5A6] uppercase">
                    A LITTLE WINE. A LOT OF CODE.
                  </p>
                </div>
              </article>

              <div className="absolute bottom-6 right-6 font-sans text-[9px] tracking-[2px] text-[#DCA99B] z-20 uppercase animate-pulse">
                CLICK WINE CARD FOR INTRO ↗
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SELECTED WORK SECTION */}
      <section id="work" className="py-24 px-6 bg-[#210706]/40 border-t border-b border-[#48130F]/40 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase font-sans tracking-widest text-[#FF9B78] font-semibold">Featured Work</span>
              <h2 className="text-4xl sm:text-6xl font-serif italic tracking-tight mt-2 text-[#FFF1E9]">
                Projects & Prototypes 🚀
              </h2>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#100303] border border-[#48130F] font-sans">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'all' ? 'bg-[#B52B18] text-[#FFF1E9]' : 'text-[#FFF1E9] hover:text-[#FF9B78]'}`}
              >
                Sab Kuch 🎥
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'completed' ? 'bg-[#B52B18] text-[#FFF1E9]' : 'text-[#FFF1E9] hover:text-[#FF9B78]'}`}
              >
                Completed 🌟
              </button>
              <button 
                onClick={() => setActiveTab('in-progress')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === 'in-progress' ? 'bg-[#B52B18] text-[#FFF1E9]' : 'text-[#FFF1E9] hover:text-[#FF9B78]'}`}
              >
                In Progress 🎬
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
            {filteredProjects.map((project, idx) => (
              <div 
                key={project.id}
                className="group relative rounded-3xl bg-[#100303] border border-[#48130F] p-8 sm:p-10 shadow-lg hover:border-[#B52B18] transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${project.imageBg} rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#210706] border border-[#48130F] text-xs font-semibold uppercase tracking-wider text-[#FF9B78]">
                      {project.category}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${project.status.includes('Completed') ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-3xl font-serif italic font-bold text-[#FFF1E9] group-hover:text-[#FF9B78] transition-colors mb-3">
                    {project.title}
                  </h3>

                  <p className="text-[#E7B5A6]/80 text-base leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="text-xs font-medium text-[#FF9B78] mb-6 flex items-center gap-2">
                    <span className="opacity-70">Role:</span>
                    <span className="px-2 py-0.5 rounded bg-[#210706] border border-[#48130F]">{project.role}</span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs px-3 py-1 rounded-lg bg-[#210706] text-[#FFF1E9] border border-[#48130F] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[#48130F]">
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFF1E9] hover:text-[#FF9B78] transition-colors"
                    >
                      <span>📂 GitHub Repo ↗</span>
                    </a>

                    <span className="text-xs uppercase tracking-wider text-[#FF9B78] font-mono">
                      PROJECT #0{idx + 1}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs uppercase font-sans tracking-widest text-[#FF9B78] font-semibold">Behind The Scenes 🎥</span>
            <h2 className="text-4xl sm:text-6xl font-serif italic tracking-tight text-[#FFF1E9]">
              "Pushpa, I hate tears... par bugs mujhe rula nahi sakte!"
            </h2>
            <p className="text-lg font-sans text-[#E7B5A6] leading-relaxed font-normal">
              Main hoon Shivi Tiwari—B.Tech CS student (Class of '29, Banasthali). Code seekhne ka shauk hai, Microsoft internship target hai aur simple logic ko clean design ke sath convert karna mera routine hai! 💻✨
            </p>

            <div className="p-5 rounded-2xl bg-[#210706] border border-[#48130F] flex items-center gap-4 mt-2 font-sans shadow-md">
              <div className="p-3 rounded-xl bg-[#B52B18] text-[#FFF1E9] font-bold text-lg">
                🚀
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FF9B78] block font-semibold">Current Mission</span>
                <span className="text-sm font-serif italic font-medium text-[#FFF1E9]">Mastering Python, DSA & Building Production Web Projects</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6 font-sans">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#210706]/60 border border-[#48130F] backdrop-blur-sm relative">
              <h3 className="text-xl font-serif italic font-semibold text-[#FF9B78] mb-6">Focus & Stack</h3>

              <div className="flex flex-wrap gap-3">
                {[
                  "EDITORIAL DESIGN AESTHETIC", 
                  "BOLLYWOOD DRAMA & CODE", 
                  "MICROSOFT INTERN PREP", 
                  "HACKATHON PARTICIPATION", 
                  "REACT & FRONTEND",
                  "PYTHON & DSA GRIND"
                ].map((interest, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 rounded-xl bg-[#100303] border border-[#48130F] text-xs sm:text-sm font-semibold text-[#FFF1E9] hover:bg-[#B52B18] transition-all cursor-default"
                  >
                    ✨ {interest}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#48130F] grid grid-cols-2 gap-4 text-xs text-[#E7B5A6]/80">
                <div>
                  <span className="block font-semibold text-[#FF9B78] uppercase text-[10px]">Location</span>
                  <span>India 📍</span>
                </div>
                <div>
                  <span className="block font-semibold text-[#FF9B78] uppercase text-[10px]">Batch</span>
                  <span>Class of 2029 (B.Tech CS) 🎓</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-24 px-6 bg-[#080202] text-[#FFF1E9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans uppercase tracking-widest text-[#FF9B78] font-semibold">Technical Stack</span>
            <h2 className="text-4xl sm:text-6xl font-serif italic tracking-tight mt-2 text-[#FFF1E9]">
              Mere Toolkit ⚡
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            {[
              { category: "Programming & DSA", icon: "💻", skills: ["Python", "C Programming", "Data Structures", "Problem Solving"] },
              { category: "Frontend Dev", icon: "✨", skills: ["React", "JavaScript", "Tailwind CSS", "HTML5 & CSS3"] },
              { category: "Design & UX", icon: "🎨", skills: ["UI/UX Layouts", "Dark Editorial", "Glassmorphism", "Responsive Web"] },
              { category: "Tools & Flow", icon: "🔮", skills: ["Git & GitHub", "VS Code", "Canvas / JS", "FastAPI Prototypes"] }
            ].map((cat, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-3xl bg-[#100303] border border-[#48130F] hover:border-[#B52B18] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="p-3 rounded-2xl bg-[#210706] w-fit mb-6 text-2xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-serif italic font-bold text-[#FFF1E9] mb-4">
                    {cat.category}
                  </h3>
                  <ul className="space-y-2.5">
                    {cat.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2 text-sm text-[#E7B5A6] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B52B18]"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#48130F] text-[10px] uppercase tracking-widest text-[#FF9B78] font-mono">
                  STACK #0{idx + 1}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MILESTONES & ARENA SECTION */}
      <section id="journey" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans uppercase tracking-widest text-[#FF9B78] font-semibold">My Journey & Arenas</span>
            <h2 className="text-4xl sm:text-6xl font-serif italic tracking-tight mt-2 text-[#FFF1E9]">
              "Abhi toh bas trailer shuru hua hai... real climax toh abhi baaki hai!" 🎬✨
            </h2>
            <p className="text-[#E7B5A6]/80 font-sans mt-4 text-base">
              Har hackathon aur event seekhne aur naye ideas ko test karne ka ek moka hai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            {[
              { title: "Smart India Hackathon", role: "Internal Round Selection", desc: "BiteWise food optimization app idea ke sath college level evaluation clear kiya.", tag: "SIH PARTICIPATION 💡" },
              { title: "EVESpaper Hackathon", role: "National Finale Participant", desc: "Overnight coding grind aur national level teams ke sath competition ka experience.", tag: "FINALE EXPERIENCE 🚀" },
              { title: "Build With Bharat 2.0", role: "NIT Delhi Event", desc: "Open source community, tech talks aur civic-tech ideas explore kiye.", tag: "NIT DELHI 📍" }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-3xl bg-[#100303] border-2 border-dashed border-[#48130F] hover:border-[#B52B18] transition-all relative flex flex-col justify-between shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded bg-[#210706] text-[#FF9B78] font-semibold">
                      {item.tag}
                    </span>
                    <span className="text-lg">🎯</span>
                  </div>

                  <h3 className="text-2xl font-serif italic font-bold text-[#FFF1E9] mb-2 group-hover:text-[#FF9B78] transition-colors">
                    {item.title}
                  </h3>

                  <span className="text-xs font-semibold text-[#FF9B78] block mb-4">
                    {item.role}
                  </span>

                  <p className="text-[#E7B5A6]/80 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#48130F] flex items-center justify-between text-xs text-[#E7B5A6]/60 font-mono">
                  <span>LEARNING MILESTONE</span>
                  <span>#0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* INTERACTIVE EXPERIMENTS */}
      <section id="experiments" className="py-24 px-6 bg-[#210706]/40 border-t border-b border-[#48130F]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-sans uppercase tracking-widest text-[#FF9B78] font-semibold">Masala Playground 🍿</span>
              <h2 className="text-4xl sm:text-6xl font-serif italic tracking-tight mt-2 text-[#FFF1E9]">
                Kuch khatta, kuch meetha experiments!
              </h2>
            </div>
            <p className="text-[#E7B5A6]/80 font-sans max-w-md text-sm">
              Jab coding mein thoda drama chahiye hota hai, toh yeh chote-mote interactive experiments jaan daal dete hain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
            
            <div className="p-8 rounded-3xl bg-[#100303] border border-[#48130F] flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded bg-[#210706] text-[#FF9B78] font-semibold">
                  Item Song 01
                </span>
                <h3 className="text-xl font-serif italic font-bold text-[#FFF1E9] mt-4 mb-2">
                  Editorial Dialogue Mode
                </h3>
                <p className="text-sm text-[#E7B5A6]/80 mb-6">
                  "Kehte hain agar kisi cheez ko poori shiddat se chaho... toh saari kayamat tumhe Microsoft internship dilaane mein lag jaati hai!"
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#210706]/50 border border-[#48130F] text-center">
                <span className="font-serif italic text-3xl text-[#FF9B78] hover:scale-110 inline-block transition-transform cursor-pointer">
                  Shivi Tiwari
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#E7B5A6]/60 mt-2">Hover karke shiddat dekho</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#100303] border border-[#48130F] flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded bg-[#210706] text-[#FF9B78] font-semibold">
                  Item Song 02
                </span>
                <h3 className="text-xl font-serif italic font-bold text-[#FFF1E9] mt-4 mb-2">
                  Main Character Energy Booster
                </h3>
                <p className="text-sm text-[#E7B5A6]/80 mb-6">
                  Click this button jab coding karte waqt neend aane lage aur confidence low ho.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#210706]/50 border border-[#48130F] text-center flex flex-col items-center justify-center gap-3">
                <button 
                  onClick={() => alert('✨ Wahin to, picture abhi baaki hai mere dost! You got this, future SDE! 🚀')}
                  className="px-6 py-3 rounded-full bg-[#B52B18] text-[#FFF1E9] text-xs font-semibold uppercase tracking-wider hover:bg-[#48130F] transition-all shadow-sm"
                >
                  🔥 Slay The Bug!
                </button>
                <span className="text-[10px] uppercase tracking-widest text-[#E7B5A6]/60">Click for motivation</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#100303] border border-[#48130F] flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded bg-[#210706] text-[#FF9B78] font-semibold">
                  Item Song 03
                </span>
                <h3 className="text-xl font-serif italic font-bold text-[#FFF1E9] mt-4 mb-2">
                  The Stamp
                </h3>
                <p className="text-sm text-[#E7B5A6]/80 mb-6">
                  Pure cherry-red aesthetic combined with unmatchable computer science hustle.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#B52B18] to-[#210706] text-[#FFF1E9] text-center shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer">
                <span className="font-serif italic text-2xl">Main Hoon Na! 😎</span>
                <span className="block text-[10px] uppercase tracking-widest text-[#FF9B78] mt-1">B.Tech CS • Class of '29</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 bg-[#210706] text-[#FFF1E9] relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center font-sans">
          
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-[#FF9B78] font-semibold">Climax / The Grand Finale 🎭</span>
            <h2 className="text-4xl sm:text-6xl font-serif italic tracking-tight text-[#FFF1E9]">
              Rishte mein hum tumhare developer lagte hain, naam hai Shivi! 💌
            </h2>
            <p className="text-lg text-[#E7B5A6] leading-relaxed font-normal">
              Internship discussion ho, hackathon collaboration, ya bas tech/design pe charcha—message drop karo!
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <a 
                href="mailto:tiwarishivi261@gmail.com"
                className="flex items-center gap-3 text-base font-medium hover:text-[#FF9B78] transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#100303] text-[#FF9B78]">✉️</div>
                <span>tiwarishivi261@gmail.com</span>
              </a>

              <a 
                href="https://github.com/tiwarishivi261-rgb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base font-medium hover:text-[#FF9B78] transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#100303] text-[#FF9B78]">🐙</div>
                <span>github.com/tiwarishivi261-rgb ↗</span>
              </a>

              <a 
                href="https://www.linkedin.com/in/shivi-tiwari-891536309" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base font-medium hover:text-[#FF9B78] transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#100303] text-[#FF9B78]">💼</div>
                <span>linkedin.com/in/shivi-tiwari-891536309 ↗</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleContactSubmit} className="p-8 sm:p-10 rounded-3xl bg-[#100303] border border-[#48130F] shadow-2xl flex flex-col gap-6">
              <h3 className="text-2xl font-serif italic font-bold text-[#FFF1E9]">Dialogue Drop Karein 🎬</h3>
              
              {formStatus && (
                <div className="p-3 rounded-xl bg-[#B52B18]/20 border border-[#B52B18] text-xs text-[#FFF1E9]">
                  {formStatus}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#FF9B78]">Aapka Naam (Your Name)</label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Raj / Simran" 
                  className="px-4 py-3 rounded-xl bg-[#210706]/60 border border-[#48130F] text-[#FFF1E9] placeholder-[#E7B5A6]/30 focus:outline-none focus:border-[#B52B18] text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#FF9B78]">Aapka Email (Your Email)</label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="name@example.com" 
                  className="px-4 py-3 rounded-xl bg-[#210706]/60 border border-[#48130F] text-[#FFF1E9] placeholder-[#E7B5A6]/30 focus:outline-none focus:border-[#B52B18] text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#FF9B78]">Aapka Message (Dialogue)</label>
                <textarea 
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Message for Shivi..." 
                  className="px-4 py-3 rounded-xl bg-[#210706]/60 border border-[#48130F] text-[#FFF1E9] placeholder-[#E7B5A6]/30 focus:outline-none focus:border-[#B52B18] text-sm resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-[#B52B18] text-[#FFF1E9] font-medium hover:bg-[#48130f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B52B18]/30"
              >
                <span>Send Message 🚀</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-[#080202] border-t border-[#210706] text-[#E7B5A6]/70 text-sm font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-xl font-bold text-[#FFF1E9]">SHIVI.</span>
            <span>— Filmy Chic Velvet Noir 🍷</span>
          </div>

          <div className="text-xs uppercase tracking-widest text-[#FF9B78] font-mono">
            Coded & Designed by Shivi Tiwari © 2026 🎬
          </div>

          <div className="flex items-center gap-6">
            <a href="#work" className="hover:text-[#FFF1E9] transition-colors">Films</a>
            <a href="#about" className="hover:text-[#FFF1E9] transition-colors">Vibe</a>
            <a href="#contact" className="hover:text-[#FFF1E9] transition-colors">Climax</a>
          </div>

        </div>
      </footer>

    </div>
  );
}