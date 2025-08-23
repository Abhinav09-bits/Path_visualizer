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

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = useCallback(() => {
    const newGrid = createGridWithWalls(20, 50);
    newGrid[start.row][start.col].isStart = true;
    newGrid[end.row][end.col].isEnd = true;
    setGrid(newGrid);
    setIsGridReady(true);
  }, [start, end]);

  // Reset grid
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

  // Clear walls
  const handleClearWalls = useCallback(() => {
    if (!grid || grid.length === 0) return;
    const newGrid = grid.map(row =>
      row.map(cell => ({ ...cell, isWall: false }))
    );
    setGrid(newGrid);
  }, [grid]);

  // Generate random walls
  const handleGenerateWalls = useCallback(() => {
    if (!grid || grid.length === 0) return;
    const newGrid = generateRandomWalls(grid, 0.3);
    setGrid(newGrid);
  }, [grid]);

  // Change grid size
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

  // Handle mouse events for drawing walls
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

  const handleMouseUp = useCallback(() => {
    setMouseIsPressed(false);
  }, []);

  // Toggle wall
  const handleWallToggle = useCallback((row, col) => {
    if (!grid || !grid[row] || !grid[row][col] || grid[row][col].isStart || grid[row][col].isEnd) return;
    
    const newGrid = grid.map((gridRow, i) =>
      gridRow.map((cell, j) =>
        i === row && j === col ? { ...cell, isWall: !cell.isWall } : cell
      )
    );
    setGrid(newGrid);
  }, [grid]);

  // Change start position
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

  // Change end position
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

  // Run algorithm
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
    
    // Animate the algorithm
    await animateAlgorithm(result.visitedNodesInOrder, result.shortestPath, speed);
    
    setStats({
      visitedNodes: result.visitedNodesInOrder.length,
      pathLength: result.shortestPath.length,
      executionTime: executionTime.toFixed(2),
      algorithm: algorithm.toUpperCase()
    });
    
    setIsRunning(false);
  }, [algorithm, grid, start, end, speed, isRunning]);

  // Animate algorithm execution
  const animateAlgorithm = useCallback(async (visitedNodesInOrder, shortestPath, speed) => {
    const delay = 1000 / speed;
    
    // Animate visited nodes
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      // Check for stop flag
      if (shouldStop) {
        return;
      }
      
      // Check for pause at each step
      while (isPaused && !shouldStop) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Check again after pause
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
      // Check for stop flag
      if (shouldStop) {
        return;
      }
      
      // Check for pause at each step
      while (isPaused && !shouldStop) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Check again after pause
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

  // Pause/Resume
  const handlePauseResume = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  // Stop algorithm
  const handleStop = useCallback(() => {
    setShouldStop(true);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // Toggle Dark Mode
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