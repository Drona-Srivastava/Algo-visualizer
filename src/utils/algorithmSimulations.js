import { buildSortingSteps } from "./sortingSimulations";

const cloneStep = (array, highlights = [], note = "") => ({
  array: [...array],
  highlights,
  note,
});

export const parseInputValues = (value) => {
  const rawItems = value
    .split(/[\n,]+|\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const numericItems = rawItems.map(Number);
  const allNumeric = rawItems.length > 0 && numericItems.every(Number.isFinite);

  return {
    rawItems,
    numericItems: allNumeric ? numericItems : [],
    isNumeric: allNumeric,
  };
};

const clone2D = (matrix) => matrix.map((row) => [...row]);

const normalizeLines = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseGraphEdges = (edgeInput, nodeCount, weighted = false) => {
  const lines = normalizeLines(edgeInput);
  const edges = [];

  for (const line of lines) {
    const tokens = line.replace(/[-,:]/g, " ").split(/\s+/).filter(Boolean);

    if (tokens.length < 2) {
      return { error: `Invalid edge format: ${line}`, edges: [] };
    }

    const from = Number(tokens[0]);
    const to = Number(tokens[1]);
    if (weighted && tokens[2] == null) {
      return {
        error: `Weighted edge requires format 'u v w': ${line}`,
        edges: [],
      };
    }

    const weight = weighted ? Number(tokens[2]) : 1;

    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      !Number.isFinite(weight)
    ) {
      return { error: `Invalid edge numbers: ${line}`, edges: [] };
    }

    if (from < 0 || to < 0 || from >= nodeCount || to >= nodeCount) {
      return {
        error: `Edge out of range for node count ${nodeCount}: ${line}`,
        edges: [],
      };
    }

    edges.push({ from, to, weight });
  }

  return { error: "", edges };
};

const buildAdjacency = (nodeCount, edges, directed = false) => {
  const adjacency = Array.from({ length: nodeCount }, () => []);

  edges.forEach((edge) => {
    adjacency[edge.from].push({ to: edge.to, weight: edge.weight });
    if (!directed) {
      adjacency[edge.to].push({ to: edge.from, weight: edge.weight });
    }
  });

  adjacency.forEach((neighbors) => {
    neighbors.sort((a, b) => a.to - b.to);
  });

  return adjacency;
};

const graphStep = ({
  array,
  note,
  highlights = [],
  nodeCount,
  edges,
  activeNodes = [],
  visitedNodes = [],
  treeEdges = [],
  table,
}) => ({
  array,
  note,
  highlights,
  graph: {
    nodeCount,
    edges,
    activeNodes,
    visitedNodes,
    treeEdges,
  },
  table,
});

const formatDistance = (value) =>
  Number.isFinite(value) ? String(value) : "inf";

const bfsSteps = ({ nodeCount, edges, startNode }) => {
  const adjacency = buildAdjacency(nodeCount, edges);
  const visited = Array(nodeCount).fill(false);
  const queue = [startNode];
  const order = [];
  const parent = Array(nodeCount).fill(-1);
  const treeEdges = [];
  const steps = [];

  visited[startNode] = true;
  steps.push(
    graphStep({
      array: order.map(String),
      note: `Start BFS from node ${startNode}`,
      nodeCount,
      edges,
      activeNodes: [startNode],
      visitedNodes: [startNode],
      treeEdges,
    }),
  );

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);

    steps.push(
      graphStep({
        array: order.map(String),
        note: `Visit node ${current}`,
        nodeCount,
        edges,
        activeNodes: [current],
        visitedNodes: order,
        treeEdges,
      }),
    );

    for (const neighbor of adjacency[current]) {
      if (!visited[neighbor.to]) {
        visited[neighbor.to] = true;
        parent[neighbor.to] = current;
        treeEdges.push([current, neighbor.to]);
        queue.push(neighbor.to);

        steps.push(
          graphStep({
            array: order.map(String),
            note: `Discover ${neighbor.to} from ${current}, push to queue`,
            nodeCount,
            edges,
            activeNodes: [current, neighbor.to],
            visitedNodes: Array.from({ length: nodeCount })
              .map((_, idx) => idx)
              .filter((idx) => visited[idx]),
            treeEdges,
          }),
        );
      }
    }
  }

  steps.push(
    graphStep({
      array: order.map(String),
      note: "BFS traversal complete",
      nodeCount,
      edges,
      visitedNodes: order,
      treeEdges,
    }),
  );

  return steps;
};

const dfsSteps = ({ nodeCount, edges, startNode }) => {
  const adjacency = buildAdjacency(nodeCount, edges);
  const visited = Array(nodeCount).fill(false);
  const stack = [{ node: startNode, parent: -1 }];
  const order = [];
  const treeEdges = [];
  const steps = [
    graphStep({
      array: [],
      note: `Start DFS from node ${startNode}`,
      nodeCount,
      edges,
      activeNodes: [startNode],
      visitedNodes: [],
      treeEdges,
    }),
  ];

  while (stack.length > 0) {
    const top = stack.pop();
    if (visited[top.node]) {
      continue;
    }

    visited[top.node] = true;
    order.push(top.node);

    if (top.parent !== -1) {
      treeEdges.push([top.parent, top.node]);
    }

    steps.push(
      graphStep({
        array: order.map(String),
        note: `Visit node ${top.node}`,
        nodeCount,
        edges,
        activeNodes: [top.node],
        visitedNodes: order,
        treeEdges,
      }),
    );

    const neighbors = [...adjacency[top.node]].sort((a, b) => b.to - a.to);
    for (const neighbor of neighbors) {
      if (!visited[neighbor.to]) {
        stack.push({ node: neighbor.to, parent: top.node });
      }
    }
  }

  steps.push(
    graphStep({
      array: order.map(String),
      note: "DFS traversal complete",
      nodeCount,
      edges,
      visitedNodes: order,
      treeEdges,
    }),
  );

  return steps;
};

