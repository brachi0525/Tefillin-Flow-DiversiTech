import React, { useEffect, useRef, useState } from 'react';

export type AnimationType = 
  | 'fadeIn' 
  | 'fadeInSlow' 
  | 'fadeInFast'
  | 'slideUp' 
  | 'slideUpSlow' 
  | 'slideUpFast'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'bounce'
  | 'pulse'
  | 'spin';

export type DelayType = 
  | 'delay-75'
  | 'delay-100'
  | 'delay-150'
  | 'delay-200'
  | 'delay-300'
  | 'delay-500'
  | 'delay-700'
  | 'delay-1000';


interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation: AnimationType;
  delay?: DelayType;
  duration?: string; 
  triggerOnScroll?: boolean; 
  threshold?: number; 
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animation,
  delay,
  duration,
  triggerOnScroll = false,
  threshold = 0.1,
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerOnScroll || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [triggerOnScroll, threshold]);

  
  const animationClasses = [
    isVisible && `animate-${animation}`,
    delay && isVisible && delay,
    !isVisible && triggerOnScroll && 'opacity-0', 
    className
  ].filter(Boolean).join(' ');

  
  const customStyle = duration 
    ? { ...style, animationDuration: duration }
    : style;

  return (
    <div 
      ref={elementRef}
      className={animationClasses}
      style={customStyle}
    >
      {children}
    </div>
  );
};

export default AnimatedWrapper;