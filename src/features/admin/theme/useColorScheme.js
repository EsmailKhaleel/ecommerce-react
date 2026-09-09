import { useEffect, useState } from 'react';

/**
 * Tracks the app's existing dark mode signal so the MUI admin theme stays in
 * sync with the storefront toggle. The rest of the app communicates theme by
 * adding a `dark` class to <html> and persisting it to localStorage, so we
 * observe that class rather than introducing a second source of truth.
 */
export default function useColorScheme() {
  const [mode, setMode] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      setMode(root.classList.contains('dark') ? 'dark' : 'light');
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return mode;
}
