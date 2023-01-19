import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { FreePeriod, Subject, Teacher } from './Types';

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

  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  editSubject: (subject: Subject) => void;
  deleteSubject: (subject: Subject) => void;

  freePeriods: FreePeriod[];
  updateFreePeriods: Dispatch<FreePeriodAction>;

  clearAllData: () => void;
}

const appContextValues: AppContext = {
  teachers: [],
  addTeacher: () => {},
  editTeacher: () => {},
  deleteTeacher: () => {},

  subjects: [],
  addSubject: () => {},
  editSubject: () => {},
  deleteSubject: () => {},

  freePeriods: [],
  updateFreePeriods: () => [],

  clearAllData: () => {},
};

const appContext = createContext<AppContext>(appContextValues);
export const useApp = () => useContext(appContext);
type CommonActions = 'init' | 'add' | 'edit' | 'delete' | 'reset';
type FreePeriodAction = [
  CommonActions,
  (FreePeriod | FreePeriod[] | undefined)?
];

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
          const withoutEntry = state.filter(
            (e) => e.day !== data.day || e.teacher.key !== data.teacher.key
          );
          localforage.setItem<FreePeriod[]>(StorageKeys.FREE_PERIODS, [
            ...withoutEntry,
            editEntry,
          ]);
          return [...state, data];
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

const AppProvider = (props: Props) => {
  localforage.createInstance({ name: 'teachers' });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [freePeriods, updateFreePeriods] = useReducer(reducerFreePeriods, []);

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

  // CRUD Teachers
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
    }
  };
  const deleteTeacher = (teacher: Teacher) => {
    const copy = teachers.filter((t) => t && t.key !== teacher.key);
    localforage.setItem(StorageKeys.TEACHERS, copy);
    setTeachers(copy);
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
    }
  };
  const deleteSubject = (subject: Subject) => {
    const copy = subjects.filter((s) => s && s.code !== subject.code);
    localforage.setItem(StorageKeys.SUBJECTS, copy);
    setSubjects(copy);
  };
  // ----------------------------------------------

  // CRUD Free Periods
  const addFreePeriod = async (freePeriod: FreePeriod) => {
    localforage
      .setItem<FreePeriod[]>(StorageKeys.FREE_PERIODS, [
        ...freePeriods,
        freePeriod,
      ])
      .then(() => updateFreePeriods(['add', freePeriod]));
  };
  const editFreePeriod = (freePeriod: FreePeriod) => {};
  const deleteFreePeriod = (freePeriod: FreePeriod) => {};
  // ----------------------------------------------

  const clearAllData = () => {
    localforage.clear();
    setTeachers([]);
    setSubjects([]);
    updateFreePeriods(['reset']);
  };

  const value = {
    teachers,
    addTeacher,
    editTeacher,
    deleteTeacher,
    subjects,
    addSubject,
    editSubject,
    deleteSubject,
    freePeriods,
    updateFreePeriods,
    clearAllData,
  };

  return React.createElement(appContext.Provider, { value }, props.children);
};

const Providers = (props: Props) => {
  return <AppProvider>{props.children}</AppProvider>;
};

export default Providers;