const dijkstraSteps = ({ nodeCount, edges, startNode, targetNode }) => {
  const adjacency = buildAdjacency(nodeCount, edges, true);
  const dist = Array(nodeCount).fill(Number.POSITIVE_INFINITY);
  const used = Array(nodeCount).fill(false);
  const parent = Array(nodeCount).fill(-1);
  const steps = [];

  dist[startNode] = 0;

  for (let iter = 0; iter < nodeCount; iter += 1) {
    let node = -1;
    for (let i = 0; i < nodeCount; i += 1) {
      if (!used[i] && (node === -1 || dist[i] < dist[node])) {
        node = i;
      }
    }

    if (node === -1 || !Number.isFinite(dist[node])) {
      break;
    }

    used[node] = true;

    steps.push(
      graphStep({
        array: dist.map((value) => (Number.isFinite(value) ? value : 0)),
        highlights: [node],
        note: `Pick node ${node} with min tentative distance ${dist[node]}`,
        nodeCount,
        edges,
        activeNodes: [node],
        visitedNodes: used
          .map((v, idx) => (v ? idx : -1))
          .filter((v) => v >= 0),
        treeEdges: parent
          .map((p, child) => (p >= 0 ? [p, child] : null))
          .filter(Boolean),
        table: {
          rowLabels: ["dist"],
          colLabels: Array.from({ length: nodeCount }, (_, idx) => String(idx)),
          values: [dist.map(formatDistance)],
        },
      }),
    );

    for (const neighbor of adjacency[node]) {
      const candidate = dist[node] + neighbor.weight;
      if (candidate < dist[neighbor.to]) {
        dist[neighbor.to] = candidate;
        parent[neighbor.to] = node;
        steps.push(
          graphStep({
            array: dist.map((value) => (Number.isFinite(value) ? value : 0)),
            highlights: [node, neighbor.to],
            note: `Relax edge ${node}-${neighbor.to} with weight ${neighbor.weight}`,
            nodeCount,
            edges,
            activeNodes: [node, neighbor.to],
            visitedNodes: used
              .map((v, idx) => (v ? idx : -1))
              .filter((v) => v >= 0),
            treeEdges: parent
              .map((p, child) => (p >= 0 ? [p, child] : null))
              .filter(Boolean),
            table: {
              rowLabels: ["dist"],
              colLabels: Array.from({ length: nodeCount }, (_, idx) =>
                String(idx),
              ),
              values: [dist.map(formatDistance)],
            },
          }),
        );
      }
    }
  }

  const targetDistance = dist[targetNode];
  steps.push(
    graphStep({
      array: dist.map((value) => (Number.isFinite(value) ? value : 0)),
      highlights: [targetNode],
      note: Number.isFinite(targetDistance)
        ? `Shortest distance to ${targetNode} is ${targetDistance}`
        : `Node ${targetNode} is unreachable`,
      nodeCount,
      edges,
      activeNodes: [targetNode],
      visitedNodes: used.map((v, idx) => (v ? idx : -1)).filter((v) => v >= 0),
      treeEdges: parent
        .map((p, child) => (p >= 0 ? [p, child] : null))
        .filter(Boolean),
      table: {
        rowLabels: ["dist"],
        colLabels: Array.from({ length: nodeCount }, (_, idx) => String(idx)),
        values: [dist.map(formatDistance)],
      },
    }),
  );

  return steps;
};

