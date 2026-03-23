import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const AlgoCard = ({ title, includes = [], path }) => {
  const navigate = useNavigate();
  const countLabel = `${includes.length} algorithm${includes.length === 1 ? "" : "s"}`;

  return (
    <Motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(path)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(path);
        }
      }}
    >
      <p className="card-kicker">Category</p>
      <h2>{title}</h2>
      <p className="card-count">{countLabel}</p>
      <span className="card-cta">
        Explore
        <ArrowUpRight size={18} aria-hidden="true" />
      </span>
    </Motion.div>
  );
};

export default AlgoCard;
