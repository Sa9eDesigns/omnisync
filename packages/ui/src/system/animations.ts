// Universal Animation System for Cross-Platform Components
// Works across Web, React Native, and Electron

import { DesignTokens } from '../tokens';

// Animation configuration
export interface AnimationConfig {
  duration?: keyof DesignTokens['animations']['duration'] | number;
  easing?: keyof DesignTokens['animations']['easing'] | string;
  delay?: number;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Predefined animations
export interface PredefinedAnimations {
  fadeIn: AnimationConfig;
  fadeOut: AnimationConfig;
  slideInUp: AnimationConfig;
  slideInDown: AnimationConfig;
  slideInLeft: AnimationConfig;
  slideInRight: AnimationConfig;
  slideOutUp: AnimationConfig;
  slideOutDown: AnimationConfig;
  slideOutLeft: AnimationConfig;
  slideOutRight: AnimationConfig;
  scaleIn: AnimationConfig;
  scaleOut: AnimationConfig;
  bounce: AnimationConfig;
  pulse: AnimationConfig;
  shake: AnimationConfig;
  spin: AnimationConfig;
  ping: AnimationConfig;
}

// Default animation configurations
export const predefinedAnimations: PredefinedAnimations = {
  fadeIn: {
    duration: 'normal',
    easing: 'easeOut',
  },
  fadeOut: {
    duration: 'normal',
    easing: 'easeIn',
  },
  slideInUp: {
    duration: 'normal',
    easing: 'easeOut',
  },
  slideInDown: {
    duration: 'normal',
    easing: 'easeOut',
  },
  slideInLeft: {
    duration: 'normal',
    easing: 'easeOut',
  },
  slideInRight: {
    duration: 'normal',
    easing: 'easeOut',
  },
  slideOutUp: {
    duration: 'normal',
    easing: 'easeIn',
  },
  slideOutDown: {
    duration: 'normal',
    easing: 'easeIn',
  },
  slideOutLeft: {
    duration: 'normal',
    easing: 'easeIn',
  },
  slideOutRight: {
    duration: 'normal',
    easing: 'easeIn',
  },
  scaleIn: {
    duration: 'normal',
    easing: 'easeOut',
  },
  scaleOut: {
    duration: 'normal',
    easing: 'easeIn',
  },
  bounce: {
    duration: 'slow',
    easing: 'bounce',
  },
  pulse: {
    duration: 'slow',
    easing: 'easeInOut',
    repeat: 'infinite',
    direction: 'alternate',
  },
  shake: {
    duration: 'fast',
    easing: 'easeInOut',
    repeat: 3,
  },
  spin: {
    duration: 'slow',
    easing: 'linear',
    repeat: 'infinite',
  },
  ping: {
    duration: 'slow',
    easing: 'easeOut',
    repeat: 'infinite',
  },
};

// Animation keyframes for web
export const webKeyframes = {
  fadeIn: `
    @keyframes omnisync-fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes omnisync-fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideInUp: `
    @keyframes omnisync-slideInUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideInDown: `
    @keyframes omnisync-slideInDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideInLeft: `
    @keyframes omnisync-slideInLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  slideInRight: `
    @keyframes omnisync-slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  slideOutUp: `
    @keyframes omnisync-slideOutUp {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-100%); opacity: 0; }
    }
  `,
  slideOutDown: `
    @keyframes omnisync-slideOutDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100%); opacity: 0; }
    }
  `,
  slideOutLeft: `
    @keyframes omnisync-slideOutLeft {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(-100%); opacity: 0; }
    }
  `,
  slideOutRight: `
    @keyframes omnisync-slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `,
  scaleIn: `
    @keyframes omnisync-scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
  scaleOut: `
    @keyframes omnisync-scaleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0); opacity: 0; }
    }
  `,
  bounce: `
    @keyframes omnisync-bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0, -30px, 0); }
      70% { transform: translate3d(0, -15px, 0); }
      90% { transform: translate3d(0, -4px, 0); }
    }
  `,
  pulse: `
    @keyframes omnisync-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  shake: `
    @keyframes omnisync-shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
  `,
  spin: `
    @keyframes omnisync-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  ping: `
    @keyframes omnisync-ping {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
  `,
};

