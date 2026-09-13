import React, { useEffect, useState } from 'react';

interface CursorFollowerProps {
  darkMode: boolean;
}

export const CursorFollower: React.FC<CursorFollowerProps> = ({ darkMode }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
        setIsHovering(!!interactive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Smooth lerp trailing animation for shadow follower
  useEffect(() => {
    let animationFrameId: number;

    const animateFollower = () => {
      setFollowerPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Smooth trailing ease factor
        const ease = 0.16;
        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease,
        };
      });
      animationFrameId = requestAnimationFrame(animateFollower);
    };

    animationFrameId = requestAnimationFrame(animateFollower);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Shadow / Glow Follower Orb */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 transition-transform ease-out will-change-transform"
        style={{
          transform: `translate3d(${followerPos.x - (isHovering ? 28 : 20)}px, ${
            followerPos.y - (isHovering ? 28 : 20)
          }px, 0)`,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      >
        <div
          className={`rounded-full transition-all duration-300 ${
            isHovering
              ? darkMode
                ? 'w-14 h-14 bg-[#38bdf8]/20 border border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-110'
                : 'w-14 h-14 bg-[#2563eb]/15 border border-[#2563eb] shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-110'
              : darkMode
              ? 'w-10 h-10 bg-[#bef264]/10 border border-[#bef264]/40 shadow-[0_0_16px_rgba(190,242,100,0.3)]'
              : 'w-10 h-10 bg-[#2563eb]/10 border border-[#2563eb]/30 shadow-[0_0_16px_rgba(37,99,235,0.25)]'
          } ${isClicking ? 'scale-90 opacity-70' : 'opacity-90'}`}
        />
      </div>

      {/* Center Precise Cursor Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 will-change-transform"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
        }}
      >
        <div
          className={`w-2 h-2 rounded-full transition-all duration-150 ${
            isHovering
              ? darkMode
                ? 'bg-[#38bdf8] scale-150 shadow-[0_0_8px_#38bdf8]'
                : 'bg-[#2563eb] scale-150 shadow-[0_0_8px_#2563eb]'
              : darkMode
              ? 'bg-[#bef264] shadow-[0_0_6px_#bef264]'
              : 'bg-[#1d4ed8] shadow-[0_0_6px_#1d4ed8]'
          } ${isClicking ? 'scale-75' : ''}`}
        />
      </div>
    </>
  );
};
