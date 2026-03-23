import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { sortingAlgorithms } from "../data/sortingAlgorithms";
import "../styles/sorting.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const Sorting = () => {
  const shouldReduceMotion = useReducedMotion();
  const sortingOnly = sortingAlgorithms.filter(
    (algorithm) => algorithm.category === "Sorting",
  );

  return (
    <main className="sorting-page">
      <div className="sorting-inner">
        <Motion.header
          className="sorting-hero"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="sorting-back">
            Back to categories
          </Link>
          <h1>Sorting and Searching</h1>
          <p>
            Core algorithms in this category with quick, practical summaries.
          </p>
        </Motion.header>

        <Motion.section
          className="sorting-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortingOnly.map((algorithm) => (
            <Motion.div key={algorithm.id} variants={itemVariants}>
              <Link
                to={`/sorting/${algorithm.id}`}
                className="sorting-card sorting-card-link"
              >
                <p className="sorting-tag">{algorithm.category}</p>
                <h2>{algorithm.name}</h2>
                <p>{algorithm.detail}</p>
              </Link>
            </Motion.div>
          ))}
        </Motion.section>
      </div>
    </main>
  );
};

export default Sorting;
