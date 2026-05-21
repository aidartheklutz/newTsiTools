import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage/HomePage";
import GpaCalc from "./pages/GpaCalc/GpaCalc";
import { FreshmenCalc } from "./pages/GpaCalc/FreshmenCalc";
import { ExcuseGen } from "./pages/ExcuseGen/ExcuseGen";
import { SecretCode } from "./pages/SecretCode/SecretCode";
import NotFound from "./pages/NotFound/NotFound";

// <Route path='' element={<HomePage />} />

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="gpa" element={<GpaCalc />} />
      <Route path="gpa/freshmen" element={<FreshmenCalc />} />
      <Route path="excusegen" element={<ExcuseGen />} />;
      <Route path="KINGSMAN" element={<SecretCode />} />;
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

// <Route path="*" element={<NotFound />} />
//