const aStarSteps = ({ nodeCount, edges, startNode, targetNode }) => {
  const adjacency = buildAdjacency(nodeCount, edges, true);
  const g = Array(nodeCount).fill(Number.POSITIVE_INFINITY);
  const f = Array(nodeCount).fill(Number.POSITIVE_INFINITY);
  const open = new Set([startNode]);
  const closed = new Set();
  const parent = Array(nodeCount).fill(-1);
  const heuristic = (node) => Math.abs(node - targetNode);

  g[startNode] = 0;
  f[startNode] = heuristic(startNode);

  const steps = [
    graphStep({
      array: [startNode],
      note: `Start A* from ${startNode} to ${targetNode}`,
      highlights: [0],
      nodeCount,
      edges,
      activeNodes: [startNode],
      visitedNodes: [],
      treeEdges: [],
      table: {
        rowLabels: ["g", "f"],
        colLabels: Array.from({ length: nodeCount }, (_, idx) => String(idx)),
        values: [g.map(formatDistance), f.map(formatDistance)],
      },
    }),
  ];

  while (open.size > 0) {
    let current = -1;
    for (const node of open) {
      if (current === -1 || f[node] < f[current]) {
        current = node;
      }
    }

    open.delete(current);
    closed.add(current);

    steps.push(
      graphStep({
        array: Array.from(closed).map(String),
        note: `Expand node ${current} with lowest f-score ${formatDistance(f[current])}`,
        nodeCount,
        edges,
        activeNodes: [current],
        visitedNodes: Array.from(closed),
        treeEdges: parent
          .map((p, child) => (p >= 0 ? [p, child] : null))
          .filter(Boolean),
        table: {
          rowLabels: ["g", "f"],
          colLabels: Array.from({ length: nodeCount }, (_, idx) => String(idx)),
          values: [g.map(formatDistance), f.map(formatDistance)],
        },
      }),
    );

    if (current === targetNode) {
      break;
    }

    for (const neighbor of adjacency[current]) {
      if (closed.has(neighbor.to)) {
        continue;
      }

      const tentativeG = g[current] + neighbor.weight;
      if (tentativeG < g[neighbor.to]) {
        parent[neighbor.to] = current;
        g[neighbor.to] = tentativeG;
        f[neighbor.to] = tentativeG + heuristic(neighbor.to);
      }

      open.add(neighbor.to);

      steps.push(
        graphStep({
          array: Array.from(open).map(String),
          note: `Update neighbor ${neighbor.to}: g=${formatDistance(g[neighbor.to])}, f=${formatDistance(f[neighbor.to])}`,
          nodeCount,
          edges,
          activeNodes: [current, neighbor.to],
          visitedNodes: Array.from(closed),
          treeEdges: parent
            .map((p, child) => (p >= 0 ? [p, child] : null))
            .filter(Boolean),
          table: {
            rowLabels: ["g", "f"],
            colLabels: Array.from({ length: nodeCount }, (_, idx) =>
              String(idx),
            ),
            values: [g.map(formatDistance), f.map(formatDistance)],
          },
        }),
      );
    }
  }

  steps.push(
    graphStep({
      array: Array.from(closed).map(String),
      note: `A* complete. ${
        Number.isFinite(g[targetNode])
          ? `Best cost to ${targetNode} is ${g[targetNode]}`
          : `Target ${targetNode} unreachable`
      }`,
      nodeCount,
      edges,
      activeNodes: [targetNode],
      visitedNodes: Array.from(closed),
      treeEdges: parent
        .map((p, child) => (p >= 0 ? [p, child] : null))
        .filter(Boolean),
      table: {
        rowLabels: ["g", "f"],
        colLabels: Array.from({ length: nodeCount }, (_, idx) => String(idx)),
        values: [g.map(formatDistance), f.map(formatDistance)],
      },
    }),
  );

  return steps;
};

const topologicalSortSteps = ({ nodeCount, edges }) => {
  const adjacency = buildAdjacency(nodeCount, edges, true);
  const indegree = Array(nodeCount).fill(0);
  edges.forEach((edge) => {
    indegree[edge.to] += 1;
  });

  const queue = [];
  indegree.forEach((degree, node) => {
    if (degree === 0) queue.push(node);
  });

  const order = [];
  const treeEdges = [];
  const steps = [
    graphStep({
      array: order.map(String),
      note: "Compute indegrees and queue all 0-indegree nodes",
      nodeCount,
      edges,
      activeNodes: queue,
      visitedNodes: [],
      treeEdges,
      table: {
        rowLabels: ["indegree"],
        colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
        values: [indegree.map(String)],
      },
    }),
  ];

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);

    steps.push(
      graphStep({
        array: order.map(String),
        note: `Pop ${current} and add to ordering`,
        nodeCount,
        edges,
        activeNodes: [current],
        visitedNodes: order,
        treeEdges,
        table: {
          rowLabels: ["indegree"],
          colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
          values: [indegree.map(String)],
        },
      }),
    );

    for (const neighbor of adjacency[current]) {
      indegree[neighbor.to] -= 1;
      if (indegree[neighbor.to] === 0) {
        queue.push(neighbor.to);
        treeEdges.push([current, neighbor.to]);
      }

      steps.push(
        graphStep({
          array: order.map(String),
          note: `Decrease indegree of ${neighbor.to} to ${indegree[neighbor.to]}`,
          nodeCount,
          edges,
          activeNodes: [current, neighbor.to],
          visitedNodes: order,
          treeEdges,
          table: {
            rowLabels: ["indegree"],
            colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
            values: [indegree.map(String)],
          },
        }),
      );
    }
  }

  if (order.length !== nodeCount) {
    steps.push(
      graphStep({
        array: order.map(String),
        note: "Cycle detected: topological ordering is not possible for this graph",
        nodeCount,
        edges,
        visitedNodes: order,
        treeEdges,
        table: {
          rowLabels: ["indegree"],
          colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
          values: [indegree.map(String)],
        },
      }),
    );
  } else {
    steps.push(
      graphStep({
        array: order.map(String),
        note: `Topological order complete: ${order.join(" -> ")}`,
        nodeCount,
        edges,
        visitedNodes: order,
        treeEdges,
        table: {
          rowLabels: ["indegree"],
          colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
          values: [indegree.map(String)],
        },
      }),
    );
  }

  return steps;
};

