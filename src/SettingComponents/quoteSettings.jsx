import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setQuotes } from '../store/quoteSlice';

export default function QuoteSettings() {
  const dispatch = useDispatch();
  const quotes = useSelector((state) => state.likedQuotes);
  const [draggedId, setDraggedId] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [currentTouchY, setCurrentTouchY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [itemHeight, setItemHeight] = useState(0);
  const [initialDragIndex, setInitialDragIndex] = useState(null);
  const dragHandleRefs = useRef({});
  const itemRefs = useRef({});
  const containerRef = useRef(null);

  // Helper function to recalculate orders for visible quotes
  const recalculateOrders = (quotesToUpdate) => {
    const visibleQuotes = quotesToUpdate.filter(q => q.isVisible);
    const nonVisibleQuotes = quotesToUpdate.filter(q => !q.isVisible);
    
    // Sort visible quotes by current order and reassign sequential orders
    visibleQuotes.sort((a, b) => a.order - b.order);
    const updatedVisibleQuotes = visibleQuotes.map((quote, index) => ({
      ...quote,
      order: index + 1
    }));
    
    // Ensure non-visible quotes have order 0
    const updatedNonVisibleQuotes = nonVisibleQuotes.map(quote => ({
      ...quote,
      order: 0
    }));
    
    return [...updatedVisibleQuotes, ...updatedNonVisibleQuotes];
  };

  // Count visible quotes
  const visibleCount = quotes.filter(q => q.isVisible).length;

  const handleToggle = (id) => {
    const updatedQuotes = quotes.map(quote => {
      if (quote.id === id) {
        // If trying to make visible but already at limit
        if (!quote.isVisible && visibleCount >= 5) {
          alert('최대 5개의 명언만 표시할 수 있습니다.');
          return quote;
        }
        
        return {
          ...quote,
          isVisible: !quote.isVisible,
          order: !quote.isVisible ? visibleCount + 1 : 0 // Assign next order or 0
        };
      }
      return quote;
    });

    const finalQuotes = recalculateOrders(updatedQuotes);
    dispatch(setQuotes(finalQuotes));
  };

  // Get sorted quotes with temporary positions for dragging
  const getSortedQuotes = () => {
    const visible = quotes.filter(q => q.isVisible).sort((a, b) => a.order - b.order);
    const nonVisible = quotes.filter(q => !q.isVisible);
    
    if (isDragging && draggedId && draggedOverIndex !== null) {
      const draggedIndex = visible.findIndex(q => q.id === draggedId);
      if (draggedIndex !== -1 && draggedOverIndex !== draggedIndex) {
        const reordered = [...visible];
        const [draggedItem] = reordered.splice(draggedIndex, 1);
        reordered.splice(draggedOverIndex, 0, draggedItem);
        return [...reordered, ...nonVisible];
      }
    }
    
    return [...visible, ...nonVisible];
  };

  const sortedQuotes = getSortedQuotes();

  // Touch handlers
  const handleTouchStart = (e, id) => {
    const touch = e.touches[0];
    const rect = itemRefs.current[id]?.getBoundingClientRect();
    if (rect) {
      setItemHeight(rect.height);
    }
    
    // Find the initial index of the dragged item
    const visibleQuotes = quotes.filter(q => q.isVisible).sort((a, b) => a.order - b.order);
    const dragIndex = visibleQuotes.findIndex(q => q.id === id);
    setInitialDragIndex(dragIndex);
    
    setTouchStartY(touch.clientY);
    setCurrentTouchY(touch.clientY);
    setDraggedId(id);
    setIsDragging(false);
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleTouchMove = (e, id) => {
    if (!draggedId || draggedId !== id) return;
    
    const touch = e.touches[0];
    setCurrentTouchY(touch.clientY);
    
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // Start dragging if moved more than 10px vertically
    if (deltaY > 10 && !isDragging) {
      setIsDragging(true);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
    
    if (isDragging && containerRef.current) {
      // Calculate which item we're over based on Y position
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeY = touch.clientY - containerRect.top;
      const visibleQuotes = quotes.filter(q => q.isVisible).sort((a, b) => a.order - b.order);
      
      // Find the index based on position
      let targetIndex = Math.floor(relativeY / (itemHeight + 8)); // 8px for margin
      targetIndex = Math.max(0, Math.min(targetIndex, visibleQuotes.length - 1));
      
      setDraggedOverIndex(targetIndex);
    }
  };

  const handleTouchEnd = (e) => {
    document.body.style.overflow = ''; // Restore body scroll
    
    if (!draggedId || !isDragging) {
      setDraggedId(null);
      setDraggedOverIndex(null);
      setIsDragging(false);
      setCurrentTouchY(0);
      return;
    }

    if (draggedOverIndex !== null) {
      // Perform the actual reorder
      const visibleQuotes = quotes.filter(q => q.isVisible).sort((a, b) => a.order - b.order);
      const draggedIndex = visibleQuotes.findIndex(q => q.id === draggedId);
      
      if (draggedIndex !== -1 && draggedOverIndex !== draggedIndex) {
        const reordered = [...visibleQuotes];
        const [draggedItem] = reordered.splice(draggedIndex, 1);
        reordered.splice(draggedOverIndex, 0, draggedItem);
        
        // Update all quotes with new orders
        const updatedQuotes = quotes.map(quote => {
          const newIndex = reordered.findIndex(q => q.id === quote.id);
          if (newIndex !== -1) {
            return { ...quote, order: newIndex + 1 };
          }
          return quote;
        });
        
        dispatch(setQuotes(updatedQuotes));
        
        // Haptic feedback for successful drop
        if (navigator.vibrate) {
          navigator.vibrate([50, 50, 50]);
        }
      }
    }

    setDraggedId(null);
    setDraggedOverIndex(null);
    setInitialDragIndex(null);
    setIsDragging(false);
    setCurrentTouchY(0);
  };

  // Setup non-passive touch event listeners on drag handles
  useEffect(() => {
    const handles = Object.values(dragHandleRefs.current).filter(Boolean);
    
    const preventDefaultTouch = (e) => {
      // Only prevent default if the event is cancelable
      if (isDragging && e.cancelable) {
        e.preventDefault();
      }
    };

    // Add non-passive listeners to each drag handle
    handles.forEach(handle => {
      handle.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    });

    // Also prevent document touchmove during drag
    if (isDragging) {
      document.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    }

    return () => {
      handles.forEach(handle => {
        if (handle) {
          handle.removeEventListener('touchmove', preventDefaultTouch);
        }
      });
      document.removeEventListener('touchmove', preventDefaultTouch);
    };
  }, [isDragging, sortedQuotes]);

  // Prevent scrolling and navbar issues during drag
  useEffect(() => {
    if (isDragging) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      
      // Prevent body scroll during drag
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      console.log('Dragging started, preventing body scroll and navbar interaction');
      
      // Prevent navbar interaction
      const navbar = document.querySelector('.navbar[fixed="bottom"], .navbar.fixed-bottom, nav.fixed-bottom');
      if (navbar) {
        navbar.style.pointerEvents = 'none';
        navbar.style.zIndex = '1';
      }
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      // Restore navbar
      const navbar = document.querySelector('.navbar[fixed="bottom"], .navbar.fixed-bottom, nav.fixed-bottom');
      if (navbar) {
        navbar.style.pointerEvents = '';
        navbar.style.zIndex = '';
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      const navbar = document.querySelector('.navbar[fixed="bottom"], .navbar.fixed-bottom, nav.fixed-bottom');
      if (navbar) {
        navbar.style.pointerEvents = '';
        navbar.style.zIndex = '';
      }
    };
  }, [isDragging]);

  return (
    <div className="relative min-h-screen overflow-y-auto">
      <h2 className="text-center text-xl font-semibold mt-4 text-ing-text">명언 설정</h2>
      <div className="max-w-xl mx-auto mt-4 pb-20 px-4">
        <p className="text-sm text-ing-text-muted mb-4">
          최대 5개의 명언을 선택할 수 있습니다. ({visibleCount}/5)
        </p>
        
        <div className="relative" ref={containerRef}>
          {sortedQuotes.map((quote, index) => {
            const isDraggedItem = draggedId === quote.id;
            const isVisible = quote.isVisible;
            
            // Calculate visual offset with position compensation
            let visualOffset = 0;
            if (isDraggedItem && isDragging) {
              const touchOffset = currentTouchY - touchStartY;
              
              // Find current position in sorted array
              const visibleQuotes = sortedQuotes.filter(q => q.isVisible);
              const currentVisualIndex = visibleQuotes.findIndex(q => q.id === draggedId);
              
              // Calculate position difference from initial position
              const positionDifference = (currentVisualIndex - initialDragIndex) * (itemHeight + 8); // 8px for margin
              
              // Compensate for the position change
              visualOffset = touchOffset - positionDifference;
            }
            
            return (
              <div
                key={quote.id}
                ref={el => itemRefs.current[quote.id] = el}
                data-quote-id={quote.id}
                className={`quote-container flex items-center justify-between border p-2 mb-2 rounded-lg transition-all ${
                  isDraggedItem && isDragging ? 'duration-0' : 'duration-300'
                } ${
                  isDraggedItem && isDragging ? 'shadow-2xl z-50 opacity-95' : ''
                } ${
                  isVisible ? 'bg-ing-bg-light border-ing-primary' : 'bg-ing-bg border-ing-border-muted'
                }`}
                style={{
                  transform: `translateY(${visualOffset}px)`,
                  maxHeight: '120px', // Restrict height for consistency
                }}
              >
                <div className="flex-1 mr-4 overflow-hidden">
                  <p className="text-sm font-medium line-clamp-2 text-ing-text">{quote.quote}</p>
                  {quote.author && <p className="text-xs text-ing-text-muted mt-1 truncate">- {quote.author}</p>}
                </div>
                
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleToggle(quote.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-ing-border-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ing-primary"></div>
                  </label>
                  
                  {isVisible && (
                    <div
                      ref={el => dragHandleRefs.current[quote.id] = el}
                      className="cursor-move px-3 py-3 border border-ing-border rounded-lg select-none transition-colors min-w-[50px] text-center bg-ing-bg hover:bg-ing-bg-dark active:bg-ing-bg-dark touch-none"
                      onTouchStart={(e) => handleTouchStart(e, quote.id)}
                      onTouchMove={(e) => handleTouchMove(e, quote.id)}
                      onTouchEnd={handleTouchEnd}
                      title="터치하고 드래그하여 순서 변경"
                    >
                      <span className="text-xl leading-none text-ing-text-muted">≡</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}