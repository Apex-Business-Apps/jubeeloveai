import { useEffect, useState } from 'react';
import { useBackgroundStore } from '@/store/useBackgroundStore';
import './DynamicBackground.css';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function DynamicBackground() {
  const { currentTheme } = useBackgroundStore();
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate random floating elements based on theme
    const generateElements = () => {
      const count = 15;
      const newElements: FloatingElement[] = [];

      for (let i = 0; i < count; i++) {
        newElements.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 60,
          delay: Math.random() * 5,
          duration: 15 + Math.random() * 15,
        });
      }

      setElements(newElements);
    };

    generateElements();
  }, [currentTheme]);

  const getThemeConfig = () => {
    switch (currentTheme) {
      case 'home':
        return {
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          elementType: 'star',
          emoji: ['⭐', '✨', '🌟', '💫', '🌠'],
        };
      case 'writing':
        return {
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd3a5 100%)',
          elementType: 'pencil',
          emoji: ['✏️', '🖍️', '🖊️', '✍️', '📝'],
        };
      case 'shapes':
        return {
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
          elementType: 'shape',
          emoji: ['🔵', '🟦', '🔺', '⭐', '🔶'],
        };
      case 'progress':
        return {
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)',
          elementType: 'trophy',
          emoji: ['🏆', '🎖️', '🥇', '⭐', '🎯'],
        };
      case 'stickers':
        return {
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #fdcbf1 100%)',
          elementType: 'sticker',
          emoji: ['🎨', '🎪', '🎭', '🎈', '🎉'],
        };
      case 'settings':
        return {
          gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 50%, #a1c4fd 100%)',
          elementType: 'gear',
          emoji: ['⚙️', '🔧', '🛠️', '⚡', '🎚️'],
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          elementType: 'star',
          emoji: ['⭐'],
        };
    }
  };

  const config = getThemeConfig();

  return (
    <div className="dynamic-background" style={{ background: config.gradient }}>
      <div className="gradient-overlay" />
      <div className="floating-elements-container">
        {elements.map((element) => (
          <div
            key={element.id}
            className="floating-element"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            {config.emoji[Math.floor(Math.random() * config.emoji.length)]}
          </div>
        ))}
      </div>
      <div className="animated-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>
    </div>
  );
}
