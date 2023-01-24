import { Absentee, FreePeriod, Subject, Teacher, Timetable } from './Types';
import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import React from 'react';
import { StorageKeys } from './lib';
import localforage from 'localforage';

type Props = {
  children: React.ReactNode;
};

interface AppContext {
  teachers: Teacher[];
  addTeacher: (teacher: Teacher) => void;
  editTeacher: (teacher: Teacher) => void;
  deleteTeacher: (teacher: Teacher) => void;
  setTeachers: Dispatch<React.SetStateAction<Teacher[]>>;

  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  editSubject: (subject: Subject) => void;
  deleteSubject: (subject: Subject) => void;
  setSubjects: Dispatch<React.SetStateAction<Subject[]>>;

  freePeriods: FreePeriod[];
  updateFreePeriods: Dispatch<FreePeriodAction>;

  timetable: Timetable[];
  updateTimetable: Dispatch<TimetableAction>;

  absentees: Absentee[];
  updateAbsentees: Dispatch<AbsenteeAction>;

  clearAllData: () => void;
}

const appContextValues: AppContext = {
  teachers: [],
  addTeacher: () => {},
  editTeacher: () => {},
  deleteTeacher: () => {},
  setTeachers: () => {},

  subjects: [],
  addSubject: () => {},
  editSubject: () => {},
  deleteSubject: () => {},
  setSubjects: () => {},

  freePeriods: [],
  updateFreePeriods: () => [],

  timetable: [],
  updateTimetable: () => {},

  absentees: [],
  updateAbsentees: () => {},

  clearAllData: () => {},
};

const appContext = createContext<AppContext>(appContextValues);
export const useApp = () => useContext(appContext);
type CommonActions = 'init' | 'add' | 'edit' | 'delete' | 'reset';
type FreePeriodAction = [
  CommonActions,
  (FreePeriod | FreePeriod[] | undefined)?
];
type TimetableAction = [CommonActions, (Timetable | Timetable[] | undefined)?];
type AbsenteeAction = [CommonActions, (Absentee | Absentee[] | undefined)?];

const reducerFreePeriods = (
  state: FreePeriod[],
  [action, data]: FreePeriodAction
) => {
  switch (action) {
    case 'init':
      if (data instanceof Array) return data;
      return state;
    case 'add':
      if (data && !(data instanceof Array)) {
        localforage.setItem<FreePeriod[]>(StorageKeys.FREE_PERIODS, [
          ...state,
          data,
        ]);
        return [...state, data];
      }
      return state;
    case 'edit':
      if (data && !(data instanceof Array)) {
        const editEntry = state.find(
          (e) => e.day === data.day && e.teacher.key === data.teacher.key
        );
        if (editEntry) {
          editEntry.periods = data.periods;
          editEntry.day = data.day;
          editEntry.teacher = data.teacher;
          const withoutEntry = state.filter(
            (e) => e.day !== data.day || e.teacher.key !== data.teacher.key
          );
          localforage.setItem<FreePeriod[]>(StorageKeys.FREE_PERIODS, [
            ...withoutEntry,
            editEntry,
          ]);
          return [...withoutEntry, editEntry];
        }
      }
      return state;
    case 'delete':
      if (data && !(data instanceof Array)) {
        const filtered = state.filter(
          (e) => e.day !== data.day || e.teacher.key !== data.teacher.key
        );
        localforage.setItem<FreePeriod[]>(StorageKeys.FREE_PERIODS, filtered);
        return filtered;
      }
      return state;
    case 'reset':
      return [];
  }
};

