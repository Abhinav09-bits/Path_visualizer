// Priority Queue implementation for Dijkstra's algorithm
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return this.values.length === 0;
  }

  // Check if a node with given coordinates exists
  hasNode(row, col) {
    return this.values.some(item => item.val.row === row && item.val.col === col);
  }

  // Update priority of existing node
  updatePriority(row, col, newPriority) {
    const index = this.values.findIndex(item => 
      item.val.row === row && item.val.col === col
    );
    if (index !== -1) {
      this.values[index].priority = newPriority;
      this.sort();
    }
  }
}

// Node class for tracking path information
class Node {
  constructor(row, col, distance = Infinity, previous = null) {
    this.row = row;
    this.col = col;
    this.distance = distance;
    this.previous = previous;
  }
}

// Dijkstra's Algorithm - finds shortest path using weighted edges
export const dijkstra = (grid, start, end, speed = 10) => {
  // Validate inputs
  if (!grid || !grid.length || !grid[0] || !grid[0].length || !start || !end) {
    return { visitedNodesInOrder: [], shortestPath: [], distances: [] };
  }
  
  const visitedNodesInOrder = [];
  const unvisitedNodes = new PriorityQueue();
  
  // Initialize distances and previous nodes arrays
  const distances = Array(grid.length).fill().map(() => 
    Array(grid[0].length).fill(Infinity)
  );
  const previousNodes = Array(grid.length).fill().map(() => 
    Array(grid[0].length).fill(null)
  );
  const visited = Array(grid.length).fill().map(() => 
    Array(grid[0].length).fill(false)
  );
  
  // Set start node distance to 0
  distances[start.row][start.col] = 0;
  unvisitedNodes.enqueue(new Node(start.row, start.col, 0), 0);

  while (!unvisitedNodes.isEmpty()) {
    const currentNode = unvisitedNodes.dequeue().val;
    
    // Skip if already visited
    if (visited[currentNode.row][currentNode.col]) {
      continue;
    }
    
    // Mark current node as visited
    visited[currentNode.row][currentNode.col] = true;
    visitedNodesInOrder.push(currentNode);
    
    // Check if we reached the end
    if (currentNode.row === end.row && currentNode.col === end.col) {
      break;
    }
    
    // Get neighbors and update their distances
    const neighbors = getNeighbors(currentNode.row, currentNode.col, grid);
    
    for (const neighbor of neighbors) {
      const { row, col } = neighbor;
      
      // Skip if already visited or is a wall
      if (visited[row][col] || grid[row][col].isWall) {
        continue;
      }
      
      const weight = 1; // All non-wall cells have weight 1
      const newDistance = distances[currentNode.row][currentNode.col] + weight;
      
      if (newDistance < distances[row][col]) {
        distances[row][col] = newDistance;
        previousNodes[row][col] = currentNode;
        
        // Add to priority queue or update existing
        if (unvisitedNodes.hasNode(row, col)) {
          unvisitedNodes.updatePriority(row, col, newDistance);
        } else {
          unvisitedNodes.enqueue(new Node(row, col, newDistance, currentNode), newDistance);
        }
      }
    }
  }

  const shortestPath = getNodesInShortestPathOrder(previousNodes, end);
  return { visitedNodesInOrder, shortestPath, distances };
};

// Breadth-First Search - finds shortest path in unweighted graph
export const bfs = (grid, start, end, speed = 10) => {
  // Validate inputs
  if (!grid || !grid.length || !grid[0] || !grid[0].length || !start || !end) {
    return { visitedNodesInOrder: [], shortestPath: [] };
  }
  
  const visitedNodesInOrder = [];
  const queue = [{ row: start.row, col: start.col, previous: null }];
  const visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
  const previousNodes = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
  
  visited[start.row][start.col] = true;
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);
    
    if (currentNode.row === end.row && currentNode.col === end.col) {
      break;
    }
    
    const neighbors = getNeighbors(currentNode.row, currentNode.col, grid);
    
    for (const neighbor of neighbors) {
      const { row, col } = neighbor;
      
      if (!visited[row][col] && !grid[row][col].isWall) {
        visited[row][col] = true;
        previousNodes[row][col] = currentNode;
        queue.push({ row, col, previous: currentNode });
      }
    }
  }
  
  const shortestPath = getNodesInShortestPathOrder(previousNodes, end);
  return { visitedNodesInOrder, shortestPath };
};

