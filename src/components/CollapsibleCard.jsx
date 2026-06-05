import React from 'react';
import { globalStyles } from './theme';

const CollapsibleCard = ({ title, children, isOpen, setIsOpen }) => {
  return (
    <div style={globalStyles.section}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          cursor: 'pointer', borderBottom: isOpen ? '1px solid black' : 'none',
          paddingBottom: isOpen ? '10px' : '0px', userSelect: 'none'
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{isOpen ? '▲ Contraer' : '▼ Expandir'}</span>
      </div>
      {isOpen && ( <div style={{ marginTop: '15px' }}>{children}</div> )}
    </div>
  );
};

export default CollapsibleCard;