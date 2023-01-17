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
  addTeacher: (newTeacher: Teacher) => void;
  editTeacher: (teacher: Teacher) => void;
  subjects: Subject[];
}

const appContextValues: AppContext = {
  teachers: [],
  addTeacher: () => {},
  editTeacher: () => {},
  subjects: [],
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

  const addTeacher = (newTeacher: Teacher) => {
    if (!teachers.find((t) => t && t.key === newTeacher.key)) {
      const newTeachers = [...teachers, newTeacher];
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

  const addSubject = (newSubject: Subject) => {
    if (!subjects.find((s) => s && s.code === newSubject.code)) {
      const newSubjects = [...subjects, newSubject];
      localforage.setItem(StorageKeys.SUBJECTS, newSubjects);
      setSubjects(newSubjects);
    }
  };

  const value = {
    teachers,
    addTeacher,
    editTeacher,
    subjects,
  };

  return React.createElement(appContext.Provider, { value }, props.children);
};

const Providers = (props: Props) => {
  return <AppProvider>{props.children}</AppProvider>;
};

export default Providers;