const primSteps = ({ nodeCount, edges, startNode }) => {
  const adjacency = buildAdjacency(nodeCount, edges);
  const inMST = Array(nodeCount).fill(false);
  const key = Array(nodeCount).fill(Number.POSITIVE_INFINITY);
  const parent = Array(nodeCount).fill(-1);
  const mstEdges = [];
  const steps = [];

  key[startNode] = 0;

  for (let iter = 0; iter < nodeCount; iter += 1) {
    let u = -1;
    for (let i = 0; i < nodeCount; i += 1) {
      if (!inMST[i] && (u === -1 || key[i] < key[u])) {
        u = i;
      }
    }

    if (u === -1 || !Number.isFinite(key[u])) break;

    inMST[u] = true;
    if (parent[u] !== -1) mstEdges.push([parent[u], u]);

    steps.push(
      graphStep({
        array: key.map((v) => (Number.isFinite(v) ? v : 0)),
        highlights: [u],
        note: `Select node ${u} with minimum key ${formatDistance(key[u])}`,
        nodeCount,
        edges,
        activeNodes: [u],
        visitedNodes: inMST
          .map((v, idx) => (v ? idx : -1))
          .filter((v) => v >= 0),
        treeEdges: mstEdges,
        table: {
          rowLabels: ["key", "inMST", "parent"],
          colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
          values: [
            key.map(formatDistance),
            inMST.map((v) => (v ? "1" : "0")),
            parent.map((p) => (p === -1 ? "-" : String(p))),
          ],
        },
      }),
    );

    for (const neighbor of adjacency[u]) {
      if (!inMST[neighbor.to] && neighbor.weight < key[neighbor.to]) {
        key[neighbor.to] = neighbor.weight;
        parent[neighbor.to] = u;

        steps.push(
          graphStep({
            array: key.map((v) => (Number.isFinite(v) ? v : 0)),
            highlights: [u, neighbor.to],
            note: `Update key of ${neighbor.to} to ${neighbor.weight} via edge ${u}-${neighbor.to}`,
            nodeCount,
            edges,
            activeNodes: [u, neighbor.to],
            visitedNodes: inMST
              .map((v, idx) => (v ? idx : -1))
              .filter((v) => v >= 0),
            treeEdges: mstEdges,
            table: {
              rowLabels: ["key", "inMST", "parent"],
              colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
              values: [
                key.map(formatDistance),
                inMST.map((v) => (v ? "1" : "0")),
                parent.map((p) => (p === -1 ? "-" : String(p))),
              ],
            },
          }),
        );
      }
    }
  }

  const total = mstEdges.reduce((acc, [a, b]) => {
    const edge = edges.find(
      (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a),
    );
    return acc + (edge ? edge.weight : 0);
  }, 0);

  steps.push(
    graphStep({
      array: mstEdges.map(([a, b]) => `${a}-${b}`),
      note: `Prim complete. MST total weight = ${total}`,
      nodeCount,
      edges,
      visitedNodes: inMST.map((v, idx) => (v ? idx : -1)).filter((v) => v >= 0),
      treeEdges: mstEdges,
      table: {
        rowLabels: ["key", "inMST", "parent"],
        colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
        values: [
          key.map(formatDistance),
          inMST.map((v) => (v ? "1" : "0")),
          parent.map((p) => (p === -1 ? "-" : String(p))),
        ],
      },
    }),
  );

  return steps;
};

const createDSU = (n) => ({
  parent: Array.from({ length: n }, (_, i) => i),
  rank: Array(n).fill(0),
});

const findSet = (dsu, x) => {
  if (dsu.parent[x] !== x) {
    dsu.parent[x] = findSet(dsu, dsu.parent[x]);
  }
  return dsu.parent[x];
};

const unionSets = (dsu, a, b) => {
  let rootA = findSet(dsu, a);
  let rootB = findSet(dsu, b);
  if (rootA === rootB) return false;

  if (dsu.rank[rootA] < dsu.rank[rootB]) {
    [rootA, rootB] = [rootB, rootA];
  }

  dsu.parent[rootB] = rootA;
  if (dsu.rank[rootA] === dsu.rank[rootB]) dsu.rank[rootA] += 1;
  return true;
};

const kruskalSteps = ({ nodeCount, edges }) => {
  const dsu = createDSU(nodeCount);
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mstEdges = [];
  const steps = [
    graphStep({
      array: [],
      note: "Sort edges by weight",
      nodeCount,
      edges,
      treeEdges: [],
      table: {
        rowLabels: ["parent", "rank"],
        colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
        values: [dsu.parent.map(String), dsu.rank.map(String)],
      },
    }),
  ];

  for (const edge of sortedEdges) {
    const rootU = findSet(dsu, edge.from);
    const rootV = findSet(dsu, edge.to);

    steps.push(
      graphStep({
        array: mstEdges.map(([u, v, w]) => `${u}-${v}(${w})`),
        note: `Check edge ${edge.from}-${edge.to} (w=${edge.weight}), roots: ${rootU}, ${rootV}`,
        nodeCount,
        edges,
        activeNodes: [edge.from, edge.to],
        treeEdges: mstEdges.map(([u, v]) => [u, v]),
        table: {
          rowLabels: ["parent", "rank"],
          colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
          values: [dsu.parent.map(String), dsu.rank.map(String)],
        },
      }),
    );

    if (unionSets(dsu, edge.from, edge.to)) {
      mstEdges.push([edge.from, edge.to, edge.weight]);
      steps.push(
        graphStep({
          array: mstEdges.map(([u, v, w]) => `${u}-${v}(${w})`),
          note: `Add edge ${edge.from}-${edge.to} to MST`,
          nodeCount,
          edges,
          activeNodes: [edge.from, edge.to],
          treeEdges: mstEdges.map(([u, v]) => [u, v]),
          table: {
            rowLabels: ["parent", "rank"],
            colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
            values: [dsu.parent.map(String), dsu.rank.map(String)],
          },
        }),
      );
    }
  }

  const total = mstEdges.reduce((acc, edge) => acc + edge[2], 0);
  steps.push(
    graphStep({
      array: mstEdges.map(([u, v, w]) => `${u}-${v}(${w})`),
      note: `Kruskal complete. MST total weight = ${total}`,
      nodeCount,
      edges,
      treeEdges: mstEdges.map(([u, v]) => [u, v]),
      table: {
        rowLabels: ["parent", "rank"],
        colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
        values: [dsu.parent.map(String), dsu.rank.map(String)],
      },
    }),
  );

  return steps;
};

