import './Shared.scss';

import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
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
import { DOW, FreePeriod, Teacher } from 'renderer/Types';
import { ModalMode, days, modalStyle, periodNumbers } from 'renderer/lib';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { Add } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
    textAlign: 'justify',
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

const FreePeriods = () => {
  const { absentees, teachers, freePeriods, updateFreePeriods } = useApp();
  const [isOpenAddEntry, setIsOpenAddEntry] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>(
    undefined
  );
  const [dow, setDow] = useState<DOW | undefined>();
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [mode, setMode] = useState<ModalMode>(ModalMode.ADD);
  const [selectedFreePeriod, setSelectedFreePeriod] = useState<
    FreePeriod | undefined
  >();

  const reset = () => {
    setIsOpenAddEntry(false);
    setDow(undefined);
    setSelectedPeriods([]);
    setSelectedTeacher(undefined);
  };

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
    setSelectedFreePeriod(undefined);
    setIsOpenAddEntry(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (mode === ModalMode.ADD) {
      updateFreePeriods([
        'add',
        {
          day: dow,
          periods: selectedPeriods,
          teacher: selectedTeacher,
          isAbsent: !!absentees.find(
            (a) =>
              a.day === dow &&
              a.teacher?.key === selectedTeacher?.key &&
              a.periods.find((p) => selectedPeriods.includes(p))
          ),
        } as FreePeriod,
      ]);
    } else if (mode === ModalMode.EDIT) {
      updateFreePeriods([
        'edit',
        {
          day: dow,
          periods: selectedPeriods,
          teacher: selectedTeacher,
          isAbsent: !!absentees.find(
            (a) =>
              a.day === dow &&
              a.teacher?.key === selectedTeacher?.key &&
              a.periods.find((p) => selectedPeriods.includes(p))
          ),
        } as FreePeriod,
      ]);
    }
    reset();
  };

  const handleClickEdit = (data: FreePeriod) => {
    setMode(ModalMode.EDIT);
    setIsOpenAddEntry(true);
    setSelectedFreePeriod(data);
    setDow(data.day);
    setSelectedTeacher(data.teacher);
    setSelectedPeriods(data.periods);
  };

  const deleteAll = () => {
    updateFreePeriods([
      'edit',
      {
        day: dow,
        periods: [],
        teacher: selectedTeacher,
        isAbsent: !!absentees.find(
          (a) =>
            a.day === dow &&
            a.teacher?.key === selectedTeacher?.key &&
            a.periods.find((p) => selectedPeriods.includes(p))
        ),
      } as FreePeriod,
    ]);
    reset();
  };

  return (
    <Paper elevation={12}>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ minWidth: 250 }}>Day</StyledTableCell>
                {periodNumbers.map((n) => (
                  <StyledTableCell align="center" sx={{ minWidth: 120 }}>
                    {n}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {days.map((day) => (
                <StyledTableRow key={day} className="table-row">
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={{ minWidth: 120 }}
                  >
                    {day}{' '}
                    <IconButton
                      className="actions"
                      onClick={() => {
                        setDow(day as DOW);
                        setMode(ModalMode.ADD);
                        setIsOpenAddEntry(true);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </StyledTableCell>
                  {periodNumbers.map((pn) => {
                    return (
                      <StyledTableCell
                        key={pn}
                        align="center"
                        sx={{ minWidth: 120, border: '1px solid lightgray' }}
                      >
                        {freePeriods
                          .filter(
                            (fp) =>
                              fp && fp.day === day && fp.periods.includes(pn)
                          )
                          .sort((a, b) =>
                            a.teacher?.lastName > b.teacher?.lastName
                              ? 1
                              : b.teacher?.lastName > a.teacher?.lastName
                              ? -1
                              : 0
                          )
                          .map(
                            (data) =>
                              data && (
                                <Chip
                                  color={
                                    !!absentees.find(
                                      (a) =>
                                        a.day === day &&
                                        a.teacher?.key === data.teacher?.key &&
                                        a.periods.includes(pn)
                                    )
                                      ? 'error'
                                      : 'default'
                                  }
                                  key={`${data.day}-${data.teacher?.key}`}
                                  onClick={() => handleClickEdit(data)}
                                  label={`${data.teacher.initial} ${data.teacher.lastName}`}
                                  sx={{ margin: '2px' }}
                                />
                              )
                          )}
                      </StyledTableCell>
                    );
                  })}
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
                  {mode === ModalMode.ADD ? 'Capture' : 'Update'} free periods
                  for{' '}
                  {mode === ModalMode.ADD
                    ? 'a teacher'
                    : `${selectedTeacher?.initial} ${selectedTeacher?.lastName}`}{' '}
                  on {dow}.
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  {mode === ModalMode.ADD
                    ? 'Select a teacher and their free periods on this day'
                    : 'Update the free periods or delete all free periods for this day'}
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
                          disabled={mode === ModalMode.EDIT}
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
                          {teachers
                            .sort((a, b) =>
                              a.firstName > b.firstName
                                ? 1
                                : b.firstName > a.firstName
                                ? -1
                                : 0
                            )
                            .map(
                              (t) =>
                                t &&
                                ((mode === ModalMode.ADD &&
                                  !freePeriods.find(
                                    (fp) =>
                                      fp.teacher.key === t.key && fp.day === dow
                                  )) ||
                                  mode === ModalMode.EDIT) && (
                                  <MenuItem
                                    key={t.key}
                                    value={t.key}
                                  >{`${t.firstName} ${t.lastName}`}</MenuItem>
                                )
                            )}
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
                          multiple
                          sx={{ my: 1 }}
                          renderValue={(selected) =>
                            selected
                              .sort((a, b) => parseInt(a) - parseInt(b))
                              .join(', ')
                          }
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
                  {mode === ModalMode.EDIT && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={deleteAll}
                    >
                      Delete all for this day
                    </Button>
                  )}
                  <Button variant="contained" type="submit">
                    {mode === ModalMode.ADD ? 'Add' : 'Update'}
                  </Button>
                  <Button onClick={resetFromModalDismiss}>Cancel</Button>
                </Box>
              </form>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Paper>
  );
};

export default FreePeriods;
