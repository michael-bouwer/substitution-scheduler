import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Snackbar,
  Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { StorageKeys, modalStyle } from 'renderer/lib';
import { createRef, forwardRef, useState } from 'react';

import fs from 'fs';
import { ipcRenderer } from 'electron';
import localforage from 'localforage';
import { useApp } from 'renderer/Providers';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return (
    <MuiAlert
      elevation={props.elevation || 6}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

const DB = () => {
  const {
    clearAllData,
    updateAbsentees,
    updateFreePeriods,
    updateTimetable,
    setTeachers,
    setSubjects,
  } = useApp();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenSeedModal, setIsOpenSeedModal] = useState<boolean>(false);
  const jsonUploadRef = createRef<HTMLInputElement>();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleDelete = () => {
    clearAllData();
    setIsOpenDeleteModal(false);
    setMessage('Data has been reset!');
    setOpen(true);
  };

  const handleUploadClick = () => {
    if (jsonUploadRef?.current) jsonUploadRef.current.click();
  };

  const handleUpload = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      console.log('e.target.result', e?.target?.result);
      const possibleData = e?.target?.result
        ? JSON.parse(e.target.result.toString())
        : {};
      clearAllData();
      if (possibleData.absentees)
        updateAbsentees(['init', possibleData.absentees]);
      if (possibleData.freePeriods)
        updateFreePeriods(['init', possibleData.freePeriods]);
      if (possibleData.timetable)
        updateTimetable(['init', possibleData.timetable]);
      if (possibleData.teachers) {
        setTeachers(possibleData.teachers);
        localforage.setItem(StorageKeys.TEACHERS, possibleData.teachers);
      }
      if (possibleData.subjects) {
        setSubjects(possibleData.subjects);
        localforage.setItem(StorageKeys.SUBJECTS, possibleData.subjects);
      }
      setIsOpenSeedModal(false);
      setMessage('New data has been loaded!');
      setOpen(true);
    };
  };

  return (
    <Box className="db">
      <h2>
        Reset all teacher and class data, then seed data with new JSON file.
      </h2>
      <Alert severity="warning" elevation={0}>
        Careful! Doing this will erase any captured information.
      </Alert>
      <Box
        sx={{
          margin: '16px 0',
          display: 'flex',
          columnGap: '16px',
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => setIsOpenDeleteModal(true)}
        >
          Delete all data
        </Button>
        <Button onClick={() => setIsOpenSeedModal(true)}>Upload Data</Button>
        <Button
          onClick={async () => {
            const allData: any = {};
            const absentees = await localforage.getItem(StorageKeys.ABSENTEES);
            allData.absentees = absentees;
            const freePeriods = await localforage.getItem(
              StorageKeys.FREE_PERIODS
            );
            allData.freePeriods = freePeriods;
            const subjects = await localforage.getItem(StorageKeys.SUBJECTS);
            allData.subjects = subjects;
            const teachers = await localforage.getItem(StorageKeys.TEACHERS);
            allData.teachers = teachers;
            const timetable = await localforage.getItem(StorageKeys.TIMETABLE);
            allData.timetable = timetable;

            ipcRenderer.send('backup', allData);
          }}
        >
          Backup Current Data
        </Button>
      </Box>

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
              This action will delete all data on teachers, classes, etc from
              local storage. <br />
              New data can either be captured manually again, or data can be
              loaded via a JSON file under the option "SEED NEW DATA"
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
              <Button onClick={() => setIsOpenDeleteModal(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Seed New Data Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpenSeedModal}
        onClose={() => setIsOpenSeedModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpenSeedModal}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Upload New Data
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Using the predefined JSON structure, upload a new JSON file to
              populate local storage.
            </Typography>
            <Box
              sx={{
                float: 'right',
                display: 'flex',
                marginTop: '16px',
                columnGap: '16px',
              }}
            >
              <Button
                variant="contained"
                color="warning"
                onClick={handleUploadClick}
              >
                Upload
              </Button>
              <input
                ref={jsonUploadRef}
                type="file"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
              <Button onClick={() => setIsOpenSeedModal(false)}>Cancel</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DB;
