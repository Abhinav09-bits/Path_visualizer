import React from 'react';
import Cell from './Cell';

/**
 * Renders the grid of cells.
 *
 * @param {Object} props - The component props.
 * @param {Array<Array<Object>>} props.grid - The 2D array representing the grid.
 * @param {Function} props.onMouseDown - Function to handle mouse down events on a cell.
 * @param {Function} props.onMouseEnter - Function to handle mouse enter events on a cell.
 * @param {Function} props.onMouseUp - Function to handle mouse up events.
 * @returns {React.Component} The grid component.
 */
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