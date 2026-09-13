import { useContext, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { LanguageContext } from './Context/LanguageContext';
import Routing from './Routing/Routing';

function App() {
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      overscroll: true,
      anchors: { offset: -76 },
    });

    let animationFrame;

    const frame = (time) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(frame);
    };

    const handleVisibility = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };

    animationFrame = window.requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener('visibilitychange', handleVisibility);
      lenis.destroy();
    };
  }, []);

  return (
    <div dir={language}>
      <RouterProvider router={Routing}></RouterProvider>
    </div>
  )
}

export default App;