const unionFindSteps = ({ nodeCount, edges }) => {
  const dsu = createDSU(nodeCount);
  const treeEdges = [];
  const steps = [
    graphStep({
      array: [],
      note: "Initialize disjoint sets (each node is its own parent)",
      nodeCount,
      edges,
      treeEdges,
      table: {
        rowLabels: ["parent", "rank"],
        colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
        values: [dsu.parent.map(String), dsu.rank.map(String)],
      },
    }),
  ];

  for (const edge of edges) {
    const rootU = findSet(dsu, edge.from);
    const rootV = findSet(dsu, edge.to);
    steps.push(
      graphStep({
        array: treeEdges.map(([u, v]) => `${u}-${v}`),
        note: `Find roots for ${edge.from} and ${edge.to}: ${rootU}, ${rootV}`,
        nodeCount,
        edges,
        activeNodes: [edge.from, edge.to],
        treeEdges,
        table: {
          rowLabels: ["parent", "rank"],
          colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
          values: [dsu.parent.map(String), dsu.rank.map(String)],
        },
      }),
    );

    if (unionSets(dsu, edge.from, edge.to)) {
      treeEdges.push([edge.from, edge.to]);
      steps.push(
        graphStep({
          array: treeEdges.map(([u, v]) => `${u}-${v}`),
          note: `Union(${edge.from}, ${edge.to}) merged two components`,
          nodeCount,
          edges,
          activeNodes: [edge.from, edge.to],
          treeEdges,
          table: {
            rowLabels: ["parent", "rank"],
            colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
            values: [dsu.parent.map(String), dsu.rank.map(String)],
          },
        }),
      );
    } else {
      steps.push(
        graphStep({
          array: treeEdges.map(([u, v]) => `${u}-${v}`),
          note: `Union(${edge.from}, ${edge.to}) skipped (already connected)`,
          nodeCount,
          edges,
          activeNodes: [edge.from, edge.to],
          treeEdges,
          table: {
            rowLabels: ["parent", "rank"],
            colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
            values: [dsu.parent.map(String), dsu.rank.map(String)],
          },
        }),
      );
    }
  }

  steps.push(
    graphStep({
      array: treeEdges.map(([u, v]) => `${u}-${v}`),
      note: "Union-Find operations complete",
      nodeCount,
      edges,
      treeEdges,
      table: {
        rowLabels: ["parent", "rank"],
        colLabels: Array.from({ length: nodeCount }, (_, i) => String(i)),
        values: [dsu.parent.map(String), dsu.rank.map(String)],
      },
    }),
  );

  return steps;
};

const knapsackSteps = ({ weightsInput, valuesInput, capacityInput }) => {
  const weights = parseInputValues(weightsInput).numericItems;
  const values = parseInputValues(valuesInput).numericItems;
  const capacity = Number(capacityInput);

  if (!Number.isInteger(capacity) || capacity < 1) {
    return { error: "Capacity must be a positive integer.", steps: [] };
  }

  if (
    weights.length < 1 ||
    values.length < 1 ||
    weights.length !== values.length
  ) {
    return {
      error:
        "Weights and values must be numeric lists of equal non-zero length.",
      steps: [],
    };
  }

  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const steps = [
    {
      array: dp[n],
      highlights: [],
      note: "Initialize DP table with zeros",
      table: {
        rowLabels: Array.from({ length: n + 1 }, (_, i) => `i=${i}`),
        colLabels: Array.from({ length: capacity + 1 }, (_, c) => String(c)),
        values: clone2D(dp).map((row) => row.map(String)),
      },
    },
  ];

  for (let i = 1; i <= n; i += 1) {
    for (let w = 0; w <= capacity; w += 1) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
        );
      }

      steps.push({
        array: dp[i],
        highlights: [w],
        note: `Fill dp[${i}][${w}] using item ${i} (weight=${weights[i - 1]}, value=${values[i - 1]})`,
        table: {
          rowLabels: Array.from({ length: n + 1 }, (_, idx) => `i=${idx}`),
          colLabels: Array.from({ length: capacity + 1 }, (_, c) => String(c)),
          values: clone2D(dp).map((row) => row.map(String)),
        },
      });
    }
  }

  steps.push({
    array: dp[n],
    highlights: [capacity],
    note: `Optimal value is ${dp[n][capacity]}`,
    table: {
      rowLabels: Array.from({ length: n + 1 }, (_, idx) => `i=${idx}`),
      colLabels: Array.from({ length: capacity + 1 }, (_, c) => String(c)),
      values: clone2D(dp).map((row) => row.map(String)),
    },
  });

  return { error: "", steps };
};

