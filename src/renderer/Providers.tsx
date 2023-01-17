import { Subject, Teacher } from './Types';
import { createContext, useContext, useEffect, useState } from 'react';

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
  clearAllData: () => {},
};

const appContext = createContext<AppContext>(appContextValues);
export const useApp = () => useContext(appContext);

const AppProvider = (props: Props) => {
  localforage.createInstance({ name: 'teachers' });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

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

  const addSubject = (subject: Subject) => {
    if (!subjects.find((s) => s && s.code === subject.code)) {
      const newSubjects = [...subjects, subject];
      localforage.setItem(StorageKeys.SUBJECTS, newSubjects);
      setSubjects(newSubjects);
    }
  };

  const editSubject = (subject: Subject) => {
    if (subjects.find((s) => s && s.code === subject.code)) {
      const copy = subjects.map((s) => {
        if (s.code === subject.code) s = subject;
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

  const clearAllData = () => {
    localforage.clear();
    setTeachers([]);
    setSubjects([]);
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
    clearAllData,
  };

  return React.createElement(appContext.Provider, { value }, props.children);
};

const Providers = (props: Props) => {
  return <AppProvider>{props.children}</AppProvider>;
};

export default Providers;
