import { useState, useEffect } from 'react';

/**
 * Custom hook for a typewriter effect.
 * @param text The full text to type out.
 * @param speed Speed in milliseconds per character (default 30ms).
 * @returns The current slice of text being displayed.
 */
export function useTypewriter(text: string, speed = 30) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      // Allow index to go one past length to ensure full string is set
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
}
