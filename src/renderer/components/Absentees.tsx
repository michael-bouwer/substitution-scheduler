import { Add, Delete } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';

import { days } from 'renderer/lib';
import { useApp } from 'renderer/Providers';

const Absentees = () => {
  const { absentees } = useApp();
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
            <Grid item>
              <Paper variant="outlined">
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14, mb: 2 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {day}
                  </Typography>
                  {absentees.length === 0 && <Alert>No Absentees</Alert>}
                  {absentees
                    .filter((a) => a && a.day === day)
                    .map((a) => {
                      return (
                        <Chip
                          color="warning"
                          label={`${a.teacher?.initial} ${
                            a.teacher?.lastName
                          } | ${
                            a.periods && a.periods.length === 11
                              ? 'All Day'
                              : a.periods?.join(', ')
                          }`}
                          deleteIcon={<Delete />}
                          // onClick={() => {}}
                          // onDelete={() => {
                          //   setIsOpenDeleteClass(true);
                          //   setSelectedTeacher(data.teacher);
                          //   setSelectedPeriod(pn);
                          //   setSelectedSubject(data.subject);
                          //   setDow(day as DOW);
                          // }}
                        ></Chip>
                      );
                    })}
                </CardContent>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default Absentees;
