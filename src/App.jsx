import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowUpRight, Github, Linkedin, Mail, Code, Palette, 
  Terminal, Cpu, BookOpen, Layers, ExternalLink, Award, Heart, 
  Compass, ChevronRight, Menu, X, Send, CheckCircle2, RefreshCw, Eye
} from 'lucide-react';
import * as THREE from 'three';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Initialize Three.js Cherry Hero Animation
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e8, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const redLight = new THREE.PointLight(0xb51f36, 4, 20);
    redLight.position.set(-5, -3, 2);
    scene.add(redLight);

    // Cherry Group
    const cherryGroup = new THREE.Group();

    // Cherry 1 (Main)
    const geometry1 = new THREE.SphereGeometry(1.1, 64, 64);
    const material1 = new THREE.MeshPhysicalMaterial({
      color: 0xb51f36,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.1,
      reflectivity: 0.9
    });
    const cherry1 = new THREE.Mesh(geometry1, material1);
    cherry1.position.set(-0.8, -0.6, 0);
    cherryGroup.add(cherry1);

    // Cherry 2 (Secondary)
    const geometry2 = new THREE.SphereGeometry(0.95, 64, 64);
    const material2 = new THREE.MeshPhysicalMaterial({
      color: 0x8a1223,
      roughness: 0.18,
      metalness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });
    const cherry2 = new THREE.Mesh(geometry2, material2);
    cherry2.position.set(0.7, -0.8, 0.3);
    cherryGroup.add(cherry2);

    // Stem Curve
    const curve1 = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.8, 0.5, 0),
      new THREE.Vector3(0, 2.2, 0),
      new THREE.Vector3(0.7, 0.3, 0.3)
    );
    const tubeGeo1 = new THREE.TubeGeometry(curve1, 64, 0.08, 16, false);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x2e4f32, roughness: 0.6 });
    const stem1 = new THREE.Mesh(tubeGeo1, stemMaterial);
    cherryGroup.add(stem1);

    // Main Stem upward extension with leaf
    const curve2 = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 2.2, 0),
      new THREE.Vector3(0.5, 3.2, -0.2),
      new THREE.Vector3(1.2, 3.8, -0.5)
    );
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 64, 0.07, 16, false);
    const stem2 = new THREE.Mesh(tubeGeo2, stemMaterial);
    cherryGroup.add(stem2);

    // Leaf
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.5, 0.8, 1.5, 1.2, 2.0, 0.5);
    leafShape.bezierCurveTo(1.5, -0.2, 0.5, -0.5, 0, 0);

    const extrudeSettings = { depth: 0.03, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x3a603f, roughness: 0.5, side: THREE.DoubleSide });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0, 2.2, 0);
    leaf.rotation.z = -0.5;
    leaf.rotation.y = 0.5;
    cherryGroup.add(leaf);

    scene.add(cherryGroup);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 200;
      mouseY = (event.clientY - window.innerHeight / 2) / 200;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX = mouseX;
      targetY = mouseY;

      cherryGroup.rotation.y += 0.05 * (targetX - cherryGroup.rotation.y);
      cherryGroup.rotation.x += 0.05 * (targetY - cherryGroup.rotation.x);

      // Gentle floating
      cherryGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
      cherryGroup.rotation.z = Math.cos(elapsedTime * 1.0) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormStatus('Please fill in all fields before sending.');
      return;
    }
    setFormStatus('Message prepared! Opening your mail client...');
    const mailtoLink = `mailto:tiwarishivi261@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(contactForm.name)}&body=${encodeURIComponent(contactForm.message + '\n\nFrom: ' + contactForm.email)}`;
    window.location.href = mailtoLink;
    setTimeout(() => {
      setFormStatus('Thank you! Looking forward to connecting.');
      setContactForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  const projects = [
    {
      id: 'luma',
      title: 'LUMA',
      category: 'Student Mental Wellness Companion',
      status: 'Completed',
      description: 'A thoughtful mental wellness companion featuring mood check-ins, guided journaling, soothing breathing exercises, streak tracking, and a supportive friendly companion experience.',
      tags: ['React', 'Tailwind CSS', 'UI/UX Design', 'JavaScript'],
      role: 'Frontend Developer & UI/UX Designer',
      github: 'https://github.com/tiwarishivi261-rgb',
      imageBg: 'from-[#b51f36]/20 to-[#541321]/40'
    },
    {
      id: 'bitwise',
      title: 'Bitwise',
      category: 'Hackathon Project',
      status: 'Completed & Selected',
      description: 'An advanced competitive hackathon project selected from a fiercely competitive pool of 300+ teams, focusing on algorithmic problem-solving and streamlined developer toolsets.',
      tags: ['Python', 'React', 'Problem Solving', 'API Integration'],
      role: 'Lead Frontend & Systems Integrator',
      github: 'https://github.com/tiwarishivi261-rgb',
      imageBg: 'from-[#24181B]/40 to-[#b51f36]/30'
    },
    {
      id: 'swasthya',
      title: 'Swasthya Setu',
      category: 'Digital Health Initiative',
      status: 'Completed',
      description: 'A community-centric health digital project bridging the gap between grassroots healthcare resources and individuals through accessible, localized digital interfaces.',
      tags: ['UI/UX', 'HTML/CSS', 'Responsive Design', 'Accessibility'],
      role: 'UI/UX Designer & Frontend Developer',
      github: 'https://github.com/tiwarishivi261-rgb',
      imageBg: 'from-[#D99BA5]/20 to-[#b51f36]/30'
    },
    {
      id: 'scamtrace',
      title: 'ScamTrace',
      category: 'In-Progress Concept',
      status: 'In Progress',
      description: 'An exploratory concept engineered to detect digital scams, phishing patterns, and fraudulent communication specifically tailored for Hindi and Hinglish dialogues.',
      tags: ['Python', 'NLP Concepts', 'Research & Prototyping', 'UI Design'],
      role: 'Creator & Researcher',
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
    <div className="min-h-screen bg-[#FFF5E8] text-[#24181B] font-sans selection:bg-[#B51F36] selection:text-[#FFF5E8] overflow-x-hidden">
      
      {/* Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[radial-gradient(#24181B_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FFF5E8]/80 border-b border-[#D99BA5]/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif italic text-2xl font-bold tracking-tight text-[#B51F36] group-hover:scale-105 transition-transform">
              SHIVI.
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#F3E5D3] text-[#541321] border border-[#D99BA5]/50">
              After Hours
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="#work" className="hover:text-[#B51F36] transition-colors relative py-1">WORK</a>
            <a href="#about" className="hover:text-[#B51F36] transition-colors relative py-1">ABOUT</a>
            <a href="#skills" className="hover:text-[#B51F36] transition-colors relative py-1">SKILLS</a>
            <a href="#contact" className="px-5 py-2.5 rounded-full bg-[#B51F36] text-[#FFF5E8] hover:bg-[#541321] transition-all shadow-sm flex items-center gap-2">
              <span>Let's Talk</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </nav>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#24181B] hover:bg-[#F3E5D3]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FFF5E8] border-b border-[#D99BA5]/30 shadow-xl py-6 px-8 flex flex-col gap-4">
            <a href="#work" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif">WORK</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif">ABOUT</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif">SKILLS</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mt-2 text-center py-3 rounded-xl bg-[#B51F36] text-[#FFF5E8]">Let's Talk ↗</a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-12 pb-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#B51F36]/10 to-[#D99BA5]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F3E5D3] border border-[#D99BA5]/40 text-xs font-semibold tracking-wider uppercase text-[#541321]">
              <span className="w-2 h-2 rounded-full bg-[#B51F36] animate-pulse"></span>
              <span>OPEN TO INTERNSHIP OPPORTUNITIES</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif tracking-tight leading-[1.05] text-[#24181B]">
              Building things <br />
              that feel like <span className="italic text-[#B51F36] font-normal underline decoration-[#D99BA5]/60 decoration-wavy">magic.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#24181B]/80 max-w-xl font-normal leading-relaxed">
              Hi, I'm <strong className="text-[#B51F36] font-semibold">Shivi</strong> — a computer science student, frontend developer, and UI/UX enthusiast turning ideas into interactive experiences.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#work" className="px-8 py-4 rounded-full bg-[#B51F36] text-[#FFF5E8] hover:bg-[#541321] transition-all font-medium flex items-center gap-2 shadow-lg shadow-[#B51F36]/20">
                <span>Explore My Work</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
              <a href="#about" className="px-8 py-4 rounded-full bg-[#F3E5D3] text-[#24181B] hover:bg-[#e6d3bc] transition-all font-medium border border-[#D99BA5]/40">
                A Little About Me
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 h-[420px] sm:h-[500px] w-full relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#F3E5D3]/50 to-transparent rounded-3xl border border-[#D99BA5]/30"></div>
            <div ref={canvasRef} className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"></div>
          </div>
        </div>
      </section>

      {/* WORK SECTION */}
      <section id="work" className="py-24 px-6 bg-[#F3E5D3]/50 border-t border-b border-[#D99BA5]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B51F36] font-semibold">Curated Portfolio</span>
              <h2 className="text-4xl sm:text-6xl font-serif tracking-tight mt-2 text-[#24181B]">
                Things I've brought to life.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <div key={project.id} className="group relative rounded-3xl bg-[#FFF5E8] border border-[#D99BA5]/40 p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#F3E5D3] border border-[#D99BA5]/50 text-xs font-semibold uppercase tracking-wider text-[#541321]">
                      {project.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#24181B] mb-3">{project.title}</h3>
                  <p className="text-[#24181B]/80 text-base leading-relaxed mb-6">{project.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs px-3 py-1 rounded-lg bg-[#F3E5D3]/60 text-[#24181B] font-mono">#{tag}</span>
                    ))}
                  </div>
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#24181B] hover:text-[#B51F36]">
                    <Github className="w-4 h-4" /> <span>View Repository</span> <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-[#B51F36] font-semibold">The Human Behind The Screen</span>
            <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-[#24181B]">More than just code.</h2>
            <p className="text-lg text-[#24181B]/85 leading-relaxed">
              I'm Shivi, a computer science student who loves building digital experiences that combine thoughtful design with practical technology.
            </p>
          </div>
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#F3E5D3]/60 border border-[#D99BA5]/40">
            <h3 className="text-xl font-serif font-semibold text-[#541321] mb-6">Pillars of my journey</h3>
            <div className="flex flex-wrap gap-3">
              {["FRONTEND DEVELOPMENT", "UI & UX DESIGN", "CREATIVE TECH", "HACKATHONS", "REACT & TYPESCRIPT"].map((item, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-[#FFF5E8] border border-[#D99BA5]/40 text-xs font-semibold text-[#24181B]">
                  ✦ {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-24 px-6 bg-[#24181B] text-[#FFF5E8]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#D99BA5] font-semibold">Technical Arsenal</span>
          <h2 className="text-4xl sm:text-6xl font-serif tracking-tight mt-2 text-[#FFF5E8]">A creative technical display.</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { cat: "Fundamentals", skills: ["C", "Python", "Problem Solving"] },
            { cat: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS"] },
            { cat: "Design", skills: ["UI/UX Prototyping", "Wireframing", "Layouts"] },
            { cat: "Creative", skills: ["Three.js", "Hackathons", "Git"] }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-[#2e1f24] border border-[#D99BA5]/20">
              <h3 className="text-xl font-serif font-bold text-[#FFF5E8] mb-4">{item.cat}</h3>
              <ul className="space-y-2">
                {item.skills.map((s, si) => (
                  <li key={si} className="text-sm text-[#FFF5E8]/80 font-mono">• {s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 bg-[#160C0D] text-[#FFF5E8]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#D99BA5] font-semibold">The Grand Finale</span>
          <h2 className="text-4xl sm:text-6xl font-serif tracking-tight mt-2 text-[#FFF5E8]">Got something good brewing?</h2>
        </div>
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#2e1f24] border border-[#D99BA5]/30">
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#D99BA5] font-mono mb-2">Your Name</label>
              <input 
                type="text" 
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-[#160C0D] border border-[#D99BA5]/30 text-[#FFF5E8] text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#D99BA5] font-mono mb-2">Your Email</label>
              <input 
                type="email" 
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#160C0D] border border-[#D99BA5]/30 text-[#FFF5E8] text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#D99BA5] font-mono mb-2">Your Message</label>
              <textarea 
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 rounded-xl bg-[#160C0D] border border-[#D99BA5]/30 text-[#FFF5E8] text-sm focus:outline-none resize-none"
              ></textarea>
            </div>
            {formStatus && <div className="text-xs font-mono text-[#D99BA5] text-center">{formStatus}</div>}
            <button type="submit" className="w-full py-4 rounded-full bg-[#B51F36] text-[#FFF5E8] font-medium text-sm flex items-center justify-center gap-2">
              <span>Send Message</span> <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-[#160C0D] border-t border-[#2e1f24] text-center text-xs font-mono text-[#FFF5E8]/50">
        <p>Made with curiosity by Shivi Tiwari 🍒 © {new Date().getFullYear()}</p>
      </footer>

    </div>
  );
}