// Depth-First Search - explores as far as possible along each branch
export const dfs = (grid, start, end, speed = 10) => {
  // Validate inputs
  if (!grid || !grid.length || !grid[0] || !grid[0].length || !start || !end) {
    return { visitedNodesInOrder: [], shortestPath: [] };
  }
  
  const visitedNodesInOrder = [];
  const stack = [{ row: start.row, col: start.col, previous: null }];
  const visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
  const previousNodes = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
  
  visited[start.row][start.col] = true;
  
  while (stack.length > 0) {
    const currentNode = stack.pop();
    visitedNodesInOrder.push(currentNode);
    
    if (currentNode.row === end.row && currentNode.col === end.col) {
      break;
    }
    
    const neighbors = getNeighbors(currentNode.row, currentNode.col, grid);
    
    for (const neighbor of neighbors) {
      const { row, col } = neighbor;
      
      if (!visited[row][col] && !grid[row][col].isWall) {
        visited[row][col] = true;
        previousNodes[row][col] = currentNode;
        stack.push({ row, col, previous: currentNode });
      }
    }
  }
  
  const shortestPath = getNodesInShortestPathOrder(previousNodes, end);
  return { visitedNodesInOrder, shortestPath };
};

// Get valid neighbors for a given cell
const getNeighbors = (row, col, grid) => {
  const neighbors = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];
  
  for (const direction of directions) {
    const newRow = row + direction.row;
    const newCol = col + direction.col;
    
    if (isValidPosition(newRow, newCol, grid)) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  
  return neighbors;
};

// Check if position is valid within grid bounds
const isValidPosition = (row, col, grid) => {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

// Get the shortest path by backtracking from end to start
const getNodesInShortestPathOrder = (previousNodes, end) => {
  const nodesInShortestPathOrder = [];
  let currentNode = previousNodes[end.row][end.col];
  
  // If no path was found, return empty array
  if (currentNode === null) {
    return nodesInShortestPathOrder;
  }
  
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = previousNodes[currentNode.row][currentNode.col];
  }
  
  return nodesInShortestPathOrder;
};

// Utility function to create a grid with walls
export const createGridWithWalls = (rows, cols) => {
  const grid = [];
  
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isWall: false,
        isStart: false,
        isEnd: false,
        isVisited: false,
        isPath: false,
        isFrontier: false,
        isCurrent: false
      });
    }
    grid.push(currentRow);
  }
  
  return grid;
};

// Generate random walls
export const generateRandomWalls = (grid, wallPercentage = 0.3) => {
  const newGrid = grid.map(row => 
    row.map(cell => ({ ...cell, isWall: Math.random() < wallPercentage }))
  );
  
  // Ensure start and end are not walls
  const start = findStart(newGrid);
  const end = findEnd(newGrid);
  
  if (start) newGrid[start.row][start.col].isWall = false;
  if (end) newGrid[end.row][end.col].isWall = false;
  
  return newGrid;
};

// Find start node in grid
export const findStart = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col].isStart) {
        return { row, col };
      }
    }
  }
  return null;
};

// Find end node in grid
export const findEnd = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col].isEnd) {
        return { row, col };
      }
    }
  }
  return null;
};

// Clear grid (remove visited, path, etc.)
export const clearGrid = (grid) => {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      isVisited: false,
      isPath: false,
      isFrontier: false,
      isCurrent: false
    }))
  );
};

