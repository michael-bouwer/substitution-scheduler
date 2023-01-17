import './Teachers.scss';

import {
  Alert,
  Backdrop,
  Box,
  Button,
  Divider,
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
import { Delete, Edit } from '@mui/icons-material';
import { ModalMode, modalStyle } from 'renderer/lib';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Teacher } from 'renderer/Types';
import { useApp } from 'renderer/Providers';
import { useState } from 'react';

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
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

type Props = {};

const Teachers = (props: Props) => {
  const { teachers, addTeacher, editTeacher } = useApp();
  const [isOpenAddTeacherModal, setIsOpenAddTeacherModal] =
    useState<boolean>(false);
  const [initial, setInitial] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [mode, setMode] = useState<ModalMode>(ModalMode.ADD);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>();

  const reset = () => {
    setIsOpenAddTeacherModal(false);
    setInitial('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setContact('');
  };

  const handleSubmit = (e: any) => {
    if (mode === ModalMode.ADD)
      addTeacher({
        key: `${initial.toLowerCase()}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        initial,
        firstName,
        lastName,
        email,
        contact,
      });
    else if (mode === ModalMode.EDIT)
      editTeacher({
        key: selectedTeacher!.key,
        initial,
        firstName,
        lastName,
        email,
        contact,
      });

    reset();
  };

  return (
    <Box className="teachers">
      <h2>Add, remove and edit teacher details.</h2>
      {teachers?.length ? (
        <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">Initial</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow
                  key={teacher.key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {teacher.initial}
                  </TableCell>
                  <TableCell>{teacher.firstName}</TableCell>
                  <TableCell>{teacher.lastName}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.contact}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setIsOpenAddTeacherModal(true);
                        setMode(ModalMode.EDIT);
                        setSelectedTeacher(teacher);
                        setInitial(teacher.initial || '');
                        setFirstName(teacher.firstName || '');
                        setLastName(teacher.lastName || '');
                        setEmail(teacher.email || '');
                        setContact(teacher.contact || '');
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">No info available</Alert>
      )}
      <Button
        variant="contained"
        className="btn-add"
        onClick={() => {
          setIsOpenAddTeacherModal(true);
          setMode(ModalMode.ADD);
          setInitial('');
          setFirstName('');
          setLastName('');
          setEmail('');
          setContact('');
        }}
      >
        Add A Teacher
      </Button>

      {/* Add a teacher */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpenAddTeacherModal}
        onClose={reset}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpenAddTeacherModal}>
          <Box sx={modalStyle}>
            {mode === ModalMode.ADD ? (
              <>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Add A New Teacher
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  Fill in the form below, then click "ADD". <br /> These details
                  can be edited at any time.
                </Typography>
              </>
            ) : (
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Edit Teacher
                {selectedTeacher &&
                  ` - ${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  my: 4,
                }}
              >
                <Grid container alignItems={'center'} direction="row">
                  <Grid item xs={12}>
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: 120, margin: 'unset' }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Initial
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={initial}
                        onChange={(event: SelectChangeEvent) =>
                          setInitial(event?.target?.value)
                        }
                        label="Age"
                        required
                        sx={{ my: 1 }}
                      >
                        <MenuItem value={'Ms'}>Ms</MenuItem>
                        <MenuItem value={'Mrs'}>Mrs</MenuItem>
                        <MenuItem value={'Mr'}>Mr</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="standard-basic"
                      label="First Name"
                      value={firstName}
                      variant="standard"
                      onChange={(e) => setFirstName(e?.target?.value)}
                      required
                      sx={{ my: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="standard-basic"
                      label="Last Name"
                      value={lastName}
                      variant="standard"
                      onChange={(e) => setLastName(e?.target?.value)}
                      required
                      sx={{ my: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="standard-basic"
                      label="Email"
                      value={email}
                      variant="standard"
                      onChange={(e) => setEmail(e?.target?.value)}
                      sx={{ my: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="standard-basic"
                      label="Contact"
                      value={contact}
                      variant="standard"
                      onChange={(e) => setContact(e?.target?.value)}
                      sx={{ my: 1 }}
                    />
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
                  {mode === ModalMode.ADD ? 'Add' : 'Save'}
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

export default Teachers;
