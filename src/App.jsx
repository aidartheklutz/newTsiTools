import { Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import { HomePage } from "./pages/HomePage/HomePage";
import GpaCalc from "./pages/GpaCalc/GpaCalc";
import { FreshmenCalc } from "./pages/GpaCalc/FreshmenCalc";
import { ExcuseGen } from "./pages/ExcuseGen/ExcuseGen";
import { WordCounter } from "./pages/WordCounter/WordCounter";
import { TeamDiv } from "./pages/TeamDiv/TeamDiv";
import AffirmationsPage from "./pages/AffirmationsPage/AffirmationsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import { SecretCode } from "./pages/SecretCode/SecretCode";
import QrGen from "./pages/QrGen/QrGen";
import NotFound from "./pages/NotFound/NotFound";

// <Route path='' element={<HomePage />} />

function App() {
  return (
    <>
      <Analytics />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="gpa" element={<GpaCalc />} />
        <Route path="gpa/freshmen" element={<FreshmenCalc />} />
        <Route path="excusegen" element={<ExcuseGen />} />;
        <Route path="wordcounter" element={<WordCounter />} />
        <Route path="teamdiv" element={<TeamDiv />} />
        <Route path="affirmations" element={<AffirmationsPage />} />
        <Route path="qrgen" element={<QrGen />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="KINGSMAN" element={<SecretCode />} />;
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

// <Route path="*" element={<NotFound />} />
//
