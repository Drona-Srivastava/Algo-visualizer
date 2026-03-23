export const categoryCatalog = {
  sorting: {
    title: "Sorting and Searching",
    subtitle: "Core algorithms with step-by-step simulation.",
    algorithms: [
      {
        id: "bubble",
        name: "Bubble Sort",
        detail:
          "Repeatedly compares adjacent values and swaps them to move larger values to the end.",
      },
      {
        id: "selection",
        name: "Selection Sort",
        detail:
          "Finds the minimum from the unsorted section and places it at the current position.",
      },
      {
        id: "insertion",
        name: "Insertion Sort",
        detail:
          "Builds a sorted prefix by inserting each new value into its correct spot.",
      },
      {
        id: "merge",
        name: "Merge Sort",
        detail: "Splits, recursively sorts, and merges halves in sorted order.",
      },
      {
        id: "quick",
        name: "Quick Sort",
        detail:
          "Partitions around a pivot and recursively sorts left and right partitions.",
      },
      {
        id: "heap",
        name: "Heap Sort",
        detail:
          "Uses a heap to repeatedly extract the largest element into final position.",
      },
      {
        id: "binary",
        name: "Binary Search",
        detail:
          "Searches sorted input by repeatedly halving the candidate range.",
      },
      {
        id: "ternary",
        name: "Ternary Search",
        detail:
          "Searches sorted input by dividing the current range into three parts.",
      },
    ],
  },
  graphs: {
    title: "Graph Algorithms",
    subtitle: "Traversal, shortest paths, ordering, and connectivity.",
    algorithms: [
      {
        id: "bfs",
        name: "BFS",
        detail: "Level-order traversal using a queue.",
      },
      {
        id: "dfs",
        name: "DFS",
        detail: "Depth traversal using recursion or a stack.",
      },
      {
        id: "dijkstra",
        name: "Dijkstra's Algorithm",
        detail:
          "Computes shortest paths from a source with non-negative weights.",
      },
      {
        id: "astar",
        name: "A* Search",
        detail: "Best-first search guided by cost and heuristic.",
      },
      {
        id: "topological",
        name: "Topological Sort",
        detail: "Linear ordering for DAG vertices by dependency.",
      },
      {
        id: "kruskal",
        name: "Kruskal's Algorithm",
        detail: "Builds MST by adding smallest non-cycling edges.",
      },
      {
        id: "prim",
        name: "Prim's Algorithm",
        detail: "Builds MST by growing one tree from a start node.",
      },
      {
        id: "union-find",
        name: "Union-Find",
        detail: "Tracks connected components with union and find operations.",
      },
    ],
  },
  dp: {
    title: "Dynamic Programming",
    subtitle: "Optimal substructure with memoization and tabulation.",
    algorithms: [
      {
        id: "knapsack",
        name: "0/1 Knapsack",
        detail: "Maximizes value under capacity constraints.",
      },
      {
        id: "lcs",
        name: "Longest Common Subsequence",
        detail: "Finds longest sequence present in both inputs.",
      },
      {
        id: "lis",
        name: "Longest Increasing Subsequence",
        detail: "Finds longest strictly increasing subsequence.",
      },
      {
        id: "coin-change",
        name: "Coin Change",
        detail: "Computes minimum coins or count of ways for a target.",
      },
      {
        id: "matrix-chain",
        name: "Matrix Chain Multiplication",
        detail: "Optimizes parenthesization cost of matrix products.",
      },
    ],
  },
  greedy: {
    title: "Greedy Algorithms",
    subtitle: "Locally optimal choices that build global solutions.",
    algorithms: [
      {
        id: "huffman",
        name: "Huffman Coding",
        detail:
          "Builds prefix codes by repeatedly merging least frequent nodes.",
      },
      {
        id: "activity",
        name: "Activity Selection",
        detail: "Selects maximum non-overlapping activities by finish time.",
      },
      {
        id: "fractional-knapsack",
        name: "Fractional Knapsack",
        detail:
          "Takes items by best value-to-weight ratio, including fractions.",
      },
    ],
  },
  tree: {
    title: "Tree Algorithms",
    subtitle: "Traversals and classic BST/tree operations.",
    algorithms: [
      {
        id: "inorder",
        name: "Inorder Traversal",
        detail: "Visits left subtree, root, then right subtree.",
      },
      {
        id: "preorder",
        name: "Preorder Traversal",
        detail: "Visits root, then left and right subtrees.",
      },
      {
        id: "postorder",
        name: "Postorder Traversal",
        detail: "Visits left and right subtrees before root.",
      },
      {
        id: "bst",
        name: "BST Insert/Delete/Search",
        detail: "Maintains sorted binary-search-tree order operations.",
      },
      {
        id: "lca",
        name: "Lowest Common Ancestor",
        detail: "Finds the nearest shared ancestor of two nodes.",
      },
    ],
  },
  pathfinding: {
    title: "Pathfinding Algorithms",
    subtitle: "Route-finding strategies across weighted or heuristic spaces.",
    algorithms: [
      {
        id: "astar-path",
        name: "A* Search",
        detail: "Combines path cost and heuristic estimate to target.",
      },
      {
        id: "greedy-best-first",
        name: "Greedy Best First Search",
        detail: "Expands the node with best heuristic estimate first.",
      },
    ],
  },
  string: {
    title: "String Algorithms",
    subtitle: "Pattern matching and rolling hash techniques.",
    algorithms: [
      {
        id: "kmp",
        name: "KMP Algorithm",
        detail: "Uses prefix table to skip redundant comparisons.",
      },
      {
        id: "rabin-karp",
        name: "Rabin-Karp",
        detail: "Uses rolling hash to quickly find candidate matches.",
      },
    ],
  },
  backtracking: {
    title: "Backtracking Algorithms",
    subtitle: "Systematic search with constraint-driven pruning.",
    algorithms: [
      {
        id: "n-queens",
        name: "N-Queens",
        detail: "Places queens row by row avoiding attacks.",
      },
      {
        id: "sudoku",
        name: "Sudoku Solver",
        detail:
          "Fills cells while preserving row, column, and box constraints.",
      },
    ],
  },
};

export const getAlgorithmByCategory = (categoryId, algorithmId) => {
  const category = categoryCatalog[categoryId];
  if (!category) return null;
  return category.algorithms.find((algo) => algo.id === algorithmId) ?? null;
};