const reducerTimetable = (
  state: Timetable[],
  [action, data]: TimetableAction
) => {
  switch (action) {
    case 'init':
      if (data instanceof Array) return data;
      return state;
    case 'add':
      if (data && !(data instanceof Array)) {
        localforage.setItem<Timetable[]>(StorageKeys.TIMETABLE, [
          ...state,
          data,
        ]);
        return [...state, data];
      }
      return state;
    case 'edit':
      if (data && !(data instanceof Array)) {
        const editEntry = state.find(
          (e) =>
            e.day === data.day &&
            e.teacher.key === data.teacher.key &&
            e.period === data.period
        );
        if (editEntry) {
          editEntry.substitute = data.substitute;
          editEntry.teacher = {
            ...data.teacher,
            key: `${data.teacher.initial.toLowerCase()}-${data.teacher.firstName.toLowerCase()}-${data.teacher.lastName.toLowerCase()}`,
          };
          editEntry.subject = data.subject;
          editEntry.isAbsent = data.isAbsent;
          const withoutEntry = state.filter(
            (e) =>
              e.day !== data.day ||
              e.teacher.key !== editEntry.teacher.key ||
              e.period !== data.period
          );
          localforage.setItem<Timetable[]>(StorageKeys.TIMETABLE, [
            ...withoutEntry,
            editEntry,
          ]);
          return [...withoutEntry, editEntry];
        }
      }
      return state;
    case 'delete':
      if (data && !(data instanceof Array)) {
        const filtered = state.filter(
          (e) =>
            e.day !== data.day ||
            e.teacher.key !== data.teacher.key ||
            e.period !== data.period
        );
        localforage.setItem<Timetable[]>(StorageKeys.TIMETABLE, filtered);
        return filtered;
      }
      return state;
    case 'reset':
      return [];
  }
};

const reducerAbsentee = (state: Absentee[], [action, data]: AbsenteeAction) => {
  switch (action) {
    case 'init':
      if (data instanceof Array) return data;
      return state;
    case 'add':
      if (data && !(data instanceof Array)) {
        localforage.setItem<Absentee[]>(StorageKeys.ABSENTEES, [
          ...state,
          data,
        ]);
        return [...state, data];
      }
      return state;
    case 'edit':
      if (data && !(data instanceof Array)) {
        const editEntry = state.find(
          (e) => e.day === data.day && e.teacher.key === data.teacher.key
        );
        if (editEntry) {
          editEntry.periods = data.periods;
          editEntry.day = data.day;
          editEntry.teacher = {
            ...data.teacher,
            key: `${data.teacher.initial.toLowerCase()}-${data.teacher.firstName.toLowerCase()}-${data.teacher.lastName.toLowerCase()}`,
          };
          const withoutEntry = state.filter(
            (e) => e.day !== data.day || e.teacher.key !== editEntry.teacher.key
          );
          localforage.setItem<Absentee[]>(StorageKeys.ABSENTEES, [
            ...withoutEntry,
            editEntry,
          ]);
          return [...withoutEntry, editEntry];
        }
      }
      return state;
    case 'delete':
      if (data && !(data instanceof Array)) {
        const filtered = state.filter(
          (e) => e.day !== data.day || e.teacher.key !== data.teacher.key
        );
        localforage.setItem<Absentee[]>(StorageKeys.ABSENTEES, filtered);
        return filtered;
      }
      return state;
    case 'reset':
      return [];
  }
};

