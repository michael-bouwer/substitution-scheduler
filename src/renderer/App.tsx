import './App.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Box, CssBaseline } from '@mui/material';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import Admin from './pages/Admin';
import FreePeriods from './pages/FreePeriods';
import HeaderNav from './components/HeaderNav';
import Providers from './Providers';
import Timetable from './pages/Timetable';

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
              <Route path="/sub-sched" element={<FreePeriods />} />
            </Routes>
          </Box>
        </Box>
      </Providers>
    </Router>
  );
}
