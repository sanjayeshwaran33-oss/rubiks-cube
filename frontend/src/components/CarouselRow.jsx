import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playClickSound } from '../services/sound';

export default function CarouselRow({ children, title, subtitle, id }) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    playClickSound();
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6; // Scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    checkScroll();
  };

  // Convert mouse wheel to horizontal scroll
  const handleWheel = (e) => {
    if (!containerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      containerRef.current.scrollLeft += e.deltaY * 0.8;
      checkScroll();
    }
  };

  return (
    <div id={id} style={{ position: 'relative', padding: '1.5rem 3.5rem', userSelect: 'none' }}>
      
      {/* Title & Subtitle */}
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '2rem',
              letterSpacing: '1.5px',
              margin: 0,
              color: '#ffffff'
            }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: '0.85rem', color: '#999', margin: '2px 0 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Quick Header Arrows */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: canScrollLeft ? 'rgba(40,40,40,0.8)' : 'rgba(25,25,25,0.4)',
                color: canScrollLeft ? '#fff' : '#555',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollLeft ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
              title="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: canScrollRight ? 'rgba(40,40,40,0.8)' : 'rgba(25,25,25,0.4)',
                color: canScrollRight ? '#fff' : '#555',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollRight ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
              title="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Relative wrapper for the slider and side paddles */}
      <div style={{ position: 'relative' }}>
        
        {/* Floating Left Paddle */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            style={{
              position: 'absolute',
              left: '-28px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '80px',
              borderRadius: '4px',
              backgroundColor: 'rgba(15, 15, 15, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 35,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.9)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229, 9, 20, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 15, 15, 0.85)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            title="Scroll Left"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Floating Right Paddle */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            style={{
              position: 'absolute',
              right: '-28px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '80px',
              borderRadius: '4px',
              backgroundColor: 'rgba(15, 15, 15, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 35,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.9)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229, 9, 20, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 15, 15, 0.85)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            title="Scroll Right"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Scrollable Container with Mouse Drag & Wheel */}
        <div
          ref={containerRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          style={{
            display: 'flex',
            gap: '1.2rem',
            overflowX: 'auto',
            overflowY: 'visible',
            padding: '1.8rem 0.5rem 2.2rem 0.5rem',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: '#333 transparent',
            cursor: isDragging ? 'grabbing' : 'grab',
            WebkitOverflowScrolling: 'touch'
          }}
          className="row-scroll-container"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
