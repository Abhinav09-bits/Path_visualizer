import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Stats from './components/Stats';
import { 
  dijkstra, 
  bfs, 
  dfs, 
  astar,
  greedy,
  createGridWithWalls, 
  generateRandomWalls,
  clearGrid,
  findStart,
  findEnd
} from './algorithms';

/**
 * The main application component.
 * It manages the state and logic for the grid, algorithms, and user interactions.
 * @returns {React.Component} The main App component.
 */
const App = () => {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({ row: 10, col: 15 });
  const [end, setEnd] = useState({ row: 10, col: 35 });
  const [algorithm, setAlgorithm] = useState('dijkstra');

  const [speed, setSpeed] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [wallType, setWallType] = useState('wall'); // 'wall', 'start', 'end'
  const [stats, setStats] = useState({
    visitedNodes: 0,
    pathLength: 0,
    executionTime: 0,
    algorithm: ''
  });
  const [isGridReady, setIsGridReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  /**
   * Initializes the grid with a default size and sets the start and end points.
   */
  const initializeGrid = useCallback(() => {
    const newGrid = createGridWithWalls(20, 50);
    newGrid[start.row][start.col].isStart = true;
    newGrid[end.row][end.col].isEnd = true;
    setGrid(newGrid);
    setIsGridReady(true);
  }, [start, end]);

  /**
   * Resets the grid to its initial state, clearing paths and statistics.
   */
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setShouldStop(false);
    if (grid && grid.length > 0) {
      const newGrid = clearGrid(grid);
      setGrid(newGrid);
    }
    setStats({
      visitedNodes: 0,
      pathLength: 0,
      executionTime: 0,
      algorithm: ''
    });
  }, [grid]);

  /**
   * Clears all walls from the grid.
   */
  const handleClearWalls = useCallback(() => {
    if (!grid || grid.length === 0) return;
    const newGrid = grid.map(row =>
      row.map(cell => ({ ...cell, isWall: false }))
    );
    setGrid(newGrid);
  }, [grid]);

  /**
   * Generates a new random set of walls on the grid.
   */
  const handleGenerateWalls = useCallback(() => {
    if (!grid || grid.length === 0) return;
    const newGrid = generateRandomWalls(grid, 0.3);
    setGrid(newGrid);
  }, [grid]);

  /**
   * Handles changes to the grid size, creating a new grid and resetting the state.
   * @param {number} rows - The new number of rows.
   * @param {number} cols - The new number of columns.
   */
  const handleGridSizeChange = useCallback((rows, cols) => {
    const newGrid = createGridWithWalls(rows, cols);
    const newStart = { row: Math.floor(rows / 2), col: Math.floor(cols / 4) };
    const newEnd = { row: Math.floor(rows / 2), col: Math.floor(3 * cols / 4) };
    
    newGrid[newStart.row][newStart.col].isStart = true;
    newGrid[newEnd.row][newEnd.col].isEnd = true;
    
    setStart(newStart);
    setEnd(newEnd);
    setGrid(newGrid);
    setIsGridReady(true);
    handleReset();
  }, [handleReset]);

  /**
   * Handles the mouse down event on a cell, initiating drawing or moving start/end points.
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   */
  const handleMouseDown = useCallback((row, col) => {
    if (isRunning || !grid || grid.length === 0) return;
    
    setMouseIsPressed(true);
    if (wallType === 'start') {
      handleStartChange(row, col);
    } else if (wallType === 'end') {
      handleEndChange(row, col);
    } else {
      handleWallToggle(row, col);
    }
  }, [isRunning, wallType, grid]);

  /**
   * Handles the mouse enter event on a cell, continuing the drawing action.
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   */
  const handleMouseEnter = useCallback((row, col) => {
    if (!mouseIsPressed || isRunning || !grid || grid.length === 0) return;
    
    if (wallType === 'start') {
      handleStartChange(row, col);
    } else if (wallType === 'end') {
      handleEndChange(row, col);
    } else {
      handleWallToggle(row, col);
    }
  }, [mouseIsPressed, isRunning, wallType, grid]);

  /**
   * Handles the mouse up event, ending the drawing action.
   */
  const handleMouseUp = useCallback(() => {
    setMouseIsPressed(false);
  }, []);

  /**
   * Toggles a cell's wall state.
   * @param {number} row - The row of the cell.
   * @param {number} col - The column of the cell.
   */
  const handleWallToggle = useCallback((row, col) => {
    if (!grid || !grid[row] || !grid[row][col] || grid[row][col].isStart || grid[row][col].isEnd) return;
    
    const newGrid = grid.map((gridRow, i) =>
      gridRow.map((cell, j) =>
        i === row && j === col ? { ...cell, isWall: !cell.isWall } : cell
      )
    );
    setGrid(newGrid);
  }, [grid]);

  /**
   * Changes the position of the start node.
   * @param {number} row - The new row for the start node.
   * @param {number} col - The new column for the start node.
   */
  const handleStartChange = useCallback((row, col) => {
    if (!grid || !grid[row] || !grid[row][col] || grid[row][col].isEnd || grid[row][col].isWall) return;
    
    const newGrid = grid.map((gridRow, i) =>
      gridRow.map((cell, j) => ({
        ...cell,
        isStart: i === row && j === col
      }))
    );
    
    setGrid(newGrid);
    setStart({ row, col });
  }, [grid]);

  /**
   * Changes the position of the end node.
   * @param {number} row - The new row for the end node.
   * @param {number} col - The new column for the end node.
   */
  const handleEndChange = useCallback((row, col) => {
    if (!grid || !grid[row] || !grid[row][col] || grid[row][col].isStart || grid[row][col].isWall) return;
    
    const newGrid = grid.map((gridRow, i) =>
      gridRow.map((cell, j) => ({
        ...cell,
        isEnd: i === row && j === col
      }))
    );
    
    setGrid(newGrid);
    setEnd({ row, col });
  }, [grid]);

  /**
   * Runs the selected pathfinding algorithm and updates the state with the results.
   */
  const runAlgorithm = useCallback(async () => {
    if (isRunning || !grid || grid.length === 0) return;
    
    setIsRunning(true);
    setIsPaused(false);
    setShouldStop(false);
    
    const startTime = performance.now();
    let result;
    
    switch (algorithm) {
      case 'dijkstra':
        result = dijkstra(grid, start, end, speed);
        break;
      case 'bfs':
        result = bfs(grid, start, end, speed);
        break;
      case 'dfs':
        result = dfs(grid, start, end, speed);
        break;
      case 'astar':
        result = astar(grid, start, end, speed);
        break;
      case 'greedy':
        result = greedy(grid, start, end, speed);
        break;

      default:
        result = dijkstra(grid, start, end, speed);
    }
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    await animateAlgorithm(result.visitedNodesInOrder, result.shortestPath, speed);
    
    setStats({
      visitedNodes: result.visitedNodesInOrder.length,
      pathLength: result.shortestPath.length,
      executionTime: executionTime.toFixed(2),
      algorithm: algorithm.toUpperCase()
    });
    
    setIsRunning(false);
  }, [algorithm, grid, start, end, speed, isRunning]);

  /**
   * Animates the pathfinding algorithm's execution, showing visited nodes and the final path.
   * @param {Array<Object>} visitedNodesInOrder - The array of nodes visited in order.
   * @param {Array<Object>} shortestPath - The array of nodes in the shortest path.
   * @param {number} speed - The animation speed.
   */
  const animateAlgorithm = useCallback(async (visitedNodesInOrder, shortestPath, speed) => {
    const delay = 1000 / speed;
    
    // Animate visited nodes
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      if (shouldStop) {
        return;
      }
      
      while (isPaused && !shouldStop) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (shouldStop) {
        return;
      }
      
      const node = visitedNodesInOrder[i];
      setGrid(prevGrid => {
        const newGrid = prevGrid.map((gridRow, row) =>
          gridRow.map((cell, col) =>
            row === node.row && col === node.col
              ? { ...cell, isVisited: true, isCurrent: true }
              : { ...cell, isCurrent: false }
          )
        );
        return newGrid;
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Animate shortest path
    for (let i = 0; i < shortestPath.length; i++) {
      if (shouldStop) {
        return;
      }
      
      while (isPaused && !shouldStop) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (shouldStop) {
        return;
      }
      
      const node = shortestPath[i];
      setGrid(prevGrid => {
        const newGrid = prevGrid.map((gridRow, row) =>
          gridRow.map((cell, col) =>
            row === node.row && col === node.col
              ? { ...cell, isPath: true, isCurrent: false }
              : { ...cell, isCurrent: false }
          )
        );
        return newGrid;
      });
      
      await new Promise(resolve => setTimeout(resolve, delay * 2));
    }
  }, [isPaused, shouldStop]);

  /**
   * Pauses or resumes the algorithm animation.
   */
  const handlePauseResume = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  /**
   * Stops the currently running algorithm animation.
   */
  const handleStop = useCallback(() => {
    setShouldStop(true);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  /**
   * Toggles between light and dark mode.
   */
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <div className="header-main">
          <h1>Path Visualizer</h1>
          <p>Interactive visualization of Dijkstra's, BFS, DFS, A*, and Greedy algorithms</p>
        </div>
        
        <Controls
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          speed={speed}
          setSpeed={setSpeed}
          wallType={wallType}
          setWallType={setWallType}
          onRun={runAlgorithm}
          onReset={handleReset}
          onClearWalls={handleClearWalls}
          onGenerateWalls={handleGenerateWalls}
          onGridSizeChange={handleGridSizeChange}
          onPauseResume={handlePauseResume}
          // onStop={handleStop}
          isRunning={isRunning}
          isPaused={isPaused}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
      
      {isGridReady && grid.length > 0 ? (
        <Grid
          grid={grid}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
      ) : (
        <div className="grid-container" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading grid...</p>
        </div>
      )}
      
      <Stats stats={stats} isDarkMode={isDarkMode} />
    </div>
  );
};

export default App; 