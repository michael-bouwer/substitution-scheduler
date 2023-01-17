import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Typography,
} from '@mui/material';

import { modalStyle } from 'renderer/lib';
import { useState } from 'react';

type Props = {};

const DB = (props: Props) => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenSeedModal, setIsOpenSeedModal] = useState<boolean>(false);

  const handleDelete = () => {
    localStorage.clear();
  };

  return (
    <Box className="db">
      <h2>
        Reset all teacher and class data, then seed data with new JSON file.
      </h2>
      <Alert severity="warning">
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
        <Button onClick={() => setIsOpenSeedModal(true)}>Seed New Data</Button>
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
                onClick={handleDelete}
              >
                Upload
              </Button>
              <Button onClick={() => setIsOpenSeedModal(false)}>Cancel</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default DB;