const lcsSteps = ({ firstString, secondString }) => {
  const a = String(firstString || "").trim();
  const b = String(secondString || "").trim();

  if (!a || !b) {
    return { error: "Provide both strings for LCS simulation.", steps: [] };
  }

  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const steps = [
    {
      array: a.split(""),
      highlights: [],
      note: "Initialize LCS table with zeros",
      table: {
        rowLabels: [" ", ...a.split("")],
        colLabels: [" ", ...b.split("")],
        values: clone2D(dp).map((row) => row.map(String)),
      },
    },
  ];

  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          array: a.split(""),
          highlights: [i - 1],
          note: `Match '${a[i - 1]}' at (${i}, ${j}), take diagonal + 1`,
          table: {
            rowLabels: [" ", ...a.split("")],
            colLabels: [" ", ...b.split("")],
            values: clone2D(dp).map((row) => row.map(String)),
          },
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          array: a.split(""),
          highlights: [i - 1],
          note: `Mismatch at (${i}, ${j}), use max(top, left)`,
          table: {
            rowLabels: [" ", ...a.split("")],
            colLabels: [" ", ...b.split("")],
            values: clone2D(dp).map((row) => row.map(String)),
          },
        });
      }
    }
  }

  steps.push({
    array: a.split(""),
    highlights: [],
    note: `LCS length is ${dp[n][m]}`,
    table: {
      rowLabels: [" ", ...a.split("")],
      colLabels: [" ", ...b.split("")],
      values: clone2D(dp).map((row) => row.map(String)),
    },
  });

  return { error: "", steps };
};

const buildLinearSteps = (items, notes, title) => {
  const source = items.length ? items : ["A", "B", "C", "D"];
  const steps = [cloneStep(source, [], `Initial state for ${title}`)];

  notes.forEach((note, index) => {
    const highlight = source.length ? [index % source.length] : [];
    steps.push(cloneStep(source, highlight, note));
  });

  steps.push(cloneStep(source, [], `${title} complete`));
  return steps;
};

const binarySearchSteps = (numbers, target) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const steps = [
    cloneStep(sorted, [], `Sorted input, target set to ${target}`),
  ];

  let left = 0;
  let right = sorted.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(cloneStep(sorted, [mid], `Check middle index ${mid}`));

    if (sorted[mid] === target) {
      steps.push(cloneStep(sorted, [mid], `Target ${target} found`));
      break;
    }

    if (sorted[mid] < target) {
      left = mid + 1;
      steps.push(cloneStep(sorted, [left], "Target is on the right half"));
    } else {
      right = mid - 1;
      steps.push(cloneStep(sorted, [right], "Target is on the left half"));
    }
  }

  if (left > right) {
    steps.push(cloneStep(sorted, [], `Target ${target} not found`));
  }

  return steps;
};

const ternarySearchSteps = (numbers, target) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const steps = [
    cloneStep(sorted, [], `Sorted input, target set to ${target}`),
  ];

  let left = 0;
  let right = sorted.length - 1;

  while (left <= right) {
    const third = Math.floor((right - left) / 3);
    const mid1 = left + third;
    const mid2 = right - third;

    steps.push(
      cloneStep(sorted, [mid1, mid2], `Check mid points ${mid1} and ${mid2}`),
    );

    if (sorted[mid1] === target || sorted[mid2] === target) {
      const found = sorted[mid1] === target ? mid1 : mid2;
      steps.push(cloneStep(sorted, [found], `Target ${target} found`));
      break;
    }

    if (target < sorted[mid1]) {
      right = mid1 - 1;
      steps.push(cloneStep(sorted, [right], "Target is in the left third"));
    } else if (target > sorted[mid2]) {
      left = mid2 + 1;
      steps.push(cloneStep(sorted, [left], "Target is in the right third"));
    } else {
      left = mid1 + 1;
      right = mid2 - 1;
      steps.push(
        cloneStep(sorted, [left, right], "Target is in the middle third"),
      );
    }
  }

  if (left > right) {
    steps.push(cloneStep(sorted, [], `Target ${target} not found`));
  }

  return steps;
};

const graphAlgorithmIds = new Set([
  "bfs",
  "dfs",
  "dijkstra",
  "astar",
  "astar-path",
  "topological",
  "prim",
  "kruskal",
  "union-find",
]);

export const getSimulationInputSpec = (categoryId, algorithmId) => {
  if (algorithmId === "binary" || algorithmId === "ternary") {
    return { type: "numericSearch" };
  }

  if (algorithmId === "knapsack") {
    return { type: "knapsack" };
  }

  if (algorithmId === "lcs") {
    return { type: "lcs" };
  }

  if (graphAlgorithmIds.has(algorithmId)) {
    if (algorithmId === "topological") {
      return {
        type: "graph",
        weighted: false,
        directed: true,
        needsStart: false,
        needsTarget: false,
      };
    }

    if (algorithmId === "prim") {
      return {
        type: "graph",
        weighted: true,
        directed: false,
        needsStart: true,
        needsTarget: false,
      };
    }

    if (algorithmId === "kruskal" || algorithmId === "union-find") {
      return {
        type: "graph",
        weighted: algorithmId === "kruskal",
        directed: false,
        needsStart: false,
        needsTarget: false,
      };
    }

    return {
      type: "graph",
      weighted:
        algorithmId === "dijkstra" ||
        algorithmId === "astar" ||
        algorithmId === "astar-path",
      directed: false,
      needsStart: true,
      needsTarget:
        algorithmId === "dijkstra" ||
        algorithmId === "astar" ||
        algorithmId === "astar-path",
    };
  }

  if (categoryId === "sorting") {
    return { type: "numericList" };
  }

  return { type: "valueList" };
};

