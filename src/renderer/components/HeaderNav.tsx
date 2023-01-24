import './HeaderNav.scss';

import { Button, IconButton, Typography } from '@mui/material';

import { Link } from 'react-router-dom';
import { Settings } from '@mui/icons-material';
import { useState } from 'react';

type Props = {};

const HeaderNav = (props: Props) => {
  const [page, setPage] = useState('Settings');
  return (
    <div className="header-nav">
      <section style={{ alignSelf: 'center' }}>
        <Typography variant="h1">{page}</Typography>
      </section>
      <section>
        <Link to="/timetable">
          <Button onClick={() => setPage('Timetable')}>Timetable</Button>
        </Link>
        <Link to="/sub-sched">
          <Button onClick={() => setPage('Free Periods')}>Free Periods</Button>
        </Link>
        <Link to="/">
          <IconButton onClick={() => setPage('Settings')}>
            <Settings color="warning" />
          </IconButton>
        </Link>
      </section>
    </div>
  );
};

export default HeaderNav;
