import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import AlgorithmSimulation from "./pages/AlgorithmSimulation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:categoryId" element={<CategoryPage />} />
        <Route
          path="/:categoryId/:algorithmId"
          element={<AlgorithmSimulation />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
