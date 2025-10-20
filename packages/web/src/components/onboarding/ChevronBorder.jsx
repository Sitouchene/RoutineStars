import React from 'react';

const ChevronBorder = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Contour en chevron */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Coins supérieurs - Triangles rectangles remplis */}
        <div 
          className="absolute top-0 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] z-20"
          style={{ borderTopColor: 'var(--theme-primary)' }}
        ></div>
        
        <div 
          className="absolute top-0 right-0 w-0 h-0 border-r-[12px] border-r-transparent border-t-[12px] z-20"
          style={{ borderTopColor: 'var(--theme-secondary)' }}
        ></div>
        
        {/* Coins inférieurs - Angles sans remplissage (contours seulement) */}
        <div 
          className="absolute bottom-0 left-0 z-20"
          style={{
            width: '12px',
            height: '12px',
            borderLeft: '2px solid var(--theme-primary)',
            borderBottom: '2px solid var(--theme-primary)',
            borderTop: 'none',
            borderRight: 'none'
          }}
        ></div>
        
        <div 
          className="absolute bottom-0 right-0 z-20"
          style={{
            width: '12px',
            height: '12px',
            borderRight: '2px solid var(--theme-secondary)',
            borderBottom: '2px solid var(--theme-secondary)',
            borderTop: 'none',
            borderLeft: 'none'
          }}
        ></div>
      </div>
      
      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ChevronBorder;
