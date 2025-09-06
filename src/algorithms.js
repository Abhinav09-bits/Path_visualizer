// Priority Queue implementation for Dijkstra's algorithm
/**
 * A simple Priority Queue implementation.
 */
class PriorityQueue {
  /**
   * Initializes a new instance of the PriorityQueue.
   */
  constructor() {
    this.values = [];
  }

  /**
   * Adds an element to the queue with a given priority.
   * @param {*} val - The value to add to the queue.
   * @param {number} priority - The priority of the value.
   */
  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  /**
   * Removes and returns the element with the highest priority (lowest priority number).
   * @returns {{val: *, priority: number} | undefined} The element with the highest priority, or undefined if the queue is empty.
   */
  dequeue() {
    return this.values.shift();
  }

  /**
   * Sorts the queue based on priority in ascending order.
   */
  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} True if the queue is empty, false otherwise.
   */
  isEmpty() {
    return this.values.length === 0;
  }

  /**
   * Checks if a node with the given coordinates exists in the queue.
   * @param {number} row - The row of the node.
   * @param {number} col - The column of the node.
   * @returns {boolean} True if the node exists, false otherwise.
   */
  hasNode(row, col) {
    return this.values.some(item => item.val.row === row && item.val.col === col);
  }

  /**
   * Updates the priority of an existing node in the queue.
   * @param {number} row - The row of the node to update.
   * @param {number} col - The column of the node to update.
   * @param {number} newPriority - The new priority for the node.
   */
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

/**
 * Represents a node in the grid for pathfinding algorithms.
 */
class Node {
  /**
   * Creates a new Node instance.
   * @param {number} row - The row of the node.
   * @param {number} col - The column of the node.
   * @param {number} [distance=Infinity] - The distance from the start node.
   * @param {Node|null} [previous=null] - The previous node in the path.
   */
  constructor(row, col, distance = Infinity, previous = null) {
    this.row = row;
    this.col = col;
    this.distance = distance;
    this.previous = previous;
  }
}

/**
 * Performs Dijkstra's algorithm to find the shortest path in a grid.
 * @param {Array<Array<Object>>} grid - The grid of nodes.
 * @param {Object} start - The start node coordinates {row, col}.
 * @param {Object} end - The end node coordinates {row, col}.
 * @param {number} [speed=10] - The speed of the visualization (not used in calculation).
 * @returns {{visitedNodesInOrder: Array<Object>, shortestPath: Array<Object>, distances: Array<Array<number>>}} An object containing the visited nodes, the shortest path, and the distances.
 */
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

/**
 * Performs Breadth-First Search to find the shortest path in an unweighted grid.
 * @param {Array<Array<Object>>} grid - The grid of nodes.
 * @param {Object} start - The start node coordinates {row, col}.
 * @param {Object} end - The end node coordinates {row, col}.
 * @param {number} [speed=10] - The speed of the visualization (not used in calculation).
 * @returns {{visitedNodesInOrder: Array<Object>, shortestPath: Array<Object>}} An object containing the visited nodes and the shortest path.
 */
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

/**
 * Performs Depth-First Search to find a path in a grid.
 * @param {Array<Array<Object>>} grid - The grid of nodes.
 * @param {Object} start - The start node coordinates {row, col}.
 * @param {Object} end - The end node coordinates {row, col}.
 * @param {number} [speed=10] - The speed of the visualization (not used in calculation).
 * @returns {{visitedNodesInOrder: Array<Object>, shortestPath: Array<Object>}} An object containing the visited nodes and the path found.
 */
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

/**
 * Gets the valid neighbors of a cell in the grid.
 * @param {number} row - The row of the cell.
 * @param {number} col - The column of the cell.
 * @param {Array<Array<Object>>} grid - The grid.
 * @returns {Array<Object>} An array of neighbor nodes.
 */
const getNeighbors = (row, col, grid) => {
  const neighbors = [];
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
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

/**
 * Checks if a position is within the grid bounds.
 * @param {number} row - The row to check.
 * @param {number} col - The column to check.
 * @param {Array<Array<Object>>} grid - The grid.
 * @returns {boolean} True if the position is valid, false otherwise.
 */
const isValidPosition = (row, col, grid) => {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

/**
 * Reconstructs the shortest path from the `previousNodes` map.
 * @param {Array<Array<Object>>} previousNodes - A grid where each cell points to the previous node in the path.
 * @param {Object} end - The end node.
 * @returns {Array<Object>} An array of nodes representing the shortest path.
 */
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

/**
 * Creates a grid with the specified number of rows and columns.
 * @param {number} rows - The number of rows for the grid.
 * @param {number} cols - The number of columns for the grid.
 * @returns {Array<Array<Object>>} The newly created grid.
 */
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

/**
 * Generates random walls on the grid.
 * @param {Array<Array<Object>>} grid - The grid to add walls to.
 * @param {number} [wallPercentage=0.3] - The percentage of cells to turn into walls.
 * @returns {Array<Array<Object>>} The grid with random walls.
 */
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

/**
 * Finds the start node in the grid.
 * @param {Array<Array<Object>>} grid - The grid to search.
 * @returns {{row: number, col: number} | null} The coordinates of the start node, or null if not found.
 */
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

/**
 * Finds the end node in the grid.
 * @param {Array<Array<Object>>} grid - The grid to search.
 * @returns {{row: number, col: number} | null} The coordinates of the end node, or null if not found.
 */
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

/**
 * Clears the grid of pathfinding-related properties (visited, path, etc.).
 * @param {Array<Array<Object>>} grid - The grid to clear.
 * @returns {Array<Array<Object>>} The cleared grid.
 */
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

/**
 * Performs the A* search algorithm to find the shortest path using a heuristic.
 * @param {Array<Array<Object>>} grid - The grid of nodes.
 * @param {Object} start - The start node coordinates {row, col}.
 * @param {Object} end - The end node coordinates {row, col}.
 * @param {number} [speed=10] - The speed of the visualization (not used in calculation).
 * @returns {{visitedNodesInOrder: Array<Object>, shortestPath: Array<Object>}} An object containing the visited nodes and the shortest path.
 */
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

/**
 * Performs the Greedy Best-First Search algorithm.
 * @param {Array<Array<Object>>} grid - The grid of nodes.
 * @param {Object} start - The start node coordinates {row, col}.
 * @param {Object} end - The end node coordinates {row, col}.
 * @param {number} [speed=10] - The speed of the visualization (not used in calculation).
 * @returns {{visitedNodesInOrder: Array<Object>, shortestPath: Array<Object>}} An object containing the visited nodes and the path found.
 */
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

/**
 * Calculates the Manhattan distance heuristic between two nodes.
 * @param {Object} nodeOne - The first node {row, col}.
 * @param {Object} nodeTwo - The second node {row, col}.
 * @returns {number} The Manhattan distance between the two nodes.
 */
const manhattanDistance = (nodeOne, nodeTwo) => {
  const xChange = Math.abs(nodeOne.row - nodeTwo.row);
  const yChange = Math.abs(nodeOne.col - nodeTwo.col);
  return xChange + yChange;
}; 