// A* Algorithm - finds shortest path using heuristic
export const astar = (grid, start, end, speed = 10) => {
  // Validate inputs
  if (!grid || !grid.length || !grid[0] || !grid[0].length || !start || !end) {
    return { visitedNodesInOrder: [], shortestPath: [] };
  }
  
  const visitedNodesInOrder = [];
  const openSet = new PriorityQueue();
  const closedSet = new Set();
  
  // Initialize gScore and fScore arrays
  const gScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
  const fScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
  const previousNodes = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
  
  // Set start node scores
  gScore[start.row][start.col] = 0;
  fScore[start.row][start.col] = manhattanDistance({ row: start.row, col: start.col }, end);
  
  openSet.enqueue(new Node(start.row, start.col, fScore[start.row][start.col]), fScore[start.row][start.col]);
  
  while (!openSet.isEmpty()) {
    const currentNode = openSet.dequeue().val;
    
    if (currentNode.row === end.row && currentNode.col === end.col) {
      visitedNodesInOrder.push(currentNode);
      break;
    }
    
    closedSet.add(`${currentNode.row}-${currentNode.col}`);
    visitedNodesInOrder.push(currentNode);
    
    const neighbors = getNeighbors(currentNode.row, currentNode.col, grid);
    
    for (const neighbor of neighbors) {
      const { row, col } = neighbor;
      const neighborKey = `${row}-${col}`;
      
      if (closedSet.has(neighborKey) || grid[row][col].isWall) {
        continue;
      }
      
      const tentativeGScore = gScore[currentNode.row][currentNode.col] + 1;
      
      if (tentativeGScore < gScore[row][col]) {
        previousNodes[row][col] = currentNode;
        gScore[row][col] = tentativeGScore;
        fScore[row][col] = gScore[row][col] + manhattanDistance({ row, col }, end);
        
        if (!openSet.hasNode(row, col)) {
          openSet.enqueue(new Node(row, col, fScore[row][col], currentNode), fScore[row][col]);
        }
      }
    }
  }
  
  const shortestPath = getNodesInShortestPathOrder(previousNodes, end);
  return { visitedNodesInOrder, shortestPath };
};

// Greedy Best-First Search Algorithm
export const greedy = (grid, start, end, speed = 10) => {
  // Validate inputs
  if (!grid || !grid.length || !grid[0] || !grid[0].length || !start || !end) {
    return { visitedNodesInOrder: [], shortestPath: [] };
  }
  
  const visitedNodesInOrder = [];
  const openSet = new PriorityQueue();
  const closedSet = new Set();
  
  const previousNodes = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
  
  openSet.enqueue(new Node(start.row, start.col, 0), 0);
  
  while (!openSet.isEmpty()) {
    const currentNode = openSet.dequeue().val;
    
    if (currentNode.row === end.row && currentNode.col === end.col) {
      visitedNodesInOrder.push(currentNode);
      break;
    }
    
    closedSet.add(`${currentNode.row}-${currentNode.col}`);
    visitedNodesInOrder.push(currentNode);
    
    const neighbors = getNeighbors(currentNode.row, currentNode.col, grid);
    
    for (const neighbor of neighbors) {
      const { row, col } = neighbor;
      const neighborKey = `${row}-${col}`;
      
      if (closedSet.has(neighborKey) || grid[row][col].isWall) {
        continue;
      }
      
      const heuristic = manhattanDistance({ row, col }, end);
      previousNodes[row][col] = currentNode;
      
      if (!openSet.hasNode(row, col)) {
        openSet.enqueue(new Node(row, col, heuristic, currentNode), heuristic);
      }
    }
  }
  
  const shortestPath = getNodesInShortestPathOrder(previousNodes, end);
  return { visitedNodesInOrder, shortestPath };
};



// Manhattan Distance heuristic function
const manhattanDistance = (nodeOne, nodeTwo) => {
  const xChange = Math.abs(nodeOne.row - nodeTwo.row);
  const yChange = Math.abs(nodeOne.col - nodeTwo.col);
  return xChange + yChange;
}; 