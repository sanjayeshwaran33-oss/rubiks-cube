import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  Check, 
  AlertCircle,
  Sparkles,
  Palette
} from 'lucide-react';
import { playClickSound, playTaDum } from '../services/sound';

export default function LiveEditorModal({ 
  arena, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  onResetDefaults,
  onExportJSON,
  onImportJSON
}) {
  if (!isOpen || !arena) return null;

  const [formData, setFormData] = useState({
    title: arena.title || '',
    theme: arena.theme || '',
    franchise: arena.franchise || '',
    category: arena.category || 'Coding & Tech',
    tagline: arena.tagline || '',
    quote: arena.quote || '',
    description: arena.description || '',
    timing: arena.timing || '',
    venue: arena.venue || '',
    teamSize: arena.teamSize || '',
    prizePool: arena.prizePool || '',
    themeColor: arena.themeColor || '#E50914',
    poster: arena.poster || '/assets/poster-wednesday.jpg',
    rules: Array.isArray(arena.rules) ? [...arena.rules] : [],
    coordinators: Array.isArray(arena.coordinators) ? [...arena.coordinators] : []
  });

  const [activeTab, setActiveTab] = useState('details');
  const [newRule, setNewRule] = useState('');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    playTaDum();
    onSave(arena._id, formData);
    showToast('✓ Arena updated live on website!');
    setTimeout(() => onClose(), 800);
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    playClickSound();
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, newRule.trim()]
    }));
    setNewRule('');
  };

  const handleRemoveRule = (index) => {
    playClickSound();
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, idx) => idx !== index)
    }));
  };

  const handleCoordinatorChange = (index, field, value) => {
    const updated = [...formData.coordinators];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, coordinators: updated }));
  };

  const handleAddCoordinator = () => {
    playClickSound();
    setFormData(prev => ({
      ...prev,
      coordinators: [...prev.coordinators, { name: 'New Coordinator', role: 'Student Lead', phone: '+91 99999 00000' }]
    }));
  };

  const handleRemoveCoordinator = (index) => {
    playClickSound();
    setFormData(prev => ({
      ...prev,
      coordinators: prev.coordinators.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '850px',
        backgroundColor: '#161616',
        borderRadius: '10px',
        border: `1px solid ${formData.themeColor || '#E50914'}`,
        boxShadow: `0 25px 60px rgba(0,0,0,0.95), 0 0 30px ${formData.themeColor}33`,
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Toast alert */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#46d369',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.85rem',
            padding: '6px 18px',
            borderRadius: '20px',
            zIndex: 110,
            boxShadow: '0 4px 15px rgba(0,0,0,0.8)'
          }}>
            {toastMessage}
          </div>
        )}

        {/* Modal Header */}
        <div style={{
          padding: '1.2rem 1.8rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1a1a1a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              backgroundColor: formData.themeColor,
              color: '#000',
              fontWeight: 900,
              fontSize: '0.8rem',
              padding: '2px 8px',
              borderRadius: '3px'
            }}>
              LIVE CMS
            </span>
            <h3 style={{
              fontSize: '1.4rem',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '1px',
              margin: 0,
              color: '#fff'
            }}>
              EDIT ARENA: {formData.title || 'Untitled'}
            </h3>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Tabs inside Editor */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0.6rem 1.8rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#141414'
        }}>
          {[
            { id: 'details', label: 'Basic Details' },
            { id: 'logistics', label: 'Venue & Prizes' },
            { id: 'rules', label: `Rules (${formData.rules.length})` },
            { id: 'coordinators', label: `Coordinators (${formData.coordinators.length})` },
            { id: 'backup', label: 'Sync & Backup' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 4px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: activeTab === tab.id ? '#ffffff' : '#777',
                borderBottom: activeTab === tab.id ? `2px solid ${formData.themeColor}` : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Form Body */}
        <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'details' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Arena Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Show Theme Franchise</label>
                  <input
                    type="text"
                    value={formData.theme}
                    placeholder="e.g. Wednesday, Arcane, Money Heist..."
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  >
                    <option value="Coding & Tech">Coding & Tech</option>
                    <option value="Research & Demo">Research & Demo</option>
                    <option value="Quiz & Logic">Quiz & Logic</option>
                    <option value="Ads & Treasure Hunt">Ads & Treasure Hunt</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Theme Accent Color (Hex)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={formData.themeColor}
                      onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      style={{ width: '42px', height: '42px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'none' }}
                    />
                    <input
                      type="text"
                      value={formData.themeColor}
                      onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      style={{ flex: 1, padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Punchy Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Character Quote</label>
                <input
                  type="text"
                  value={formData.quote}
                  placeholder='e.g. "I find social algorithms repulsive..."'
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Full Synopsis Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff', lineHeight: 1.4 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Poster Image URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    style={{ flex: 1, padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                  {/* Preset Quick Selectors */}
                  <select
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    style={{ padding: '0.75rem', backgroundColor: '#333', border: '1px solid #555', borderRadius: '4px', color: '#fff' }}
                  >
                    <option value="">Preset Posters</option>
                    <option value="/assets/poster-wednesday.jpg">Wednesday (Paper Spark)</option>
                    <option value="/assets/poster-arcane.jpg">Arcane (Brainiac's Battle)</option>
                    <option value="/assets/poster-moneyheist.jpg">Money Heist (Techno Connect)</option>
                    <option value="/assets/poster-blackmirror.jpg">Black Mirror (Techno Ads)</option>
                    <option value="/assets/poster-witcher.jpg">The Witcher (Techno Treasure)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LOGISTICS & PRIZES */}
          {activeTab === 'logistics' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Date & Timing</label>
                  <input
                    type="text"
                    value={formData.timing}
                    placeholder="24 Oct 2026 • 10:00 AM — 11:30 AM"
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Venue Location</label>
                  <input
                    type="text"
                    value={formData.venue}
                    placeholder="Seminar Hall 1 (Admin Block 2nd Floor)"
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Squad / Team Size</label>
                  <input
                    type="text"
                    value={formData.teamSize}
                    placeholder="1 to 3 Members"
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Cash Prize Pool</label>
                  <input
                    type="text"
                    value={formData.prizePool}
                    placeholder="₹15,000 Total (₹10,000 Winner + ₹5,000 Runner Up)"
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* TAB 3: RULES & GUIDELINES */}
          {activeTab === 'rules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Type a new rule or competition specification..."
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRule(); } }}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="btn-red"
                  style={{ padding: '0.75rem 1.4rem' }}
                >
                  <Plus size={16} /> Add Rule
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
                {formData.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#202020',
                      padding: '0.75rem 1rem',
                      borderRadius: '4px',
                      border: '1px solid #333'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', color: '#ddd' }}>{idx + 1}. {rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COORDINATORS */}
          {activeTab === 'coordinators' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#bbb' }}>Faculty & Student Showrunners</span>
                <button
                  type="button"
                  onClick={handleAddCoordinator}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}
                >
                  <Plus size={15} /> Add Lead
                </button>
              </div>

              {formData.coordinators.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#202020',
                    border: '1px solid #333',
                    padding: '1rem',
                    borderRadius: '6px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: '8px',
                    alignItems: 'center'
                  }}
                >
                  <input
                    type="text"
                    value={c.name}
                    placeholder="Full Name"
                    onChange={(e) => handleCoordinatorChange(idx, 'name', e.target.value)}
                    style={{ padding: '0.5rem', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    value={c.role}
                    placeholder="Role (e.g. Student Lead)"
                    onChange={(e) => handleCoordinatorChange(idx, 'role', e.target.value)}
                    style={{ padding: '0.5rem', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    value={c.phone}
                    placeholder="Phone (+91...)"
                    onChange={(e) => handleCoordinatorChange(idx, 'phone', e.target.value)}
                    style={{ padding: '0.5rem', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCoordinator(idx)}
                    style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SYNC & BACKUP */}
          {activeTab === 'backup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '6px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Export / Download Backup</h4>
                <p style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '10px' }}>
                  Download the full symposium configuration JSON file to save all live edits permanently or transfer to another device.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    const dataStr = onExportJSON();
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `orkestrim_config_${Date.now()}.json`;
                    link.click();
                    showToast('✓ Backup downloaded successfully!');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
                >
                  <Download size={16} /> Download JSON Backup
                </button>
              </div>

              <div style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '6px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Import JSON Config</h4>
                <p style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '8px' }}>
                  Paste a JSON payload to update all arenas and schedules in 1 click across the entire web app.
                </p>
                <textarea
                  rows="3"
                  placeholder='Paste JSON array here...'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: '#181818', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (!jsonInput) return;
                    try {
                      onImportJSON(jsonInput);
                      showToast('✓ Successfully imported JSON config!');
                      onClose();
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem', marginTop: '8px' }}
                >
                  <Upload size={16} /> Load & Apply JSON
                </button>
              </div>

              <div style={{ backgroundColor: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', padding: '1rem', borderRadius: '6px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E50914', marginBottom: '6px' }}>Reset to Factory Presets</h4>
                <p style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '10px' }}>
                  Revert all arenas, rules, posters, and cash prizes back to the original symposium defaults.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (window.confirm('Are you sure you want to revert all changes to default?')) {
                      onResetDefaults();
                      showToast('✓ Reverted to default symposium presets.');
                      onClose();
                    }
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #ff4d4f',
                    color: '#ff4d4f',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={16} /> Revert to Factory Presets
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                if (window.confirm(`Delete arena "${formData.title}" from the website?`)) {
                  onDelete(arena._id);
                  onClose();
                }
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ff4d4f',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trash2 size={16} /> Delete Arena
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-red"
                style={{ padding: '0.65rem 1.8rem', fontSize: '0.88rem' }}
              >
                <Save size={16} /> Save Changes Live
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