const generators = {
  knapsack: (items) =>
    buildLinearSteps(
      items,
      [
        "Build DP table for items vs capacity",
        "Decide include vs exclude for each state",
        "Store best achievable value per state",
        "Backtrack selected items from DP table",
      ],
      "0/1 Knapsack",
    ),
  lcs: (items) =>
    buildLinearSteps(
      items,
      [
        "Build DP table for sequence prefixes",
        "Match chars: diagonal + 1",
        "Mismatch chars: max(top, left)",
        "Trace back to construct subsequence",
      ],
      "LCS",
    ),
  lis: (items) =>
    buildLinearSteps(
      items,
      [
        "Initialize LIS length per index",
        "Compare current value with previous values",
        "Update best increasing length",
        "Take maximum length over all indices",
      ],
      "LIS",
    ),
  "coin-change": (items) =>
    buildLinearSteps(
      items,
      [
        "Initialize DP with base target 0",
        "Iterate through coin values",
        "Update reachable target states",
        "Read final answer at desired target",
      ],
      "Coin Change",
    ),
  "matrix-chain": (items) =>
    buildLinearSteps(
      items,
      [
        "Define cost for multiplying chain segments",
        "Try every split point for each segment",
        "Store minimum cost and split index",
        "Reconstruct optimal parenthesization",
      ],
      "Matrix Chain Multiplication",
    ),
  huffman: (items) =>
    buildLinearSteps(
      items,
      [
        "Insert frequencies into min-heap",
        "Extract two smallest nodes",
        "Merge them into a parent node",
        "Repeat until one root remains",
      ],
      "Huffman Coding",
    ),
  activity: (items) =>
    buildLinearSteps(
      items,
      [
        "Sort activities by finish time",
        "Select first finishing activity",
        "Skip overlapping activities",
        "Keep next compatible activity",
      ],
      "Activity Selection",
    ),
  "fractional-knapsack": (items) =>
    buildLinearSteps(
      items,
      [
        "Compute value/weight ratio",
        "Sort items by descending ratio",
        "Take full item when possible",
        "Take fractional part for remaining capacity",
      ],
      "Fractional Knapsack",
    ),
  inorder: (items) =>
    buildLinearSteps(
      items,
      [
        "Traverse left subtree",
        "Visit current node",
        "Traverse right subtree",
        "Combine visitation order",
      ],
      "Inorder Traversal",
    ),
  preorder: (items) =>
    buildLinearSteps(
      items,
      [
        "Visit current node",
        "Traverse left subtree",
        "Traverse right subtree",
        "Combine visitation order",
      ],
      "Preorder Traversal",
    ),
  postorder: (items) =>
    buildLinearSteps(
      items,
      [
        "Traverse left subtree",
        "Traverse right subtree",
        "Visit current node",
        "Combine visitation order",
      ],
      "Postorder Traversal",
    ),
  bst: (items) =>
    buildLinearSteps(
      items,
      [
        "Compare target with current node",
        "Move left or right by BST rule",
        "Insert or update when null/target found",
        "Rebalance if implementation requires",
      ],
      "BST Operations",
    ),
  lca: (items) =>
    buildLinearSteps(
      items,
      [
        "Start from root",
        "Check if targets split across subtrees",
        "Move toward side containing both targets",
        "First split/common point is LCA",
      ],
      "Lowest Common Ancestor",
    ),
  "astar-path": (items) =>
    buildLinearSteps(
      items,
      [
        "Initialize open set and scores",
        "Pick node with lowest f-score",
        "Update neighbors and path parents",
        "Reconstruct final path from goal",
      ],
      "A* Pathfinding",
    ),
  "greedy-best-first": (items) =>
    buildLinearSteps(
      items,
      [
        "Initialize frontier with start node",
        "Pick node with best heuristic",
        "Expand neighbors into frontier",
        "Stop when target is reached",
      ],
      "Greedy Best First Search",
    ),
  kmp: (items) =>
    buildLinearSteps(
      items,
      [
        "Build LPS (prefix) table for pattern",
        "Compare text and pattern characters",
        "Use LPS to skip redundant comparisons",
        "Report matched pattern positions",
      ],
      "KMP",
    ),
  "rabin-karp": (items) =>
    buildLinearSteps(
      items,
      [
        "Hash pattern and first window",
        "Slide window and update rolling hash",
        "Compare hashes before exact check",
        "Confirm and report matches",
      ],
      "Rabin-Karp",
    ),
  "n-queens": (items) =>
    buildLinearSteps(
      items,
      [
        "Place queen in current row",
        "Check column and diagonal safety",
        "Move to next row if safe",
        "Backtrack when no valid column exists",
      ],
      "N-Queens",
    ),
  sudoku: (items) =>
    buildLinearSteps(
      items,
      [
        "Pick next empty cell",
        "Try digits that satisfy constraints",
        "Move forward on valid placement",
        "Backtrack on contradiction",
      ],
      "Sudoku Solver",
    ),
};

