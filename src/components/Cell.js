import React from 'react';

const Cell = ({ cell, onMouseDown, onMouseEnter, onMouseUp }) => {
  const getCellClasses = () => {
    const classes = ['cell'];
    
    if (cell.isWall) classes.push('wall');
    if (cell.isStart) classes.push('start');
    if (cell.isEnd) classes.push('end');
    if (cell.isVisited) classes.push('visited');
    if (cell.isPath) classes.push('path');
    if (cell.isFrontier) classes.push('frontier');
    if (cell.isCurrent) classes.push('current');
    
    return classes.join(' ');
  };

  const getCellContent = () => {
    if (cell.isStart) return 'S';
    if (cell.isEnd) return 'E';
    if (cell.isWall) return 'W';
    if (cell.isPath) return '●';
    if (cell.isCurrent) return '★';
    if (cell.isVisited) return '·';
    return '';
  };

  return (
    <div
      className={getCellClasses()}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
      title={`Row: ${cell.row}, Col: ${cell.col}`}
    >
      {getCellContent()}
    </div>
  );
};

export default Cell; 