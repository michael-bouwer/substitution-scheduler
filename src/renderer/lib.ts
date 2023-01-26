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

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const periodNumbers = [
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
];

export enum StorageKeys {
  TEACHERS = 'teachers',
  SUBJECTS = 'subjects',
  FREE_PERIODS = 'free-periods',
  TIMETABLE = 'timetable',
  ABSENTEES = 'absentees',
}

export enum ModalMode {
  ADD,
  EDIT,
}

export enum Grades {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
}