export const buildAlgorithmSteps = ({
  categoryId,
  algorithmId,
  inputValue,
  searchTargetInput,
  nodeCount,
  edgeInput,
  startNode,
  targetNode,
  weightsInput,
  valuesInput,
  capacityInput,
  firstString,
  secondString,
}) => {
  const spec = getSimulationInputSpec(categoryId, algorithmId);

  if (spec.type === "graph") {
    const parsedNodeCount = Number(nodeCount);
    const parsedStartNode = Number(startNode);
    const parsedTargetNode = Number(targetNode);
    const parsedEdgeInput = String(edgeInput || "");

    if (!Number.isInteger(parsedNodeCount) || parsedNodeCount < 2) {
      return {
        error: "Node count must be an integer greater than 1.",
        steps: [],
      };
    }

    if (
      spec.needsStart &&
      (!Number.isInteger(parsedStartNode) ||
        parsedStartNode < 0 ||
        parsedStartNode >= parsedNodeCount)
    ) {
      return {
        error: `Start node must be between 0 and ${parsedNodeCount - 1}.`,
        steps: [],
      };
    }

    if (
      spec.needsTarget &&
      (!Number.isInteger(parsedTargetNode) ||
        parsedTargetNode < 0 ||
        parsedTargetNode >= parsedNodeCount)
    ) {
      return {
        error: `Target node must be between 0 and ${parsedNodeCount - 1}.`,
        steps: [],
      };
    }

    const parsedEdges = parseGraphEdges(
      parsedEdgeInput,
      parsedNodeCount,
      spec.weighted,
    );
    if (parsedEdges.error) {
      return { error: parsedEdges.error, steps: [] };
    }

    if (!parsedEdges.edges.length) {
      return {
        error: "Provide at least one edge (example: 0 1 or 0 1 4).",
        steps: [],
      };
    }

    if (algorithmId === "bfs") {
      return {
        error: "",
        steps: bfsSteps({
          nodeCount: parsedNodeCount,
          edges: parsedEdges.edges,
          startNode: parsedStartNode,
        }),
      };
    }

    if (algorithmId === "dfs") {
      return {
        error: "",
        steps: dfsSteps({
          nodeCount: parsedNodeCount,
          edges: parsedEdges.edges,
          startNode: parsedStartNode,
        }),
      };
    }

    if (algorithmId === "dijkstra") {
      return {
        error: "",
        steps: dijkstraSteps({
          nodeCount: parsedNodeCount,
          edges: parsedEdges.edges,
          startNode: parsedStartNode,
          targetNode: parsedTargetNode,
        }),
      };
    }

    if (algorithmId === "topological") {
      return {
        error: "",
        steps: topologicalSortSteps({
          nodeCount: parsedNodeCount,
          edges: parsedEdges.edges,
        }),
      };
    }

    if (algorithmId === "prim") {
      return {
        error: "",
        steps: primSteps({
          nodeCount: parsedNodeCount,
          edges: parsedEdges.edges,
          startNode: parsedStartNode,
        }),
      };
    }

    if (algorithmId === "kruskal") {
      return {
        error: "",
        steps: kruskalSteps({
          nodeCount: parsedNodeCount,
          edges: parsedEdges.edges,
        }),
      };
    }

    if (algorithmId === "union-find") {
      return {
        error: "",
        steps: unionFindSteps({
          nodeCount: parsedNodeCount,
          edges: parsedEdges.edges,
        }),
      };
    }

    return {
      error: "",
      steps: aStarSteps({
        nodeCount: parsedNodeCount,
        edges: parsedEdges.edges,
        startNode: parsedStartNode,
        targetNode: parsedTargetNode,
      }),
    };
  }

  if (spec.type === "knapsack") {
    return knapsackSteps({ weightsInput, valuesInput, capacityInput });
  }

  if (spec.type === "lcs") {
    return lcsSteps({ firstString, secondString });
  }

  const { rawItems, numericItems, isNumeric } = parseInputValues(inputValue);

  if (categoryId === "sorting") {
    if (!isNumeric || numericItems.length < 2) {
      return {
        error: "Enter at least 2 numbers separated by commas or spaces.",
        steps: [],
      };
    }

    if (algorithmId === "binary") {
      const target = Number(searchTargetInput);
      if (!Number.isFinite(target)) {
        return {
          error: "Enter a numeric target value for Binary Search.",
          steps: [],
        };
      }

      return { error: "", steps: binarySearchSteps(numericItems, target) };
    }

    if (algorithmId === "ternary") {
      const target = Number(searchTargetInput);
      if (!Number.isFinite(target)) {
        return {
          error: "Enter a numeric target value for Ternary Search.",
          steps: [],
        };
      }

      return { error: "", steps: ternarySearchSteps(numericItems, target) };
    }

    return { error: "", steps: buildSortingSteps(algorithmId, numericItems) };
  }

  if (rawItems.length < 2) {
    return {
      error: "Enter at least 2 values separated by commas or spaces.",
      steps: [],
    };
  }

  const generator = generators[algorithmId];
  if (!generator) {
    return {
      error: "Simulation is not available for this algorithm yet.",
      steps: [],
    };
  }

  return { error: "", steps: generator(rawItems) };
};
