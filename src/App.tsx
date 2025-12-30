import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from './components/ParticleBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { ThemeToggle } from './components/ThemeToggle';
import { Hero } from './components/Hero';
import { About } from './components/About/About';
import { Projects } from './components/Projects/Projects';
import { Certificates } from './components/Certificates/Certificates';
import { Contact } from './components/Contact/Contact';
import { useTheme } from './hooks/useTheme';

// Add custom element type for 'spline-viewer'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { url: string };
    }
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Dynamically load Spline viewer script if not already present
    if (!document.querySelector('script[data-spline]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.16/build/spline-viewer.js';
      script.setAttribute('data-spline', 'true');
      document.body.appendChild(script);
    }
    // Remove Spline logo after viewer loads and set transparent background
    const customizeSplineViewer = () => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        // Remove logo
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) logo.remove();
        // Set transparent background
        const canvas = viewer.shadowRoot.querySelector('canvas');
        if (canvas) canvas.style.background = 'transparent';
        // Remove any background on host
        if (viewer instanceof HTMLElement) {
          viewer.style.background = 'transparent';
        }
      }
    };
    setTimeout(customizeSplineViewer, 1000);
    window.addEventListener('load', customizeSplineViewer);
    return () => window.removeEventListener('load', customizeSplineViewer);
  }, []);

  return (
    <div className="min-h-screen transition-all duration-1000">
      <ParticleBackground />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Navbar />
            <ThemeToggle />

            {/* Spline 3D Viewer - Bottom Left Corner */}
            <spline-viewer 
              url="https://prod.spline.design/DHm2r0RlmMg9wm8T/scene.splinecode"
              style={{
                position: 'fixed',
                bottom: '-30px',
                left: '-14px',
                zIndex: 50,
                width: '160px',
                height: '384px',
                transform: 'scale(0.7)',
                pointerEvents: 'auto',
                borderRadius: '1rem',
                overflow: 'visible',
                boxShadow: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
                display: window.innerWidth < 768 ? 'none' : 'block',
              }}
            ></spline-viewer>
            {/* End Spline 3D Viewer */}
            
            <main>
              <Hero />
              <About />
              <Projects />
              <Certificates />
              <Contact />
            </main>

            <footer className="py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-white/10">
              <div className="container mx-auto px-6">
                <p>&copy; 2025 Pradeep Awasthi. Built with React, TypeScript, and lots of ❤️</p>
              </div>
            </footer>
          </motion.div>
          
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;