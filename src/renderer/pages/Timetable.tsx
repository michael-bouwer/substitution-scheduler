import './Shared.scss';

import * as React from 'react';

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
import { DOW, FreePeriod, Subject, Teacher, Timetable } from 'renderer/Types';
import { ModalMode, modalStyle } from 'renderer/lib';
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

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periodNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

const Timetable = () => {
  const { teachers, timetable, updateTimetable, subjects } = useApp();
  const [isOpenAddEntry, setIsOpenAddEntry] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>(
    undefined
  );
  const [dow, setDow] = useState<DOW | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>();
  const [mode, setMode] = useState<ModalMode>(ModalMode.ADD);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [selectedSubstitue, setSelectedSubstitue] = useState<
    Teacher | undefined
  >();

  const reset = () => {
    setIsOpenAddEntry(false);
    setDow(undefined);
    setSelectedPeriod(undefined);
    setSelectedTeacher(undefined);
    setSelectedSubject(undefined);
    setSelectedSubstitue(undefined);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (mode === ModalMode.ADD) {
      updateTimetable([
        'add',
        {
          day: dow,
          period: selectedPeriod,
          teacher: selectedTeacher,
          subject: selectedSubject,
          substitue: selectedSubstitue,
        } as Timetable,
      ]);
    } else if (mode === ModalMode.EDIT) {
      updateTimetable([
        'edit',
        {
          day: dow,
          period: selectedPeriod,
          teacher: selectedTeacher,
          subject: selectedSubject,
          substitue: selectedSubstitue,
        } as Timetable,
      ]);
    }
    reset();
  };

  const handleClickEdit = (data: Timetable) => {
    setMode(ModalMode.EDIT);
    setIsOpenAddEntry(true);
    setDow(data.day);
    setSelectedTeacher(data.teacher);
    setSelectedPeriod(data.period);
    setSelectedSubject(data.subject);
    setSelectedSubstitue(data.substitue);
  };

  return (
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
                      {timetable
                        .filter(
                          (fp) => fp && fp.day === day && fp.period === pn
                        )
                        .map(
                          (data) =>
                            data && (
                              <Chip
                                key={`${data.day}-${data.teacher?.key}`}
                                onClick={() => handleClickEdit(data)}
                                label={`${data.teacher.initial} ${data.teacher.lastName} (${data.subject?.code})`}
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
                {mode === ModalMode.ADD ? 'Capture' : 'Update'} Free Period for
                a Teacher on {dow}.
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
                        disabled={!selectedTeacher}
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
                            (t) => t && t.key === key && setSelectedSubject(t)
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
                  {mode === ModalMode.ADD ? 'Add' : 'Update'}
                </Button>
                <Button onClick={reset}>Cancel</Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Timetable;
