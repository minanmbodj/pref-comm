import React from 'react';

const Spacing = ({ height = '20px' }) => {
  return <div style={{ height, width: '100%' }} aria-hidden="true" />;
};

export default Spacing;