import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  categoryCatalog,
  getAlgorithmByCategory,
} from "../data/categoryAlgorithms";
import {
  buildAlgorithmSteps,
  getSimulationInputSpec,
  parseInputValues,
} from "../utils/algorithmSimulations";
import "../styles/sorting.css";

const defaultInputForCategory = (categoryId) => {
  if (categoryId === "sorting") {
    return "9, 4, 7, 2, 6, 1, 5";
  }

  if (
    categoryId === "graphs" ||
    categoryId === "pathfinding" ||
    categoryId === "tree"
  ) {
    return "A, B, C, D, E";
  }

  if (categoryId === "string") {
    return "text, pattern, sample";
  }

  return "item1, item2, item3, item4";
};

const AlgorithmSimulation = () => {
  const { categoryId, algorithmId } = useParams();
  const category = categoryCatalog[categoryId];
  const algorithm = getAlgorithmByCategory(categoryId, algorithmId);
  const inputSpec = getSimulationInputSpec(categoryId, algorithmId);

  const [inputValue, setInputValue] = useState(
    defaultInputForCategory(categoryId),
  );
  const [searchTargetInput, setSearchTargetInput] = useState("6");
  const [nodeCount, setNodeCount] = useState("6");
  const [edgeInput, setEdgeInput] = useState("0 1\n0 2\n1 3\n2 4\n3 5\n4 5");
  const [startNode, setStartNode] = useState("0");
  const [targetNode, setTargetNode] = useState("5");
  const [weightsInput, setWeightsInput] = useState("2, 3, 4, 5");
  const [valuesInput, setValuesInput] = useState("3, 4, 5, 8");
  const [capacityInput, setCapacityInput] = useState("8");
  const [firstString, setFirstString] = useState("ABCDGH");
  const [secondString, setSecondString] = useState("AEDFHR");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  const currentStep = steps[stepIndex];
  const parsed = useMemo(() => parseInputValues(inputValue), [inputValue]);
  const isNumericView = currentStep?.array?.every(
    (value) => typeof value === "number",
  );
  const shouldRenderGraph = Boolean(currentStep?.graph);
  const tableData = currentStep?.table;

  const maxValue = useMemo(() => {
    if (!isNumericView || !currentStep?.array?.length) {
      return 1;
    }

    return Math.max(...currentStep.array.map((num) => Math.abs(num)), 1);
  }, [currentStep, isNumericView]);

  const generateSimulation = () => {
    const result = buildAlgorithmSteps({
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
    });

    if (result.error) {
      setError(result.error);
      setSteps([]);
      setStepIndex(0);
      setIsPlaying(false);
      return;
    }

    if (!result.steps.length) {
      setError("Simulation is not available for this algorithm yet.");
      setSteps([]);
      setStepIndex(0);
      setIsPlaying(false);
      return;
    }

    setError("");
    setSteps(result.steps);
    setStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    setInputValue(defaultInputForCategory(categoryId));
    setNodeCount("6");
    setEdgeInput(
      inputSpec.weighted
        ? "0 1 4\n0 2 2\n1 3 3\n2 3 1\n2 4 6\n3 5 2\n4 5 4"
        : "0 1\n0 2\n1 3\n2 4\n3 5\n4 5",
    );
    setSearchTargetInput("6");
    setStartNode("0");
    setTargetNode("5");
  }, [categoryId, algorithmId, inputSpec.weighted]);

  useEffect(() => {
    generateSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, algorithmId]);

  useEffect(() => {
    if (!isPlaying || !steps.length) {
      return undefined;
    }

    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, 950);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps]);

  const graphPositions = useMemo(() => {
    if (!shouldRenderGraph) {
      return [];
    }

    const n = currentStep.graph.nodeCount;
    const width = 580;
    const height = 280;
    const radius = Math.min(width, height) * 0.38;
    const cx = width / 2;
    const cy = height / 2;

    return Array.from({ length: n }, (_, idx) => {
      const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }, [currentStep, shouldRenderGraph]);

  const treeEdgeSet = useMemo(() => {
    if (!shouldRenderGraph) {
      return new Set();
    }

    return new Set(
      currentStep.graph.treeEdges.map(
        ([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`,
      ),
    );
  }, [currentStep, shouldRenderGraph]);

  if (!category || !algorithm) {
    return (
      <main className="sorting-page">
        <div className="sorting-inner">
          <h1>Algorithm not found</h1>
          <Link to="/" className="sorting-back">
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="sorting-page">
      <div className="sorting-inner">
        <header className="sorting-hero sorting-sim-hero">
          <Link to={`/${categoryId}`} className="sorting-back">
            Back to {category.title}
          </Link>
          <h1>{algorithm.name} Simulation</h1>
          <p>{algorithm.detail}</p>
        </header>

        <section className="sim-controls">
          {inputSpec.type === "graph" ? (
            <div className="sim-form-grid">
              <div>
                <label htmlFor="nodeCount">Number of nodes</label>
                <input
                  id="nodeCount"
                  type="number"
                  min="2"
                  value={nodeCount}
                  onChange={(event) => setNodeCount(event.target.value)}
                />
              </div>

              {inputSpec.needsStart && (
                <div>
                  <label htmlFor="startNode">Start node</label>
                  <input
                    id="startNode"
                    type="number"
                    min="0"
                    value={startNode}
                    onChange={(event) => setStartNode(event.target.value)}
                  />
                </div>
              )}

              {inputSpec.needsTarget && (
                <div>
                  <label htmlFor="targetNode">Target node</label>
                  <input
                    id="targetNode"
                    type="number"
                    min="0"
                    value={targetNode}
                    onChange={(event) => setTargetNode(event.target.value)}
                  />
                </div>
              )}

              <div className="sim-span-all">
                <label htmlFor="edgeInput">
                  Edges (
                  {inputSpec.weighted ? "u v w per line" : "u v per line"})
                  {inputSpec.directed ? " directed" : " undirected"}
                </label>
                <textarea
                  id="edgeInput"
                  value={edgeInput}
                  onChange={(event) => setEdgeInput(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {inputSpec.type === "knapsack" ? (
            <div className="sim-form-grid">
              <div>
                <label htmlFor="weightsInput">Weights</label>
                <input
                  id="weightsInput"
                  value={weightsInput}
                  onChange={(event) => setWeightsInput(event.target.value)}
                  placeholder="2, 3, 4, 5"
                />
              </div>
              <div>
                <label htmlFor="valuesInput">Values</label>
                <input
                  id="valuesInput"
                  value={valuesInput}
                  onChange={(event) => setValuesInput(event.target.value)}
                  placeholder="3, 4, 5, 8"
                />
              </div>
              <div>
                <label htmlFor="capacityInput">Capacity</label>
                <input
                  id="capacityInput"
                  value={capacityInput}
                  onChange={(event) => setCapacityInput(event.target.value)}
                  placeholder="8"
                />
              </div>
            </div>
          ) : null}

          {inputSpec.type === "lcs" ? (
            <div className="sim-form-grid">
              <div>
                <label htmlFor="firstString">String 1</label>
                <input
                  id="firstString"
                  value={firstString}
                  onChange={(event) => setFirstString(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="secondString">String 2</label>
                <input
                  id="secondString"
                  value={secondString}
                  onChange={(event) => setSecondString(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {inputSpec.type === "valueList" ||
          inputSpec.type === "numericList" ? (
            <>
              <label htmlFor="inputValues">
                Input values{" "}
                {parsed.isNumeric ? "(numeric mode)" : "(text mode)"}
              </label>
              <input
                id="inputValues"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Use comma or space separated values"
              />
            </>
          ) : null}

          {inputSpec.type === "numericSearch" ? (
            <div className="sim-form-grid">
              <div>
                <label htmlFor="inputValues">Input values (numeric list)</label>
                <input
                  id="inputValues"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Example: 9, 4, 7, 2, 6, 1"
                />
              </div>
              <div>
                <label htmlFor="searchTarget">Target value</label>
                <input
                  id="searchTarget"
                  value={searchTargetInput}
                  onChange={(event) => setSearchTargetInput(event.target.value)}
                  placeholder="Example: 7"
                />
              </div>
            </div>
          ) : null}

          <div className="sim-actions">
            <button type="button" onClick={generateSimulation}>
              Simulate
            </button>
            <button
              type="button"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={!steps.length || stepIndex === 0}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))
              }
              disabled={!steps.length || stepIndex >= steps.length - 1}
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              disabled={!steps.length || stepIndex >= steps.length - 1}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>

          {error && <p className="sim-error">{error}</p>}
        </section>

        <section className="sim-stage">
          <div className="sim-meta">
            <p>
              Step {steps.length ? stepIndex + 1 : 0} / {steps.length}
            </p>
            <p>{currentStep?.note || "No simulation data"}</p>
          </div>

          {shouldRenderGraph ? (
            <div className="sim-graph-wrap">
              <svg viewBox="0 0 580 280" className="sim-graph" role="img">
                {currentStep.graph.edges.map((edge, idx) => {
                  const a = graphPositions[edge.from];
                  const b = graphPositions[edge.to];
                  const key = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
                  const isTree = treeEdgeSet.has(key);

                  return (
                    <g key={`${edge.from}-${edge.to}-${idx}`}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        className={
                          isTree ? "sim-edge sim-edge-tree" : "sim-edge"
                        }
                      />
                      {edge.weight !== 1 && (
                        <text
                          x={(a.x + b.x) / 2}
                          y={(a.y + b.y) / 2 - 6}
                          className="sim-edge-label"
                        >
                          {edge.weight}
                        </text>
                      )}
                    </g>
                  );
                })}

                {graphPositions.map((pos, idx) => {
                  const isActive = currentStep.graph.activeNodes.includes(idx);
                  const isVisited =
                    currentStep.graph.visitedNodes.includes(idx);

                  return (
                    <g key={idx}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="16"
                        className={`sim-node ${isVisited ? "is-visited" : ""} ${
                          isActive ? "is-active" : ""
                        }`}
                      />
                      <text x={pos.x} y={pos.y + 5} className="sim-node-label">
                        {idx}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : isNumericView ? (
            <div className="sim-bars">
              {currentStep?.array?.map((value, index) => {
                const heightPercent = (Math.abs(value) / maxValue) * 100;
                const isHighlight = currentStep.highlights.includes(index);

                return (
                  <Motion.div
                    key={`${index}-${value}-${stepIndex}`}
                    className={`sim-bar ${isHighlight ? "is-highlight" : ""}`}
                    style={{ height: `${Math.max(12, heightPercent)}%` }}
                    layout
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <span>{value}</span>
                  </Motion.div>
                );
              })}
            </div>
          ) : (
            <div className="sim-tokens">
              {currentStep?.array?.map((value, index) => (
                <div
                  key={`${value}-${index}-${stepIndex}`}
                  className={`sim-token ${
                    currentStep.highlights.includes(index) ? "is-highlight" : ""
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          )}

          {tableData ? (
            <div className="sim-table-wrap">
              <table className="sim-table">
                <thead>
                  <tr>
                    <th />
                    {tableData.colLabels.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.values.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <th>{tableData.rowLabels[rowIndex]}</th>
                      {row.map((cell, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="sim-explanations">
          <h2>Step Explanations</h2>
          {!steps.length ? (
            <p className="sim-empty">
              Generate a simulation to see detailed steps.
            </p>
          ) : (
            <ol>
              {steps.map((step, index) => (
                <li
                  key={`${step.note}-${index}`}
                  className={index === stepIndex ? "is-active" : ""}
                >
                  <p>
                    <strong>Step {index + 1}:</strong>{" "}
                    {step.note || "State update"}
                  </p>
                  <p className="sim-state">[{step.array.join(", ")}]</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
};

export default AlgorithmSimulation;
