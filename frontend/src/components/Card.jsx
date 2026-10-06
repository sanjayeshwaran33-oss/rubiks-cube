import React, { useState } from 'react';
import { Play, Plus, Check, ThumbsUp, ChevronDown, Trophy, Clock, Users, Edit3 } from 'lucide-react';
import { playClickSound, playHoverSound } from '../services/sound';

export default function Card({ 
  item, 
  onSelect, 
  onToggleMyList, 
  isMyList = false, 
  rank = null,
  onQuickRegister,
  isEditMode = false,
  onEdit
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 80) + 120);

  const handleLike = (e) => {
    e.stopPropagation();
    playClickSound();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleListToggle = (e) => {
    e.stopPropagation();
    playClickSound();
    onToggleMyList(item);
  };

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    playClickSound();
    if (onQuickRegister) onQuickRegister(item);
    else onSelect(item);
  };

  return (
    <div 
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        flexShrink: 0,
        marginRight: rank ? '2rem' : '0.5rem',
        paddingLeft: rank ? '2.5rem' : '0'
      }}
    >
      {/* Giant Top 10 Outline Number if ranked */}
      {rank && (
        <span 
          className="netflix-rank-number"
          style={{
            left: rank === 1 ? '-20px' : '-28px',
            fontSize: '9.5rem',
            letterSpacing: '-12px'
          }}
        >
          {rank}
        </span>
      )}

      {/* Main Movie / Arena Card */}
      <div
        onMouseEnter={() => {
          playHoverSound();
          setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          playClickSound();
          onSelect(item);
        }}
        style={{
          position: 'relative',
          width: rank ? '220px' : '260px',
          height: rank ? '320px' : '370px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#1f1f1f',
          cursor: 'pointer',
          transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          transform: isHovered ? 'scale(1.12) translateY(-8px)' : 'scale(1)',
          zIndex: isHovered ? 30 : 2,
          boxShadow: isHovered 
            ? `0 20px 35px rgba(0, 0, 0, 0.95), 0 0 20px ${item.themeColor || 'rgba(229, 9, 20, 0.6)'}` 
            : '0 6px 16px rgba(0,0,0,0.6)',
          border: isHovered ? `1px solid ${item.themeColor || 'rgba(229, 9, 20, 0.6)'}` : '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {/* Poster Image */}
        <img
          src={item.poster || '/assets/poster-brainiac.jpg'}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
          loading="lazy"
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 4
        }}>
          {item.theme && (
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.85)',
              color: item.themeColor || '#fff',
              border: `1px solid ${item.themeColor || '#E50914'}`,
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '2px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: `0 0 10px ${item.themeColor ? item.themeColor + '66' : 'rgba(229,9,20,0.4)'}`
            }}>
              {item.theme}
            </span>
          )}
          {item.isTop10 && (
            <span style={{
              backgroundColor: '#E50914',
              color: '#fff',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '2px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              boxShadow: '0 2px 6px rgba(0,0,0,0.6)'
            }}>
              TOP 5
            </span>
          )}
          {item.isOriginal && (
            <span style={{
              backgroundColor: 'rgba(0,0,0,0.75)',
              color: '#fff',
              border: '1px solid rgba(229, 9, 20, 0.5)',
              fontSize: '0.58rem',
              fontWeight: 700,
              padding: '2px 5px',
              borderRadius: '2px',
              backdropFilter: 'blur(4px)'
            }}>
              N ORIGINAL
            </span>
          )}
        </div>

        {/* Live Edit Button Overlay */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              onEdit(item);
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 15,
              backgroundColor: isEditMode ? '#E50914' : 'rgba(0,0,0,0.75)',
              border: isEditMode ? '1px solid #ff3333' : '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: isEditMode || isHovered ? 'flex' : 'none',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              boxShadow: isEditMode ? '0 0 10px rgba(229,9,20,0.8)' : '0 2px 6px rgba(0,0,0,0.8)',
              transition: 'all 0.2s ease'
            }}
            title="Edit arena details directly on the website"
          >
            <Edit3 size={13} color="#fff" />
            <span>Edit</span>
          </button>
        )}

        {/* Ambient Gradient Vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isHovered 
            ? 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 40%, rgba(18,18,18,0.96) 80%, #141414 100%)'
            : 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 85%, #141414 100%)',
          transition: 'all 0.3s ease',
          zIndex: 3
        }} />

        {/* Card Title & Content Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* Title */}
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.45rem',
            color: '#fff',
            letterSpacing: '1px',
            lineHeight: 1.05,
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            margin: 0
          }}>
            {item.title}
          </h3>

          {/* Tagline / Subtitle */}
          <p style={{
            fontSize: '0.72rem',
            color: '#ccc',
            lineHeight: 1.2,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: isHovered ? 2 : 1,
            WebkitBoxOrient: 'vertical'
          }}>
            {item.tagline || item.description}
          </p>

          {/* Hover Revealed Actions & Details */}
          {isHovered && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '4px',
              animation: 'fadeIn 0.2s ease-in'
            }}>
              {/* Quick Actions Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Play / Register */}
                  <button
                    onClick={handleRegisterClick}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      color: '#000',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(255,255,255,0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                    title="Register / Enter Arena"
                  >
                    <Play size={16} fill="#000" />
                  </button>

                  {/* Add to My List */}
                  <button
                    onClick={handleListToggle}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isMyList ? '#E50914' : 'rgba(42,42,42,0.8)',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title={isMyList ? "Remove from My List" : "Add to My List"}
                  >
                    {isMyList ? <Check size={16} /> : <Plus size={16} />}
                  </button>

                  {/* Thumbs Up Like */}
                  <button
                    onClick={handleLike}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: liked ? 'rgba(70, 211, 105, 0.2)' : 'rgba(42,42,42,0.8)',
                      color: liked ? '#46d369' : '#fff',
                      border: liked ? '2px solid #46d369' : '2px solid rgba(255,255,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="Like this Arena"
                  >
                    <ThumbsUp size={15} fill={liked ? '#46d369' : 'none'} />
                  </button>
                </div>

                {/* More Info Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onSelect(item);
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(42,42,42,0.8)',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Expand Arena Details"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Metadata Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#46d369', fontWeight: 800 }}>
                  {item.matchScore || 98}% Match
                </span>
                <span style={{ 
                  border: '1px solid rgba(255,255,255,0.4)', 
                  padding: '1px 4px', 
                  borderRadius: '2px',
                  color: '#ddd',
                  fontSize: '0.65rem'
                }}>
                  {item.ageRating || 'U/A 16+'}
                </span>
                <span style={{ color: '#aaa', fontSize: '0.68rem' }}>
                  {item.duration || '90m'}
                </span>
                <span style={{ 
                  border: '1px solid rgba(255,255,255,0.3)', 
                  padding: '1px 3px', 
                  borderRadius: '2px',
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: 700
                }}>
                  HD
                </span>
              </div>

              {/* Tags / Category */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                <span style={{ color: '#e50914', fontSize: '0.65rem', fontWeight: 700 }}>
                  {item.category}
                </span>
                {item.prizePool && (
                  <span style={{ color: '#ffd700', fontSize: '0.65rem', fontWeight: 600 }}>
                    • {item.prizePool.split(' ')[0]} Prize
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
