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
  TextField,
  Typography,
} from '@mui/material';
import { DOW, Subject, Teacher, Timetable } from 'renderer/Types';
import { ModalMode, days, modalStyle } from 'renderer/lib';
import React, { useEffect } from 'react';

import { Add } from '@mui/icons-material';
import { useApp } from 'renderer/Providers';
import { useState } from 'react';

type Props = {};

type PeriodsForDay = {
  day: string;
  selectedPeriods: string[];
};

const TimetableAddMultiple = (props: Props) => {
  const { teachers, timetable, subjects, updateTimetable } = useApp();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>(
    undefined
  );
  const [dow, setDow] = useState<DOW | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [selectedPeriodsForDays, setSelectedPeriodsForDays] = useState<
    PeriodsForDay[]
  >(
    days.map((d) => {
      return { day: d, selectedPeriods: [] };
    })
  );

  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedClassCode, setSelectedClassCode] = useState<string>('');
  const [mode, setMode] = useState<ModalMode>(ModalMode.ADD);

  useEffect(() => {
    if (
      selectedTeacher &&
      selectedSubject &&
      selectedGrade &&
      selectedClassCode
    ) {
      const hasTimetable = timetable.filter(
        (t) =>
          t.teacher?.key === selectedTeacher.key &&
          t.subject?.key === selectedSubject.key &&
          t.grade === selectedGrade &&
          t.classCode === selectedClassCode
      );
      const newData: PeriodsForDay[] = [];
      if (hasTimetable && hasTimetable.length > 0) {
        days.forEach((day) => {
          const d: PeriodsForDay = {
            day,
            selectedPeriods: [],
          };
          const entriesForCurrentDay = hasTimetable.filter(
            (t) => t.day === day
          );
          if (entriesForCurrentDay.length > 0) {
            d.selectedPeriods = entriesForCurrentDay
              .map((t) => t && t.period)
              .map((t) => t);
          }
          newData.push(d);
        });
        setSelectedPeriodsForDays(newData);
        setMode(ModalMode.EDIT);
      } else {
        setMode(ModalMode.ADD);
      }
    }
  }, [selectedTeacher, selectedSubject, selectedGrade, selectedClassCode]);

  const reset = () => {
    setIsOpen(false);
    setDow(undefined);
    setSelectedTeacher(undefined);
    setSelectedSubject(undefined);
    setSelectedGrade(undefined);
    setSelectedClassCode('');
    setSelectedPeriodsForDays(
      days.map((d) => {
        return { day: d, selectedPeriods: [] };
      })
    );
    setMode(ModalMode.ADD);
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    day: string
  ) => {
    const {
      target: { value },
    } = event;
    const data = selectedPeriodsForDays.find((s) => s.day === day);
    const without = selectedPeriodsForDays.filter((s) => s.day !== day);
    if (data) {
      data.selectedPeriods =
        typeof value === 'string' ? value.split(',') : value;
      setSelectedPeriodsForDays(without.concat(data));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    selectedPeriodsForDays.forEach((s) => {
      const removedEntries = timetable.filter(
        (t) =>
          t &&
          t.day === s.day &&
          t.teacher?.key === selectedTeacher?.key &&
          t.subject?.key === selectedSubject?.key &&
          t.grade === selectedGrade &&
          t.classCode === selectedClassCode &&
          !s.selectedPeriods?.includes(t.period)
      );
      removedEntries.forEach((e) => e && updateTimetable(['delete', e]));

      const existing = timetable
        .filter(
          (t) =>
            t &&
            t.day === s.day &&
            t.teacher?.key === selectedTeacher?.key &&
            t.subject?.key === selectedSubject?.key &&
            t.grade === selectedGrade &&
            t.classCode === selectedClassCode
        )
        .map((e) => e.period);

      s.selectedPeriods.forEach((sp) => {
        if (sp && !existing.includes(sp))
          updateTimetable([
            'add',
            {
              day: s.day as DOW,
              classCode: selectedClassCode,
              grade: selectedGrade,
              period: sp,
              subject: selectedSubject,
              teacher: selectedTeacher,
            } as Timetable,
          ]);
      });
    });
  };

  const handleDelete = () => {
    timetable.forEach((t) => {
      if (
        t.teacher?.key === selectedTeacher?.key &&
        t.subject?.key === selectedSubject?.key &&
        t.grade === selectedGrade &&
        t.classCode === selectedClassCode
      )
        updateTimetable(['delete', t]);
    });
    reset();
  };

  return (
    <Box>
      <Button
        color="primary"
        sx={{ mx: 2 }}
        startIcon={<Add />}
        variant="contained"
        size="small"
        onClick={() => setIsOpen(true)}
      >
        Add
      </Button>
      {/* Add a class */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={reset}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
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
                        m: 1,
                        minWidth: 120,
                        margin: 'unset',
                        width: '90%',
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        label="ClassCode"
                        value={selectedClassCode}
                        variant="standard"
                        onChange={(e) =>
                          setSelectedClassCode(e?.target?.value.trim())
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ my: 4 }}>
                    <Grid container alignItems={'center'} direction="row">
                      {days.map((day) => {
                        return (
                          <React.Fragment key={day}>
                            <Grid item xs={6}>
                              {day}
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
                                  labelId="timetable-select-periods"
                                  id="timetable-select-periods"
                                  value={
                                    selectedPeriodsForDays?.find(
                                      (s) => s.day === day
                                    )?.selectedPeriods || []
                                  }
                                  onChange={(e: SelectChangeEvent<string[]>) =>
                                    handleMultiSelectChange(e, day)
                                  }
                                  label="Teacher"
                                  multiple
                                  disabled={
                                    !selectedTeacher ||
                                    !selectedSubject ||
                                    !selectedGrade
                                  }
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
                                        checked={
                                          selectedPeriodsForDays?.find(
                                            (s) => s.day === day
                                          )?.selectedPeriods &&
                                          selectedPeriodsForDays!
                                            .find((s) => s.day === day)!
                                            .selectedPeriods.indexOf(p) > -1
                                        }
                                      />
                                      <ListItemText primary={p} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </React.Fragment>
                        );
                      })}
                    </Grid>
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
                    onClick={handleDelete}
                  >
                    Remove All
                  </Button>
                )}
                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    !selectedTeacher ||
                    !selectedSubject ||
                    !selectedGrade ||
                    !selectedClassCode ||
                    !selectedPeriodsForDays.find(
                      (s) => s.selectedPeriods && s.selectedPeriods.length > 0
                    )
                  }
                >
                  {mode === ModalMode.ADD ? 'ADD' : 'EDIT'}
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

export default TimetableAddMultiple;
