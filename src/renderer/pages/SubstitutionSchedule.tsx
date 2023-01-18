import './Shared.scss';

import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { DOW, Teacher } from 'renderer/Types';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { Add } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { modalStyle } from 'renderer/lib';
import { styled } from '@mui/material/styles';
import { useApp } from 'renderer/Providers';
import { useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    // border: '1px solid gray'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Monday', 159, 6.0, 24, 4.0),
  createData('Tuesday', 237, 9.0, 37, 4.3),
  createData('Wednesday', 262, 16.0, 24, 6.0),
  createData('Thursday', 305, 3.7, 67, 4.3),
  createData('Firday', 356, 16.0, 49, 3.9),
];

const SubstitutionSchedule = () => {
  const { teachers } = useApp();
  const [isOpenAddEntry, setIsOpenAddEntry] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>(
    undefined
  );
  const [dow, setDow] = useState<DOW>();
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  const handleMultiSelectChange = (
    event: SelectChangeEvent<typeof selectedPeriods>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedPeriods(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const resetFromModalDismiss = () => {
    setSelectedTeacher(undefined);
    setSelectedPeriods([]);
    setIsOpenAddEntry(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Day</StyledTableCell>
              <StyledTableCell align="center">1</StyledTableCell>
              <StyledTableCell align="center">2</StyledTableCell>
              <StyledTableCell align="center">3</StyledTableCell>
              <StyledTableCell align="center">4</StyledTableCell>
              <StyledTableCell align="center">5</StyledTableCell>
              <StyledTableCell align="center">6</StyledTableCell>
              <StyledTableCell align="center">7</StyledTableCell>
              <StyledTableCell align="center">8</StyledTableCell>
              <StyledTableCell align="center">9</StyledTableCell>
              <StyledTableCell align="center">10</StyledTableCell>
              <StyledTableCell align="center">11</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name} className="table-row">
                <StyledTableCell component="th" scope="row">
                  {row.name}{' '}
                  <IconButton
                    className="actions"
                    onClick={() => {
                      setDow(row.name as DOW);
                      setIsOpenAddEntry(true);
                    }}
                  >
                    <Add />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add an entry */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpenAddEntry}
        onClose={resetFromModalDismiss}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpenAddEntry}>
          <Box sx={modalStyle}>
            <>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Capture Free Period for a Teacher on {dow}.
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Select the teacher, day of the week and free period.
              </Typography>
            </>
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  my: 4,
                }}
              >
                <Grid container alignItems={'center'} direction="row">
                  <Grid item xs={6}>
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{
                        m: 1,
                        minWidth: 120,
                        margin: 'unset',
                        width: '90%',
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Teacher
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={selectedTeacher?.key}
                        onChange={(event: SelectChangeEvent) => {
                          const key = event?.target?.value;
                          teachers.find(
                            (t) => t && t.key === key && setSelectedTeacher(t)
                          );
                        }}
                        label="Teacher"
                        required
                        sx={{ my: 1 }}
                      >
                        {teachers.map((t) => (
                          <MenuItem
                            key={t.key}
                            value={t.key}
                          >{`${t.firstName} ${t.lastName}`}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{
                        m: 1,
                        minWidth: 120,
                        margin: 'unset',
                        width: '90%',
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Period(s)
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={selectedPeriods}
                        onChange={handleMultiSelectChange}
                        label="Teacher"
                        required
                        multiple
                        sx={{ my: 1 }}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {[
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '10',
                          '11',
                        ].map((p) => (
                          <MenuItem key={p} value={p}>
                            <Checkbox
                              checked={selectedPeriods.indexOf(p) > -1}
                            />
                            <ListItemText primary={p} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  float: 'right',
                  display: 'flex',
                  marginTop: '16px',
                  columnGap: '16px',
                }}
              >
                <Button variant="contained" type="submit">
                  Add
                </Button>
                <Button onClick={resetFromModalDismiss}>Cancel</Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default SubstitutionSchedule;
