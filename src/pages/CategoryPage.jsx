import { Link, useParams } from "react-router-dom";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { categoryCatalog } from "../data/categoryAlgorithms";
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

const CategoryPage = () => {
  const { categoryId } = useParams();
  const shouldReduceMotion = useReducedMotion();
  const category = categoryCatalog[categoryId];

  if (!category) {
    return (
      <main className="sorting-page">
        <div className="sorting-inner">
          <h1>Category not found</h1>
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
        <Motion.header
          className="sorting-hero"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="sorting-back">
            Back to categories
          </Link>
          <h1>{category.title}</h1>
          <p>{category.subtitle}</p>
        </Motion.header>

        <Motion.section
          className="sorting-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {category.algorithms.map((algorithm) => (
            <Motion.div key={algorithm.id} variants={itemVariants}>
              <Link
                to={`/${categoryId}/${algorithm.id}`}
                className="sorting-card sorting-card-link"
              >
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

export default CategoryPage;
