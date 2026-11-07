import React, { useState } from 'react';

export default function FlashcardEditor() {
  // --- State Management ---
  const [cards, setCards] = useState([
    { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces." },
    { id: 2, front: "What hook handles side effects?", back: "useEffect" }
  ]);
  
  const [frontInput, setFrontInput] = useState('');
  const [backInput, setBackInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- CRUD Actions ---
  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!frontInput.trim() || !backInput.trim()) return;

    if (editingId) {
      // Edit mode
      setCards(cards.map(card => 
        card.id === editingId ? { ...card, front: frontInput, back: backInput } : card
      ));
      setEditingId(null);
    } else {
      // Create mode
      const newCard = {
        id: Date.now(),
        front: frontInput,
        back: backInput
      };
      setCards([...cards, newCard]);
    }

    // Reset inputs
    setFrontInput('');
    setBackInput('');
  };

  const handleEditClick = (card) => {
    setEditingId(card.id);
    setFrontInput(card.front);
    setBackInput(card.back);
  };

  const handleDeleteCard = (id) => {
    const filteredCards = cards.filter(card => card.id !== id);
    setCards(filteredCards);
    
    // Adjust study index if out of bounds after deletion
    if (currentDeckIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentDeckIndex(filteredCards.length - 1);
    }
    setIsFlipped(false);
  };

  // --- Navigation for Study Deck ---
  const nextCard = () => {
    setIsFlipped(false);
    setCurrentDeckIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentDeckIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ React Flashcard Editor</h1>
        <p style={styles.subtitle}>Manage your deck and study seamlessly</p>
      </header>

      <div style={styles.gridLayout}>
        {/* LEFT COLUMN: Editor & List */}
        <div style={styles.column}>
          {/* Card Form */}
          <div style={styles.cardBox}>
            <h2 style={styles.sectionTitle}>
              {editingId ? '📝 Edit Flashcard' : '➕ Create New Flashcard'}
            </h2>
            <form onSubmit={handleSaveCard} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Front Side (Question / Concept)</label>
                <input 
                  type="text" 
                  value={frontInput}
                  onChange={(e) => setFrontInput(e.target.value)}
                  placeholder="e.g., UseState Hook"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Back Side (Answer / Definition)</label>
                <textarea 
                  value={backInput}
                  onChange={(e) => setBackInput(e.target.value)}
                  placeholder="e.g., A hook that lets you add state to functional components."
                  style={{...styles.input, ...styles.textarea}}
                  required
                />
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.primaryButton}>
                  {editingId ? 'Update Card' : 'Add to Deck'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFrontInput(''); setBackInput(''); }}
                    style={styles.cancelButton}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Card List Dashboard */}
          <div style={styles.cardBox}>
            <h2 style={styles.sectionTitle}>🗂️ Current Deck ({cards.length} cards)</h2>
            {cards.length === 0 ? (
              <p style={styles.emptyText}>Your deck is empty. Add a flashcard to get started!</p>
            ) : (
              <div style={styles.listContainer}>
                {cards.map((card) => (
                  <div key={card.id} style={styles.listItem}>
                    <div style={styles.listTextContent}>
                      <strong>Q:</strong> {card.front} <br />
                      <span style={styles.backSnippet}><strong>A:</strong> {card.back}</span>
                    </div>
                    <div style={styles.listActionButtons}>
                      <button onClick={() => handleEditClick(card)} style={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDeleteCard(card.id)} style={styles.deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Study & Preview Section */}
        <div style={styles.column}>
          <div style={styles.cardBox}>
            <h2 style={styles.sectionTitle}>🚀 Study Mode</h2>
            {cards.length === 0 ? (
              <p style={styles.emptyText}>Add cards to start studying.</p>
            ) : (
              <div>
                <p style={styles.progressText}>Card {currentDeckIndex + 1} of {cards.length}</p>
                
                {/* Interactive Flipping Card */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)} 
                  style={{
                    ...styles.flashcardContainer, 
                    backgroundColor: isFlipped ? '#f0fdf4' : '#f8fafc',
                    borderColor: isFlipped ? '#22c55e' : '#cbd5e1'
                  }}
                >
                  <span style={styles.cardSideBadge}>{isFlipped ? 'BACK' : 'FRONT'}</span>
                  <p style={styles.flashcardText}>
                    {isFlipped ? cards[currentDeckIndex].back : cards[currentDeckIndex].front}
                  </p>
                  <span style={styles.flipHint}>Click card to flip</span>
                </div>

                {/* Deck Navigation Controls */}
                <div style={styles.deckControls}>
                  <button onClick={prevCard} style={styles.navButton}>◀ Previous</button>
                  <button onClick={() => setIsFlipped(!isFlipped)} style={styles.flipButton}>🔄 Flip</button>
                  <button onClick={nextCard} style={styles.navButton}>Next ▶</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Inline CSS Styles System ---
const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif', color: '#1e293b' },
  header: { textAlign: 'center', marginBottom: '2.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem' },
  title: { fontSize: '2.5rem', color: '#0f172a', marginBottom: '0.5rem' },
  subtitle: { color: '#64748b', fontSize: '1.1rem' },
  gridLayout: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' },
  column: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  cardBox: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0' },
  sectionTitle: { fontSize: '1.35rem', marginBottom: '1.25rem', color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.875rem', fontWeight: '600', color: '#475569' },
  input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' },
  textarea: { minHeight: '80px', resize: 'vertical' },
  buttonGroup: { display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
  primaryButton: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  cancelButton: { backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  emptyText: { color: '#94a3b8', textAlign: 'center', padding: '2rem 0' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  listTextContent: { maxWidth: '75%', fontSize: '0.95rem' },
  backSnippet: { color: '#64748b', fontSize: '0.875rem' },
  listActionButtons: { display: 'flex', gap: '0.5rem' },
  editBtn: { backgroundColor: '#e2e8f0', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  deleteBtn: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  progressText: { textAlign: 'right', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '500' },
flashcardContainer: { height: '240px', border: '2px dashed', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', cursor: 'pointer', position: 'relative', textAlign: 'center', transition: 'all 0.2s ease' },
cardSideBadge: { position: 'absolute', top: '12px', left: '12px', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#e2e8f0', color: '#334155' },
flashcardText: { fontSize: '1.5rem', fontWeight: '500', margin: '0' },
flipHint: { position: 'absolute', bottom: '12px', fontSize: '0.75rem', color: '#94a3b8' },
deckControls: { display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' },
navButton: { flex: 1, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
flipButton: { flex: 1, backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};
