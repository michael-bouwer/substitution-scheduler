import './Admin.scss';

import { Box, Container, Paper, Tab, Tabs, Typography } from '@mui/material';

import DB from 'renderer/components/DB';
import React from 'react';
import Subjects from 'renderer/components/Subjects';
import Teachers from 'renderer/components/Teachers';

type Props = {};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Admin = (props: Props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Container className="admin">
      <Paper elevation={12}>
        {/* <h1>Admin Tools</h1> */}
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'background.paper',
            display: 'flex',
            borderRadius: '4px',
            margin: '32px 0',
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="Teachers" {...a11yProps(0)} />
            <Tab label="Subjects" {...a11yProps(1)} />
            <Tab label="Reset Data" {...a11yProps(2)} />
            {/* <Tab label="Item Four" {...a11yProps(3)} />
          <Tab label="Item Five" {...a11yProps(4)} />
          <Tab label="Item Six" {...a11yProps(5)} />
          <Tab label="Item Seven" {...a11yProps(6)} /> */}
          </Tabs>
          <TabPanel value={value} index={0}>
            <Teachers />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Subjects />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <DB />
          </TabPanel>
          <TabPanel value={value} index={3}>
            Item Four
          </TabPanel>
          <TabPanel value={value} index={4}>
            Item Five
          </TabPanel>
          <TabPanel value={value} index={5}>
            Item Six
          </TabPanel>
          <TabPanel value={value} index={6}>
            Item Seven
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default Admin;
