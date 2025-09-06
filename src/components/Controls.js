import React from 'react';

/**
 * Renders the control panel for the pathfinding visualizer.
 *
 * @param {Object} props - The component props.
 * @param {string} props.algorithm - The currently selected algorithm.
 * @param {Function} props.setAlgorithm - Function to set the algorithm.
 * @param {number} props.speed - The current animation speed.
 * @param {Function} props.setSpeed - Function to set the animation speed.
 * @param {string} props.wallType - The current drawing mode ('wall', 'start', 'end').
 * @param {Function} props.setWallType - Function to set the drawing mode.
 * @param {Function} props.onRun - Function to run the selected algorithm.
 * @param {Function} props.onReset - Function to reset the grid.
 * @param {Function} props.onClearWalls - Function to clear all walls from the grid.
 * @param {Function} props.onGenerateWalls - Function to generate random walls.
 * @param {Function} props.onGridSizeChange - Function to handle grid size changes.
 * @param {Function} props.onPauseResume - Function to pause or resume the algorithm animation.
 * @param {boolean} props.isRunning - A boolean indicating if an algorithm is currently running.
 * @param {boolean} props.isPaused - A boolean indicating if the animation is paused.
 * @param {boolean} props.isDarkMode - A boolean indicating if dark mode is enabled.
 * @param {Function} props.toggleDarkMode - Function to toggle dark mode.
 * @returns {React.Component} The controls component.
 */
const Controls = ({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  wallType,
  setWallType,
  onRun,
  onReset,
  onClearWalls,
  onGenerateWalls,
  onGridSizeChange,
  onPauseResume,
  isRunning,
  isPaused,
  isDarkMode,
  toggleDarkMode
}) => {
  const handleGridSizeChange = (event) => {
    const [rows, cols] = event.target.value.split('x').map(Number);
    onGridSizeChange(rows, cols);
  };

  return (
    <div className="controls">
      <div className="controls-row">
        <div className="control-group">
          <label>Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isRunning}
          >
            <option value="dijkstra">Dijkstra's</option>
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
            <option value="astar">A*</option>
            <option value="greedy">Greedy</option>

          </select>
        </div>



        <div className="control-group">
          <label>Speed:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isRunning}
          />
          <span>{speed}x</span>
        </div>

        <div className="control-group">
          <label>Grid Size:</label>
          <select
            onChange={handleGridSizeChange}
            disabled={isRunning}
            defaultValue="20x50"
          >
            <option value="15x30">15×30</option>
            <option value="20x50">20×50</option>
            <option value="25x60">25×60</option>
            <option value="30x80">30×80</option>
          </select>
        </div>

        <div className="control-group">
          <label>Draw Mode:</label>
          <select
            value={wallType}
            onChange={(e) => setWallType(e.target.value)}
            disabled={isRunning}
          >
            <option value="wall">Wall</option>
            <option value="start">Start</option>
            <option value="end">End</option>
          </select>
        </div>
      </div>

      <div className="controls-row">
        <div className="control-group">
          <button
            className="btn btn-primary"
            onClick={onRun}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Algorithm'}
          </button>

          {isRunning && (
            <>
              <button
                className="btn btn-secondary"
                onClick={onPauseResume}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              
              <button
                className="btn btn-danger"
                // onClick={onStop}
              >
                Stop
              </button>
            </>
          )}

          <button
            className="btn btn-success"
            onClick={onReset}
            disabled={isRunning}
          >
            Reset
          </button>

          <button
            className="btn btn-secondary"
            onClick={onClearWalls}
            disabled={isRunning}
          >
            Clear Walls
          </button>

          <button
            className="btn btn-secondary"
            onClick={onGenerateWalls}
            disabled={isRunning}
          >
            Random Walls
          </button>

          <button
            className={`btn ${isDarkMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={toggleDarkMode}
            style={{ marginLeft: 'auto' }}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#48bb78' }}></div>
          <span>Start</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f56565' }}></div>
          <span>End</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#2d3748' }}></div>
          <span>Wall</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#90cdf4' }}></div>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f6e05e' }}></div>
          <span>Path</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ed8936' }}></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default Controls; 