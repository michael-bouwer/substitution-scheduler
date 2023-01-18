import './HeaderNav.scss';

import { Button, IconButton } from '@mui/material';

import { Link } from 'react-router-dom';
import { Settings } from '@mui/icons-material';

type Props = {};

const HeaderNav = (props: Props) => {
  return (
    <div className="header-nav">
      <section>
        <p className="title">HeaderNav</p>
      </section>
      <section>
        <Link to="/timetable">
          <Button>Timetable</Button>
        </Link>
        <Link to="/sub-sched">
          <Button>Free Periods</Button>
        </Link>
        <Link to="/">
          <IconButton>
            <Settings  color='warning'/>
          </IconButton>
        </Link>
      </section>
    </div>
  );
};

export default HeaderNav;
