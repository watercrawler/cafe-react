import React from 'react';

const style = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  marginRight: 100,
};

const CafeInfo = ({ id }) => {
  return <ol id={id} style={style}></ol>;
};

export default CafeInfo;
