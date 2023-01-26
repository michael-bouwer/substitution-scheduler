export interface Teacher {
  key: string;
  initial: string;
  firstName: string;
  lastName: string;
  email: string | undefined;
  contact: string | undefined;
}

export interface Subject {
  key: string;
  name: string;
  code: string;
  description: string | undefined;
}

export interface FreePeriod {
  day: DOW;
  teacher: Teacher;
  periods: string[];
}

export type DOW = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface Timetable {
  day: DOW;
  teacher: Teacher;
  period: string;
  substitute: Teacher | undefined;
  subject: Subject;
  isAbsent: boolean;
  grade: string
  classCode: string
}

export interface Absentee {
  day: DOW;
  teacher: Teacher;
  periods: string[];
}
