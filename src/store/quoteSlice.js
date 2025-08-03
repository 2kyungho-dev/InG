import { createSlice } from '@reduxjs/toolkit';

// Helper to load likedQuotes from localStorage
const loadQuotesState = () => {
  try {
    const serialized = localStorage.getItem('InGState');
    if (!serialized) return [];
    const fullState = JSON.parse(serialized);
    return fullState.likedQuotes || [];
  } catch (e) {
    console.warn("Failed to load likedQuotes from localStorage:", e);
    return [];
  }
};

const initialState = loadQuotesState();

const quoteSlice = createSlice({
  name: 'likedQuotes',
  initialState,
  reducers: {
    addQuote: (state, action) => {
      const newQuote = action.payload;
      
      // Validate the quote object
      if (!newQuote || (!newQuote.text && !newQuote.quote)) {
        console.warn("Invalid quote object provided");
        return;
      }

      // Normalize quote text (use 'text' or 'quote' field)
      const quoteText = newQuote.text || newQuote.quote;
      
      // Check if quote already exists (by id or text)
      const exists = state.some(q => {
        const existingText = q.text || q.quote;
        return (
          (q.id && newQuote.id && q.id === newQuote.id) ||
          (existingText === quoteText)
        );
      });

      if (!exists) {
        // Ensure consistent structure
        const normalizedQuote = {
          id: newQuote.id || `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: quoteText,
          author: newQuote.author || "Unknown",
          translation: newQuote.translation || null,
          dateAdded: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          ...newQuote // Include any additional fields
        };
        
        state.push(normalizedQuote);

        // Optional: Limit the number of liked quotes (e.g., max 50)
        if (state.length > 50) {
          return state.slice(-50);
        }
      }
    },

    removeQuote: (state, action) => {
      const targetQuote = action.payload;
      
      if (!targetQuote) {
        console.warn("No quote provided for removal");
        return state;
      }

      let filteredState = state;

      // Try to find by id first
      if (targetQuote.id) {
        filteredState = filteredState.filter(q => q.id !== targetQuote.id);
      } else {
        // If no id, try by text
        const targetText = targetQuote.text || targetQuote.quote;
        if (targetText) {
          filteredState = filteredState.filter(q => {
            const existingText = q.text || q.quote;
            return existingText !== targetText;
          });
        } else {
          console.warn("Quote not found for removal");
        }
      }

      return filteredState;
    },

    removeQuoteByIndex: (state, action) => {
      const index = action.payload;
      if (typeof index === 'number' && index >= 0 && index < state.length) {
        state.splice(index, 1);
      } else {
        console.warn("Invalid index provided for quote removal");
      }
    },

    setQuotes: (state, action) => {
      // Replace all likedQuotes with validation
      const newQuotes = Array.isArray(action.payload) ? action.payload : [];
      
      // Validate and normalize all quotes
      return newQuotes
        .filter(quote => quote && (quote.text || quote.quote)) // Filter out invalid quotes
        .map(quote => ({
          id: quote.id || `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: quote.text || quote.quote,
          author: quote.author || "Unknown",
          translation: quote.translation || null,
          dateAdded: quote.dateAdded || new Date().toISOString().split('T')[0],
          ...quote
        }));
    },

    clearAllQuotes: () => {
      return [];
    },

    toggleQuote: (state, action) => {
      const targetQuote = action.payload;
      
      if (!targetQuote || (!targetQuote.text && !targetQuote.quote)) {
        console.warn("Invalid quote object provided for toggle");
        return state;
      }

      const quoteText = targetQuote.text || targetQuote.quote;
      
      // Check if quote exists
      const existingIndex = state.findIndex(q => {
        const existingText = q.text || q.quote;
        return (
          (q.id && targetQuote.id && q.id === targetQuote.id) ||
          (existingText === quoteText)
        );
      });

      if (existingIndex !== -1) {
        // Remove if exists
        state.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        const normalizedQuote = {
          id: targetQuote.id || `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: quoteText,
          author: targetQuote.author || "Unknown",
          translation: targetQuote.translation || null,
          dateAdded: new Date().toISOString().split('T')[0],
          ...targetQuote
        };
        
        state.push(normalizedQuote);

        // Optional: Limit the number of liked quotes
        if (state.length > 50) {
          return state.slice(-50);
        }
      }
    }
  },
});

export const { 
  addQuote, 
  removeQuote, 
  removeQuoteByIndex, 
  setQuotes, 
  clearAllQuotes, 
  toggleQuote 
} = quoteSlice.actions;

export default quoteSlice.reducer;