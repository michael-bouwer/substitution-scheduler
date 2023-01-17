import './HeaderNav.scss';

import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {};

const HeaderNav = (props: Props) => {
  return (
    <div className="header-nav">
      <section>
        <p className="title">HeaderNav</p>
      </section>
      <section>
        <Link to="/home">
          <Button>Hello</Button>
        </Link>
        <Link to="/goodbye">
          <Button>Good Bye</Button>
        </Link>
        <Link to="/">
          <Button>Admin</Button>
        </Link>
      </section>
    </div>
  );
};

export default HeaderNav;
