import './Teachers.scss';

import {
  Alert,
  Backdrop,
  Box,
  Button,
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
import { Delete, Edit } from '@mui/icons-material';
import { ModalMode, modalStyle } from 'renderer/lib';
import { Subject, Teacher } from 'renderer/Types';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useApp } from 'renderer/Providers';
import { useState } from 'react';

const Subjects = () => {
  const { subjects, addSubject, editSubject, deleteSubject } = useApp();
  const [isOpenAddSubjectModal, setIsOpenAddSubjectModal] =
    useState<boolean>(false);
  const [isOpenDeleteSubject, setIsOpenDeleteSubject] =
    useState<boolean>(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.ADD);
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const reset = () => {
    setIsOpenAddSubjectModal(false);
    setIsOpenDeleteSubject(false);
    setName('');
    setCode('');
    setDescription('');
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (mode === ModalMode.ADD)
      addSubject({
        key: code.trim().toUpperCase(),
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
      });
    else if (mode === ModalMode.EDIT)
      editSubject({
        key: selectedSubject!.key,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
      });
    reset();
  };

  const handleDelete = () => {
    if (selectedSubject) deleteSubject(selectedSubject);
    reset();
  };

  return (
    <Box className="teachers">
      <h2>Add, remove and edit subject details.</h2>
      {subjects?.length ? (
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow
                  key={subject.code}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {subject.code}
                  </TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => {
                        setIsOpenAddSubjectModal(true);
                        setMode(ModalMode.EDIT);
                        setSelectedSubject(subject);
                        setCode(subject.code || '');
                        setName(subject.name || '');
                        setDescription(subject.description || '');
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setIsOpenDeleteSubject(true);
                        setSelectedSubject(subject);
                      }}
                    >
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
          setIsOpenAddSubjectModal(true);
          setMode(ModalMode.ADD);
          setCode('');
          setName('');
          setDescription('');
        }}
      >
        Add A Subject
      </Button>

      {/* Add a subject */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpenAddSubjectModal}
        onClose={reset}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpenAddSubjectModal}>
          <Box sx={modalStyle}>
            {mode === ModalMode.ADD ? (
              <>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Add A New Subject
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  Add a subject that will be linked to teachers and their
                  schedules. <br />
                  The <strong>Code</strong> value represents the subject in
                  shorthand notation.
                </Typography>
              </>
            ) : (
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Edit Subject
                {selectedSubject &&
                  ` - ${selectedSubject.name} (${selectedSubject.code})`}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  my: 4,
                }}
              >
                <Grid container alignItems={'center'} direction="row">
                  <Grid item xs={4}>
                    <TextField
                      id="standard-basic"
                      label="Code"
                      value={code}
                      variant="standard"
                      onChange={(e) => setCode(e?.target?.value)}
                      required
                      sx={{ my: 1, width: '90%' }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="standard-basic"
                      label="Name"
                      value={name}
                      variant="standard"
                      onChange={(e) => setName(e?.target?.value)}
                      required
                      sx={{ my: 1, width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="standard-basic"
                      label="Description"
                      value={description}
                      variant="standard"
                      onChange={(e) => setDescription(e?.target?.value)}
                      sx={{ my: 1, width: '100%' }}
                      multiline
                      rows={3}
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

      {/* Delete a subject */}
      <Dialog
        open={isOpenDeleteSubject}
        onClose={reset}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the subject:{' '}
            <strong>
              {selectedSubject?.name} ({selectedSubject?.code})
            </strong>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ my: 2, mx: 2, columnGap: '8px' }}>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
          <Button onClick={reset} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subjects;
