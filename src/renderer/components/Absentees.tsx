import { Absentee, DOW, Teacher } from 'renderer/Types';
import { Add, Delete, SetMealOutlined } from '@mui/icons-material';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { ModalMode, days, modalStyle } from 'renderer/lib';

import { useApp } from 'renderer/Providers';
import { useState } from 'react';

const Absentees = () => {
  const {
    absentees,
    freePeriods,
    teachers,
    timetable,
    updateAbsentees,
    updateTimetable,
    updateFreePeriods,
  } = useApp();
  const [isOpenAddAbsentee, setIsOpenAddAbsentee] = useState<boolean>(false);
  const [selectedDow, setSelectedDow] = useState<DOW | undefined>();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>();
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedAbsentee, setSelectedAbsentee] = useState<
    Absentee | undefined
  >();
  const [mode, setMode] = useState<ModalMode>(ModalMode.ADD);

  const reset = () => {
    setMode(ModalMode.ADD);
    setIsOpenAddAbsentee(false);
    setIsOpenDeleteModal(false);
    setSelectedDow(undefined);
    setSelectedTeacher(undefined);
    setSelectedPeriods([]);
    setSelectedAbsentee(undefined);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateAbsentees([
      mode === ModalMode.ADD ? 'add' : 'edit',
      {
        day: mode === ModalMode.ADD ? selectedDow : selectedAbsentee?.day,
        teacher:
          mode === ModalMode.ADD ? selectedTeacher : selectedAbsentee?.teacher,
        periods: selectedPeriods || selectedAbsentee?.periods,
      } as Absentee,
    ]);
    timetable.forEach((t) => {
      if (
        (mode === ModalMode.ADD &&
          t.day === selectedDow &&
          t.teacher?.key === selectedTeacher?.key) ||
        (mode === ModalMode.EDIT &&
          t.day === selectedAbsentee?.day &&
          t.teacher.key === selectedAbsentee?.teacher.key)
      )
        updateTimetable([
          'edit',
          {
            ...t,
            isAbsent: selectedPeriods.includes(t.period),
          },
        ]);
    });
    reset();
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

  const handleDelete = () => {
    updateAbsentees(['delete', selectedAbsentee]);
    timetable.forEach((t) => {
      if (
        t.day === selectedAbsentee?.day &&
        t.teacher?.key === selectedAbsentee?.teacher?.key &&
        selectedAbsentee?.periods?.includes(t.period)
      )
        updateTimetable([
          'edit',
          {
            ...t,
            isAbsent: false,
          },
        ]);
    });
    reset();
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        px: 2,
        mb: 1,
      }}
    >
      <Grid container alignItems={'center'} direction="row" gap={6}>
        <Grid item>
          <strong style={{ verticalAlign: 'middle' }}>ABSENTEES</strong>
          <Button
            color="primary"
            sx={{ mx: 2 }}
            startIcon={<Add />}
            variant="contained"
            onClick={() => setIsOpenAddAbsentee(true)}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems={'center'}
        direction="row"
        gap={2}
        sx={{ mt: 2 }}
      >
        {days.map((day) => {
          return (
            <Grid item key={day}>
              <Paper variant="outlined">
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14, mb: 2 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {day}
                  </Typography>
                  {absentees.filter((a) => a && a.day === day).length === 0 && (
                    <Alert>No Absentees</Alert>
                  )}
                  {absentees
                    .filter((a) => a && a.day === day)
                    .map((a) => {
                      return (
                        <Chip
                          key={`${a.day} ${a.teacher?.key}`}
                          color="warning"
                          label={`${a.teacher?.initial} ${
                            a.teacher?.lastName
                          } | ${
                            a.periods && a.periods.length === 11
                              ? 'All Day'
                              : a.periods
                                  ?.sort((a, b) => parseInt(a) - parseInt(b))
                                  .join(', ')
                          }`}
                          deleteIcon={<Delete />}
                          sx={{ margin: '8px 8px' }}
                          onClick={() => {
                            setIsOpenAddAbsentee(true);
                            setMode(ModalMode.EDIT);
                            setSelectedAbsentee(a);
                            setSelectedPeriods(a.periods);
                          }}
                          onDelete={() => {
                            setSelectedAbsentee(a);
                            setIsOpenDeleteModal(true);
                          }}
                        ></Chip>
                      );
                    })}
                </CardContent>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Add an absentee */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpenAddAbsentee}
        onClose={reset}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpenAddAbsentee}>
          <Box sx={modalStyle}>
            <>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {mode === ModalMode.ADD ? 'Add' : 'Edit'} absence for teacher.
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Select the day, teacher, and periods for which they will be
                absent (or select the whole day).
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
                        Day
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={
                          mode === ModalMode.EDIT
                            ? selectedAbsentee?.day
                            : selectedDow
                        }
                        onChange={(event: SelectChangeEvent) =>
                          setSelectedDow(event?.target?.value as DOW)
                        }
                        label="Day"
                        disabled={mode === ModalMode.EDIT}
                        required
                        sx={{ my: 1 }}
                      >
                        {days.map(
                          (d) =>
                            d && (
                              <MenuItem key={d} value={d}>
                                {d}
                              </MenuItem>
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
                        Teacher
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={
                          mode === ModalMode.EDIT
                            ? selectedAbsentee?.teacher.key
                            : selectedTeacher?.key
                        }
                        onChange={(event: SelectChangeEvent) => {
                          const key = event?.target?.value;
                          teachers.find(
                            (t) => t && t.key === key && setSelectedTeacher(t)
                          );
                        }}
                        label="Teacher"
                        disabled={mode === ModalMode.EDIT || !selectedDow}
                        required
                        sx={{ my: 1 }}
                      >
                        {teachers
                          .filter(
                            (t) =>
                              !absentees.find(
                                (a) =>
                                  a.day === selectedDow &&
                                  a.teacher.key === t.key
                              )
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
                        labelId="absentee-select-periods"
                        id="absentee-select-periods"
                        value={selectedPeriods}
                        onChange={handleMultiSelectChange}
                        label="Teacher"
                        required
                        multiple
                        disabled={
                          mode === ModalMode.ADD &&
                          !selectedDow &&
                          !selectedTeacher
                        }
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
                  <Grid item xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedPeriods.length === 11}
                            disabled={
                              mode === ModalMode.ADD &&
                              !selectedDow &&
                              !selectedTeacher
                            }
                            onChange={() => {
                              if (selectedPeriods.length === 11)
                                setSelectedPeriods([]);
                              else
                                setSelectedPeriods([
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
                                ]);
                            }}
                          />
                        }
                        label="Absent All Day"
                      />
                    </FormGroup>
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
                  {mode === ModalMode.ADD ? 'Add' : 'Edit'}
                </Button>
                <Button onClick={reset}>Cancel</Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* Delete Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpenDeleteModal}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Confirmation
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Are you sure you'd like to delete this absentee entry? <br />
              <strong>
                {`${selectedAbsentee?.day} - ${
                  selectedAbsentee?.teacher?.initial
                } ${selectedAbsentee?.teacher?.lastName} | ${
                  selectedAbsentee?.periods &&
                  selectedAbsentee?.periods.length === 11
                    ? 'All Day'
                    : selectedAbsentee?.periods
                        ?.sort((a, b) => parseInt(a) - parseInt(b))
                        .join(', ')
                }
                `}
              </strong>
            </Typography>
            <Box
              sx={{
                position: 'relative',
                float: 'right',
                display: 'flex',
                marginTop: '16px',
                columnGap: '16px',
              }}
            >
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={reset}>Cancel</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};

export default Absentees;
