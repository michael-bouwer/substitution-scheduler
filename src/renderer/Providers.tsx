import { createContext, useContext, useEffect, useState } from 'react';

import React from 'react';
import { StorageKeys } from './lib';
import { Teacher } from './Types';
import localforage from 'localforage';

type Props = {
  children: React.ReactNode;
};

interface AppContext {
  teachers: Teacher[];
  addTeacher: (
    initial: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: string
  ) => void;
}

const appContextValues: AppContext = {
  teachers: [],
  addTeacher: () => {},
};

const appContext = createContext<AppContext>(appContextValues);
export const useApp = () => useContext(appContext);

const AppProvider = (props: Props) => {
  localforage.createInstance({ name: 'teachers' });

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    (async () => {
      const _teachers = await localforage.getItem<Teacher[]>(
        StorageKeys.TEACHERS
      );
      if (_teachers?.length) setTeachers(_teachers);
    })();
  }, []);

  const addTeacher = (
    initial: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: string
  ) => {
    const newTeacher = {
      key: `${initial.toLowerCase()}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      initial,
      firstName,
      lastName,
      email,
      contact,
    };
    if (!teachers.find((t) => t && t.key === newTeacher.key)) {
      const newTeachers = [...teachers, newTeacher];
      localforage.setItem(StorageKeys.TEACHERS, newTeachers);
    }
  };

  const value = {
    teachers,
    addTeacher,
  };

  return React.createElement(appContext.Provider, { value }, props.children);
};

const Providers = (props: Props) => {
  return <AppProvider>{props.children}</AppProvider>;
};

export default Providers;
