import React from 'react';
import Cell from './Cell';

const Grid = ({ grid, onMouseDown, onMouseEnter, onMouseUp }) => {
  if (!grid || grid.length === 0) {
    return <div>Loading grid...</div>;
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${grid[0].length}, 25px)`,
    gridTemplateRows: `repeat(${grid.length}, 25px)`
  };

  return (
    <div className="grid-container">
      <div className="grid" style={gridStyle}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onMouseDown={() => onMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
              onMouseUp={onMouseUp}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid; 