import './Shared.scss';

import * as React from 'react';

import {
  Backdrop,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { DOW, FreePeriod, Subject, Teacher, Timetable } from 'renderer/Types';
import { days, modalStyle, periodNumbers } from 'renderer/lib';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { Add, Delete, Print } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { useApp } from 'renderer/Providers';
import { useState } from 'react';
import Absentees from 'renderer/components/Absentees';

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

const Timetable = () => {
  const {
    absentees,
    teachers,
    timetable,
    freePeriods,
    updateTimetable,
    subjects,
  } = useApp();
  const [isOpenAddEntry, setIsOpenAddEntry] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>(
    undefined
  );
  const [dow, setDow] = useState<DOW | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [selectedSubstitute, setSelectedSubstitute] = useState<
    Teacher | undefined
  >();
  const [isOpenDeleteClass, setIsOpenDeleteClass] = useState<boolean>(false);
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<
    Teacher | undefined
  >();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<
    Subject | undefined
  >();
  const [isOpenAssignSub, setIsOpenAssignSub] = useState<boolean>(false);
  const [selectedTimetable, setSelectedTimetable] = useState<
    Timetable | undefined
  >();

  const reset = () => {
    setIsOpenAddEntry(false);
    setIsOpenAssignSub(false);
    setDow(undefined);
    setSelectedPeriod(undefined);
    setSelectedTeacher(undefined);
    setSelectedSubject(undefined);
    setSelectedSubstitute(undefined);
    setIsOpenDeleteClass(false);
    setSelectedTimetable(undefined);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateTimetable([
      'add',
      {
        day: dow,
        period: selectedPeriod,
        teacher: selectedTeacher,
        subject: selectedSubject,
        substitute: selectedSubstitute,
        isAbsent: !!absentees.find(
          (a) =>
            a.day === dow &&
            a.teacher?.key === selectedTeacher?.key &&
            a.periods.includes(selectedPeriod!)
        ),
      } as Timetable,
    ]);
    reset();
  };

  const handleAssign = (e: any) => {
    e.preventDefault();
    updateTimetable([
      'edit',
      {
        ...selectedTimetable,
        substitute: selectedSubstitute,
      } as Timetable,
    ]);

    reset();
  };

  const handleDeleteClass = () => {
    if (dow && selectedPeriod && selectedTeacher && selectedSubject) {
      updateTimetable([
        'delete',
        {
          day: dow,
          period: selectedPeriod,
          teacher: selectedTeacher,
          subject: selectedSubject,
        } as Timetable,
      ]);
    }
    reset();
  };

  return (
    <Box>
      <Absentees />
      <Paper
        elevation={1}
        sx={{
          p: 2,
          px: 2,
          mb: 1,
          mt: 4,
        }}
      >
        <Grid container alignItems={'center'} direction="row" gap={6}>
          <Grid item>
            <h4>
              <strong>FILTERS:</strong>
            </h4>
          </Grid>
          <Grid item>
            <FormControl variant="standard" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Teacher
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTeacherFilter?.key || ''}
                onChange={(event: SelectChangeEvent) => {
                  const key = event?.target?.value;
                  if (key === '') setSelectedTeacherFilter(undefined);
                  else {
                    teachers.find(
                      (t) => t && t.key === key && setSelectedTeacherFilter(t)
                    );
                  }
                }}
                label="Age"
              >
                <MenuItem value="">
                  <em>ALL</em>
                </MenuItem>
                {teachers.map(
                  (t) =>
                    t && (
                      <MenuItem
                        key={t.key}
                        value={t.key}
                      >{`${t.firstName} ${t.lastName}`}</MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="standard" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Subject
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard-subject"
                value={selectedSubjectFilter?.key || ''}
                onChange={(event: SelectChangeEvent) => {
                  const key = event?.target?.value;
                  if (key === '') setSelectedSubjectFilter(undefined);
                  else {
                    subjects.find(
                      (t) => t && t.key === key && setSelectedSubjectFilter(t)
                    );
                  }
                }}
                label="Subjects"
              >
                <MenuItem value="">
                  <em>ALL</em>
                </MenuItem>
                {subjects.map(
                  (s) =>
                    s && (
                      <MenuItem key={s.key} value={s.key}>
                        {s.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button startIcon={<Print />} variant="contained">
              Print Timetable
            </Button>
          </Grid>
        </Grid>
      </Paper>
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
                          {timetable
                            .filter(
                              (tt) =>
                                tt &&
                                tt.day === day &&
                                tt.period === pn &&
                                (selectedTeacherFilter === undefined ||
                                  tt.teacher.key ===
                                    selectedTeacherFilter?.key) &&
                                (selectedSubjectFilter === undefined ||
                                  selectedSubjectFilter?.key === tt.subject.key)
                            )
                            .map(
                              (data) =>
                                data && (
                                  <Chip
                                    key={`${data.day}-${data.teacher?.key}`}
                                    color={
                                      data.isAbsent && !data.substitute
                                        ? 'error'
                                        : data.isAbsent && data.substitute
                                        ? 'success'
                                        : 'default'
                                    }
                                    label={`${data.teacher.initial} ${data.teacher.lastName} (${data.subject?.code})`}
                                    deleteIcon={<Delete />}
                                    onClick={() => {
                                      if (data.isAbsent) {
                                        setSelectedTimetable(data);
                                        setIsOpenAssignSub(true);
                                      }
                                    }}
                                    onDelete={() => {
                                      setIsOpenDeleteClass(true);
                                      setSelectedTeacher(data.teacher);
                                      setSelectedPeriod(pn);
                                      setSelectedSubject(data.subject);
                                      setDow(day as DOW);
                                    }}
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

          {/* Add a class */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={isOpenAddEntry}
            onClose={reset}
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
                    Capture subject for a Teacher on {dow}.
                  </Typography>
                  <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    Select the teacher, day of the week and subject.
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
                                (t) =>
                                  t && t.key === key && setSelectedTeacher(t)
                              );
                            }}
                            label="Teacher"
                            required
                            sx={{ my: 1 }}
                          >
                            {teachers.map(
                              (t) =>
                                t && (
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
                            Period
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectedPeriod}
                            onChange={(event: SelectChangeEvent) =>
                              setSelectedPeriod(event?.target?.value)
                            }
                            label="Teacher"
                            required
                            sx={{ my: 1 }}
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
                              <MenuItem
                                key={p}
                                value={p}
                                disabled={
                                  !!timetable.find(
                                    (t) =>
                                      t.day === dow &&
                                      t.teacher.key === selectedTeacher?.key &&
                                      t.period === p
                                  )
                                }
                              >
                                {p}
                              </MenuItem>
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
                            Subject
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectedSubject?.key}
                            onChange={(event: SelectChangeEvent) => {
                              const key = event?.target?.value;
                              subjects.find(
                                (t) =>
                                  t && t.key === key && setSelectedSubject(t)
                              );
                            }}
                            label="Subjects"
                            required
                            sx={{ my: 1 }}
                          >
                            {subjects.map(
                              (s) =>
                                s && (
                                  <MenuItem key={s.key} value={s.key}>
                                    {s.name}
                                  </MenuItem>
                                )
                            )}
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
                    <Button onClick={reset}>Cancel</Button>
                  </Box>
                </form>
              </Box>
            </Fade>
          </Modal>

          {/* Delete a class */}
          <Dialog
            open={isOpenDeleteClass}
            onClose={reset}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Confirm?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this class? <br />
                {dow &&
                  selectedPeriod &&
                  selectedTeacher &&
                  selectedSubject && (
                    <strong>{`${dow}, period ${selectedPeriod}: ${selectedTeacher?.initial} ${selectedTeacher?.lastName} (${selectedSubject?.code})`}</strong>
                  )}
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ my: 2, mx: 2, columnGap: '8px' }}>
              <Button
                onClick={handleDeleteClass}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
              <Button onClick={reset} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* Assign a substitute */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={isOpenAssignSub}
            onClose={reset}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={isOpenAssignSub}>
              <Box sx={modalStyle}>
                <>
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Assign or change a substitute teacher for this period.
                  </Typography>
                </>
                <form onSubmit={handleAssign}>
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
                            Substitute
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectedSubstitute?.key}
                            onChange={(event: SelectChangeEvent) => {
                              const key = event?.target?.value;
                              teachers.find(
                                (t) =>
                                  t && t.key === key && setSelectedSubstitute(t)
                              );
                            }}
                            label="Teacher"
                            required
                            sx={{ my: 1 }}
                          >
                            {freePeriods.map(
                              (fp) =>
                                fp &&
                                fp.day === selectedTimetable?.day &&
                                !fp.isAbsent &&
                                fp.periods.includes(selectedTimetable.period) &&
                                !timetable.find(
                                  (t) =>
                                    t.day === selectedTimetable.day &&
                                    t.period === selectedTimetable.period &&
                                    t.substitute &&
                                    t.substitute.key === fp.teacher.key
                                ) &&
                                fp.teacher.key !==
                                  selectedTimetable.teacher.key && (
                                  <MenuItem
                                    key={fp.teacher.key}
                                    value={fp.teacher.key}
                                  >{`${fp.teacher.initial} ${fp.teacher.lastName}`}</MenuItem>
                                )
                            )}
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
                      Assign
                    </Button>
                    <Button onClick={reset}>Cancel</Button>
                  </Box>
                </form>
              </Box>
            </Fade>
          </Modal>
        </Box>
      </Paper>
    </Box>
  );
};

export default Timetable;
