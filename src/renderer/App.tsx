import './App.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
} from '@mui/material';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import Admin from './pages/Admin';
import HeaderNav from './components/HeaderNav';

const Hello = () => {
  return <div className="test">as</div>;
};

const Goodbye = () => {
  return <div>Goodbye</div>;
};

export default function App() {
  return (
    <Router>
      <Box className="app">
        <CssBaseline />
        <HeaderNav />
        <Box className="content">
          <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="/home" element={<Hello />} />
            <Route path="/goodbye" element={<Goodbye />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
