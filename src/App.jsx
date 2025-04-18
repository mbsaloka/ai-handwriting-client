import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import CustomStylePage from './pages/CustomStylePage';
import { StyleProvider } from './context/StyleContext';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <StyleProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="generator" element={<GeneratorPage />} />
              <Route path="custom-style" element={<CustomStylePage />} />
            </Route>
          </Routes>
        </Router>
      </StyleProvider>
    </ThemeProvider>
  );
}