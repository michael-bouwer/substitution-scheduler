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
import Providers from './Providers';
import SubstitutionSchedule from './pages/SubstitutionSchedule';
import Timetable from './pages/Timetable';

const Hello = () => {
  return <div className="test">as</div>;
};

const Goodbye = () => {
  return <div>Goodbye</div>;
};

export default function App() {
  return (
    <Router>
      <Providers>
        <Box className="app">
          <CssBaseline />
          <HeaderNav />
          <Box className="content">
            <Routes>
              <Route path="/" element={<Admin />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/sub-sched" element={<SubstitutionSchedule />} />
            </Routes>
          </Box>
        </Box>
      </Providers>
    </Router>
  );
}
