import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { sortingAlgorithms } from "../data/sortingAlgorithms";
import { buildSortingSteps } from "../utils/sortingSimulations";
import "../styles/sorting.css";

const parseInput = (value) =>
  value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((num) => Number.isFinite(num));

const SortingSimulation = () => {
  const { algorithmId } = useParams();
  const algorithm = sortingAlgorithms.find((item) => item.id === algorithmId);

  const [inputValue, setInputValue] = useState("9, 4, 7, 2, 6, 1, 5");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  const currentStep = steps[stepIndex];

  const maxValue = useMemo(() => {
    if (!currentStep?.array?.length) {
      return 1;
    }

    return Math.max(...currentStep.array.map((num) => Math.abs(num)), 1);
  }, [currentStep]);

  const generateSimulation = () => {
    const numbers = parseInput(inputValue);

    if (numbers.length < 2) {
      setError("Enter at least 2 numbers separated by commas or spaces.");
      setSteps([]);
      setStepIndex(0);
      setIsPlaying(false);
      return;
    }

    const builtSteps = buildSortingSteps(algorithmId, numbers);

    if (!builtSteps.length) {
      setError("Simulation is not available for this algorithm yet.");
      setSteps([]);
      setStepIndex(0);
      setIsPlaying(false);
      return;
    }

    setError("");
    setSteps(builtSteps);
    setStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmId]);

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

  if (!algorithm) {
    return (
      <main className="sorting-page">
        <div className="sorting-inner">
          <h1>Algorithm not found</h1>
          <Link to="/sorting" className="sorting-back">
            Back to sorting list
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="sorting-page">
      <div className="sorting-inner">
        <header className="sorting-hero sorting-sim-hero">
          <Link to="/sorting" className="sorting-back">
            Back to sorting list
          </Link>
          <h1>{algorithm.name} Simulation</h1>
          <p>{algorithm.detail}</p>
        </header>

        <section className="sim-controls">
          <label htmlFor="inputValues">Input values</label>
          <input
            id="inputValues"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Example: 9, 4, 7, 2, 6, 1"
          />

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

export default SortingSimulation;