const AppProvider = (props: Props) => {
  localforage.createInstance({ name: 'teachers' });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [freePeriods, updateFreePeriods] = useReducer(reducerFreePeriods, []);
  const [timetable, updateTimetable] = useReducer(reducerTimetable, []);
  const [absentees, updateAbsentees] = useReducer(reducerAbsentee, []);

  useEffect(() => {
    (async () => {
      const _teachers = await localforage.getItem<Teacher[]>(
        StorageKeys.TEACHERS
      );
      if (_teachers?.length) setTeachers(_teachers);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const _subjects = await localforage.getItem<Subject[]>(
        StorageKeys.SUBJECTS
      );
      if (_subjects?.length) setSubjects(_subjects);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const _freePeriods = await localforage.getItem<FreePeriod[]>(
        StorageKeys.FREE_PERIODS
      );
      if (_freePeriods?.length) updateFreePeriods(['init', _freePeriods]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const _timetable = await localforage.getItem<Timetable[]>(
        StorageKeys.TIMETABLE
      );
      if (_timetable?.length) updateTimetable(['init', _timetable]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const _absentees = await localforage.getItem<Absentee[]>(
        StorageKeys.ABSENTEES
      );
      if (_absentees?.length) updateAbsentees(['init', _absentees]);
    })();
  }, []);

  // CRUD Teachers - these should really be reducers but anyways...
  const addTeacher = (teacher: Teacher) => {
    if (!teachers.find((t) => t && t.key === teacher.key)) {
      const newTeachers = [...teachers, teacher];
      localforage.setItem(StorageKeys.TEACHERS, newTeachers);
      setTeachers(newTeachers);
    }
  };
  const editTeacher = (teacher: Teacher) => {
    if (teachers.find((t) => t && t.key === teacher.key)) {
      const copy = teachers.map((t) => {
        if (t.key === teacher.key)
          t = {
            ...teacher,
            key: `${teacher.initial.toLowerCase()}-${teacher.firstName.toLowerCase()}-${teacher.lastName.toLowerCase()}`,
          };
        return t;
      });
      localforage.setItem(StorageKeys.TEACHERS, copy);
      setTeachers(copy);
      timetable.forEach(
        (t) =>
          t &&
          t.teacher.key === teacher.key &&
          updateTimetable(['edit', { ...t, teacher }])
      );
      absentees.forEach(
        (a) =>
          a &&
          a.teacher.key === teacher.key &&
          updateAbsentees(['edit', { ...a, teacher }])
      );
      freePeriods.forEach(
        (fp) =>
          fp &&
          fp.teacher.key === teacher.key &&
          updateFreePeriods(['edit', { ...fp, teacher }])
      );
    }
  };
  const deleteTeacher = (teacher: Teacher) => {
    const copy = teachers.filter((t) => t && t.key !== teacher.key);
    localforage.setItem(StorageKeys.TEACHERS, copy);
    setTeachers(copy);
    timetable.forEach(
      (t) =>
        t &&
        t.teacher.key === teacher.key &&
        updateTimetable(['delete', { ...t, teacher }])
    );
    absentees.forEach(
      (a) =>
        a &&
        a.teacher.key === teacher.key &&
        updateAbsentees(['delete', { ...a, teacher }])
    );
    freePeriods.forEach(
      (fp) =>
        fp &&
        fp.teacher.key === teacher.key &&
        updateFreePeriods(['delete', { ...fp, teacher }])
    );
  };
  // ----------------------------------------------

  // CRUD Subjects
  const addSubject = (subject: Subject) => {
    if (!subjects.find((s) => s && s.code === subject.code)) {
      const newSubjects = [...subjects, subject];
      localforage.setItem(StorageKeys.SUBJECTS, newSubjects);
      setSubjects(newSubjects);
    }
  };
  const editSubject = (subject: Subject) => {
    if (subjects.find((s) => s && s.key === subject.key)) {
      const copy = subjects.map((s) => {
        if (s.key === subject.key) s = subject;
        return s;
      });
      localforage.setItem(StorageKeys.SUBJECTS, copy);
      setSubjects(copy);
      timetable.forEach(
        (t) =>
          t &&
          t.subject.key === subject.key &&
          updateTimetable(['edit', { ...t, subject }])
      );
    }
  };
  const deleteSubject = (subject: Subject) => {
    const copy = subjects.filter((s) => s && s.key !== subject.key);
    localforage.setItem(StorageKeys.SUBJECTS, copy);
    setSubjects(copy);
    timetable.forEach(
      (t) => t.subject.key === subject.key && updateTimetable(['delete', t])
    );
  };
  // ----------------------------------------------

  const clearAllData = () => {
    localforage.clear();
    setTeachers([]);
    setSubjects([]);
    updateFreePeriods(['reset']);
    updateTimetable(['reset']);
    updateAbsentees(['reset']);
  };

  const value = {
    teachers,
    addTeacher,
    editTeacher,
    deleteTeacher,
    setTeachers,
    subjects,
    addSubject,
    editSubject,
    deleteSubject,
    setSubjects,
    freePeriods,
    updateFreePeriods,
    timetable,
    updateTimetable,
    absentees,
    updateAbsentees,
    clearAllData,
  };

  return React.createElement(appContext.Provider, { value }, props.children);
};

const Providers = (props: Props) => {
  return <AppProvider>{props.children}</AppProvider>;
};

export default Providers;
