import './Shared.scss';

import {
  Alert,
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
  TextField,
  Typography,
} from '@mui/material';
import { DOW, FreePeriod, Subject, Teacher, Timetable } from 'renderer/Types';
import { days, modalStyle, periodNumbers } from 'renderer/lib';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { Add, Delete, Image, Print, Save } from '@mui/icons-material';
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
import xlsx, { IJsonSheet } from 'json-as-xlsx';
import TimetableAddMultiple from 'renderer/components/TimetableAddMultiple';
import html2canvas from 'html2canvas';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: '8px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'justify',
    padding: '2px',
    // border: '1px solid gray'
  },
  [`&.${tableCellClasses.body}:nth-child(1)`]: {
    padding: '4px 8px',
    verticalAlign: 'top',
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
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedClassCode, setSelectedClassCode] = useState<string>('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<
    string | undefined
  >();
  const [selectedClassCodeFilter, setSelectedClassCodeFilter] =
    useState<string>();

  const reset = () => {
    setIsOpenAddEntry(false);
    setIsOpenAssignSub(false);
    setIsOpenDeleteClass(false);
    setDow(undefined);
    setSelectedPeriod(undefined);
    setSelectedTeacher(undefined);
    setSelectedSubject(undefined);
    setSelectedSubstitute(undefined);
    setSelectedTimetable(undefined);
    setSelectedGrade(undefined);
    setSelectedClassCode('');
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
        classCode: selectedClassCode,
        grade: selectedGrade,
      } as Timetable,
    ]);
    reset();
  };

  const handleAssign = (e: any) => {
    e.preventDefault();
    if (selectedTimetable?.substitute?.key === selectedSubstitute?.key) return;
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

  const handleUnassign = () => {
    if (selectedTimetable?.substitute?.key)
      updateTimetable([
        'edit',
        {
          ...selectedTimetable,
          substitute: undefined,
        } as Timetable,
      ]);
    reset();
  };

  type Extract = {
    day: string;
    period_1?: string;
    period_2?: string;
    period_3?: string;
    period_4?: string;
    period_5?: string;
    period_6?: string;
    period_7?: string;
    period_8?: string;
    period_9?: string;
    period_10?: string;
    period_11?: string;
  };

  const getDataForTimetableExtract = () => {
    const data: Extract[] = [];
    days.forEach((day) => {
      const currentData: Extract = { day };
      periodNumbers.forEach((pn) => {
        const entriesForThisPeriod = timetable
          .filter(
            (tt) =>
              tt &&
              tt.day === day &&
              tt.period === pn &&
              (selectedTeacherFilter === undefined ||
                tt.teacher?.key === selectedTeacherFilter?.key) &&
              (selectedSubjectFilter === undefined ||
                selectedSubjectFilter?.key === tt.subject?.key) &&
              (selectedGradeFilter === undefined ||
                tt.grade === selectedGradeFilter) &&
              (selectedClassCodeFilter === undefined ||
                tt.classCode === selectedClassCodeFilter)
          )
          .map(
            (t) =>
              t &&
              `${
                t.isAbsent && t.substitute
                  ? `${t.substitute.initial} ${t.substitute.lastName}`
                  : `${t.teacher.initial} ${t.teacher.lastName}`
              } (${t.subject?.code})`
          )
          .join('\r\n');
        const obj = {
          [`period_${pn}`]: entriesForThisPeriod,
        };
        Object.assign(currentData, obj);
      });
      data.push(currentData);
    });
    return data;
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
        <Grid container alignItems={'center'} direction="row" gap={3}>
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
                {subjects
                  .sort((a, b) =>
                    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                  )
                  .map(
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
            <FormControl variant="standard" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Grade
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard-subject"
                value={selectedGradeFilter}
                onChange={(event: SelectChangeEvent) => {
                  const key = event?.target?.value;
                  if (key === '') setSelectedGradeFilter(undefined);
                  else setSelectedGradeFilter(event?.target?.value);
                }}
                label="Grade"
              >
                <MenuItem value="">
                  <em>ALL</em>
                </MenuItem>
                {['4', '5', '6', '7'].map(
                  (s) =>
                    s && (
                      <MenuItem key={s} value={s}>
                        Grade {s}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              id="standard-basic"
              label="Class Code"
              value={selectedClassCodeFilter}
              variant="standard"
              onChange={(e) => {
                const key = e?.target?.value;
                if (key === '') setSelectedClassCodeFilter(undefined);
                else setSelectedClassCodeFilter(e?.target?.value);
              }}
              sx={{ my: 1 }}
            />
          </Grid>
          <Grid item>
            <Button
              startIcon={<Save />}
              variant="contained"
              id="save"
              onClick={() => {
                const settings = {
                  fileName: 'MySpreadsheet', // Name of the resulting spreadsheet
                  extraLength: 3, // A bigger number means that columns will be wider
                  writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
                  RTL: false, // Display the columns from right-to-left (the default value is false)
                };

                const content = getDataForTimetableExtract();
                const data: IJsonSheet[] = [
                  {
                    sheet: 'Timetable',
                    columns: [
                      { label: 'Day', value: 'day' }, // Top level data
                      { label: 'Period 1', value: 'period_1' }, // Top level data
                      { label: 'Period 2', value: 'period_2' }, // Top level data
                      { label: 'Period 3', value: 'period_3' }, // Top level data
                      { label: 'Period 4', value: 'period_4' }, // Top level data
                      { label: 'Period 5', value: 'period_5' }, // Top level data
                      { label: 'Period 6', value: 'period_6' }, // Top level data
                      { label: 'Period 7', value: 'period_7' }, // Top level data
                      { label: 'Period 8', value: 'period_8' }, // Top level data
                      { label: 'Period 9', value: 'period_9' }, // Top level data
                      { label: 'Period 10', value: 'period_10' }, // Top level data
                      { label: 'Period 11', value: 'period_11' }, // Top level data
                    ],
                    content: content,
                  },
                ];
                xlsx(data, settings);
              }}
            >
              Save Timetable
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<Image />}
              variant="contained"
              id="save-img"
              onClick={() => {
                //Save image of table
                html2canvas(document.querySelector('#print-to-image')!).then(
                  (canvas) => {
                    var image = canvas
                      .toDataURL('image/png')
                      .replace('image/png', 'image/octet-stream'); // here is the most important part because if you dont replace you will get a DOM 18 exception.

                    window.location.href = image; // it will save locally
                  }
                );
              }}
            >
              Save Image
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={12}>
        <Box>
          <TableContainer component={Paper} id="printable-area">
            <Table id="print-to-image" aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Day
                    <TimetableAddMultiple />
                  </StyledTableCell>
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
                          sx={{ border: '1px solid lightgray' }}
                        >
                          {timetable
                            .filter(
                              (tt) =>
                                tt &&
                                tt.day === day &&
                                tt.period === pn &&
                                (selectedTeacherFilter === undefined ||
                                  tt.teacher?.key ===
                                    selectedTeacherFilter?.key) &&
                                (selectedSubjectFilter === undefined ||
                                  selectedSubjectFilter?.key ===
                                    tt.subject?.key) &&
                                (selectedGradeFilter === undefined ||
                                  tt.grade === selectedGradeFilter) &&
                                (selectedClassCodeFilter === undefined ||
                                  tt.classCode === selectedClassCodeFilter)
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
                                    key={`${data.day}-${data.teacher?.key}`}
                                    color={
                                      data.isAbsent && !data.substitute
                                        ? 'error'
                                        : data.isAbsent && data.substitute
                                        ? 'success'
                                        : 'default'
                                    }
                                    label={`${
                                      data.isAbsent && data.substitute
                                        ? `${data.substitute.initial} ${data.substitute.lastName}`
                                        : `${data.teacher.initial} ${data.teacher.lastName}`
                                    } (${data.subject?.code || ''} ${
                                      data.grade || ''
                                    }${data.classCode || ''})`}
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
                                    sx={{ margin: '2px', borderRadius: '4px' }}
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
                    <Grid container>
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
                                      t.teacher?.key === selectedTeacher?.key &&
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
                            {subjects
                              .sort((a, b) =>
                                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                              )
                              .map(
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
                      <Grid item xs={3}>
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
                            Grade
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectedGrade}
                            onChange={(event: SelectChangeEvent) => {
                              event?.target?.value &&
                                setSelectedGrade(event.target.value);
                            }}
                            label="Grade"
                            required
                            sx={{ my: 1 }}
                          >
                            {[4, 5, 6, 7].map(
                              (g) =>
                                g && (
                                  <MenuItem key={g} value={g.toString()}>
                                    {`Grade ${g}`}
                                  </MenuItem>
                                )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}>
                        <FormControl
                          variant="standard"
                          sx={{
                            minWidth: 120,
                            width: '90%',
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label="ClassCode"
                            value={selectedClassCode}
                            variant="standard"
                            required
                            onChange={(e) =>
                              setSelectedClassCode(e?.target?.value)
                            }
                          />
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
                    {selectedTimetable &&
                    selectedTimetable.day &&
                    selectedTimetable.teacher?.key &&
                    selectedTimetable.subject?.key &&
                    selectedTimetable.grade &&
                    selectedTimetable.classCode
                      ? `${selectedTimetable.day}, period ${selectedTimetable.period} - ${selectedTimetable.teacher?.initial} ${selectedTimetable.teacher?.lastName} (${selectedTimetable.grade}${selectedTimetable.classCode})`
                      : 'Action required!'}
                  </Typography>
                  <Typography
                    id="transition-modal-title"
                    variant="subtitle1"
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
                      {!freePeriods.find(
                        (fp) =>
                          fp &&
                          fp.day === selectedTimetable?.day &&
                          fp.periods.includes(selectedTimetable.period) &&
                          fp.teacher?.key !== selectedTimetable.teacher?.key &&
                          (selectedTimetable?.substitute?.key ===
                            fp.teacher?.key ||
                            !timetable.find(
                              (t) =>
                                t.day === selectedTimetable?.day &&
                                t.period === selectedTimetable.period &&
                                t.isAbsent &&
                                t.substitute?.key === fp.teacher?.key
                            ))
                      ) ? (
                        <Grid item xs={12}>
                          <Alert color="error" severity="error">
                            No substitutes available.
                          </Alert>
                        </Grid>
                      ) : (
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
                              value={
                                selectedSubstitute?.key ||
                                selectedTimetable?.substitute?.key
                              }
                              onChange={(event: SelectChangeEvent) => {
                                const key = event?.target?.value;
                                teachers.find(
                                  (t) =>
                                    t &&
                                    t.key === key &&
                                    setSelectedSubstitute(t)
                                );
                              }}
                              label="Teacher"
                              required
                              disabled={
                                !freePeriods.find(
                                  (fp) =>
                                    fp &&
                                    fp.day === selectedTimetable?.day &&
                                    fp.periods.includes(
                                      selectedTimetable.period
                                    ) &&
                                    fp.teacher?.key !==
                                      selectedTimetable.teacher?.key &&
                                    (selectedTimetable?.substitute?.key ===
                                      fp.teacher?.key ||
                                      !timetable.find(
                                        (t) =>
                                          t.day === selectedTimetable?.day &&
                                          t.period ===
                                            selectedTimetable.period &&
                                          t.isAbsent &&
                                          t.substitute?.key === fp.teacher?.key
                                      ))
                                )
                              }
                              sx={{ my: 1 }}
                            >
                              {freePeriods.map(
                                (fp) =>
                                  fp &&
                                  fp.day === selectedTimetable?.day &&
                                  fp.periods.includes(
                                    selectedTimetable.period
                                  ) &&
                                  fp.teacher?.key !==
                                    selectedTimetable.teacher?.key &&
                                  (selectedTimetable?.substitute?.key ===
                                    fp.teacher?.key ||
                                    !timetable.find(
                                      (t) =>
                                        t.day === selectedTimetable?.day &&
                                        t.period === selectedTimetable.period &&
                                        t.isAbsent &&
                                        t.substitute?.key === fp.teacher?.key
                                    )) && (
                                    <MenuItem
                                      key={fp.teacher?.key}
                                      value={fp.teacher?.key}
                                    >{`${fp.teacher.initial} ${fp.teacher.lastName}`}</MenuItem>
                                  )
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}
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
                    {selectedTimetable?.substitute && (
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ float: 'left' }}
                        onClick={handleUnassign}
                      >
                        Unassign Substitute
                      </Button>
                    )}
                    {freePeriods.find(
                      (fp) =>
                        fp &&
                        fp.day === selectedTimetable?.day &&
                        fp.periods.includes(selectedTimetable.period) &&
                        fp.teacher?.key !== selectedTimetable.teacher?.key &&
                        (selectedTimetable?.substitute?.key ===
                          fp.teacher?.key ||
                          !timetable.find(
                            (t) =>
                              t.day === selectedTimetable?.day &&
                              t.period === selectedTimetable.period &&
                              t.isAbsent &&
                              t.substitute?.key === fp.teacher?.key
                          ))
                    ) && (
                      <Button variant="contained" type="submit">
                        Assign
                      </Button>
                    )}
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
