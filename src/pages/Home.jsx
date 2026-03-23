import AlgoCard from "../components/AlgoCard";
import { algorithms } from "../data/algorithms";
import { motion as Motion, useReducedMotion } from "framer-motion";

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const Home = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="home">
      <div className="home-bg home-bg-one" aria-hidden="true" />
      <div className="home-bg home-bg-two" aria-hidden="true" />

      <div className="home-inner">
        <Motion.section
          className="hero"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">Interactive</p>
          <h1>Algorithm Visualizer</h1>
          <p className="hero-copy">Learn by seeing algorithms in motion.</p>
        </Motion.section>

        <Motion.section
          className="grid"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {algorithms.map((algo, index) => (
            <Motion.div key={algo.path ?? index} variants={itemVariants}>
              <AlgoCard {...algo} />
            </Motion.div>
          ))}
        </Motion.section>
      </div>
    </main>
  );
};

export default Home;
