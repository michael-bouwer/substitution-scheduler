export const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

export enum StorageKeys {
  TEACHERS = 'teachers',
}

export enum ModalMode {
  ADD,
  EDIT
}