// Generate CSS animation string for web
export const generateWebAnimation = (
  animationName: keyof PredefinedAnimations,
  config: AnimationConfig,
  tokens: DesignTokens
): string => {
  const duration = typeof config.duration === 'string' 
    ? tokens.animations.duration[config.duration] 
    : config.duration || tokens.animations.duration.normal;
  
  const easing = typeof config.easing === 'string' && tokens.animations.easing[config.easing]
    ? tokens.animations.easing[config.easing]
    : config.easing || tokens.animations.easing.easeOut;
  
  const delay = config.delay || 0;
  const repeat = config.repeat === 'infinite' ? 'infinite' : config.repeat || 1;
  const direction = config.direction || 'normal';
  const fillMode = config.fillMode || 'both';

  return `omnisync-${animationName} ${duration}ms ${easing} ${delay}ms ${repeat} ${direction} ${fillMode}`;
};

// React Native animation configurations
export const getNativeAnimationConfig = (
  animationName: keyof PredefinedAnimations,
  config: AnimationConfig,
  tokens: DesignTokens
) => {
  const duration = typeof config.duration === 'string' 
    ? tokens.animations.duration[config.duration] 
    : config.duration || tokens.animations.duration.normal;

  // Map web easing to React Native easing
  const easingMap: Record<string, any> = {
    linear: 'linear',
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
    bounce: 'bounce',
    spring: 'spring',
  };

  const easing = typeof config.easing === 'string' && easingMap[config.easing]
    ? easingMap[config.easing]
    : 'easeOut';

  return {
    duration,
    easing,
    delay: config.delay || 0,
    useNativeDriver: true,
  };
};

// Animation hook for cross-platform usage
export const useAnimation = () => {
  const isWeb = typeof window !== 'undefined';
  
  if (isWeb) {
    return {
      animate: (element: HTMLElement, animationName: keyof PredefinedAnimations, config: AnimationConfig = {}) => {
        // Web animation implementation
        const tokens = require('../tokens').defaultTokens;
        const animationString = generateWebAnimation(animationName, config, tokens);
        element.style.animation = animationString;
        
        return new Promise<void>((resolve) => {
          const handleAnimationEnd = () => {
            element.removeEventListener('animationend', handleAnimationEnd);
            resolve();
          };
          element.addEventListener('animationend', handleAnimationEnd);
        });
      },
    };
  } else {
    // React Native animation implementation
    const { Animated } = require('react-native');
    
    return {
      animate: (
        animatedValue: any,
        animationName: keyof PredefinedAnimations,
        config: AnimationConfig = {}
      ) => {
        const tokens = require('../tokens').defaultTokens;
        const nativeConfig = getNativeAnimationConfig(animationName, config, tokens);
        
        // Map animation names to React Native animations
        switch (animationName) {
          case 'fadeIn':
            return Animated.timing(animatedValue, {
              toValue: 1,
              ...nativeConfig,
            });
          case 'fadeOut':
            return Animated.timing(animatedValue, {
              toValue: 0,
              ...nativeConfig,
            });
          case 'scaleIn':
            return Animated.timing(animatedValue, {
              toValue: 1,
              ...nativeConfig,
            });
          case 'scaleOut':
            return Animated.timing(animatedValue, {
              toValue: 0,
              ...nativeConfig,
            });
          default:
            return Animated.timing(animatedValue, {
              toValue: 1,
              ...nativeConfig,
            });
        }
      },
    };
  }
};

// Inject CSS keyframes for web
export const injectAnimationStyles = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'omnisync-animations';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = Object.values(webKeyframes).join('\n');
  document.head.appendChild(style);
};

// Auto-inject styles on web
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAnimationStyles);
  } else {
    injectAnimationStyles();
  }
}
