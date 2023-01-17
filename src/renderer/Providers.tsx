import { createContext, useEffect, useState } from 'react';

import React from 'react';

type Props = {
  children: React.ReactNode;
};

interface AppContext {
  teachers: any[];
}

const appContextValues: AppContext = {
  teachers: [],
};

const appContext = createContext<AppContext>(appContextValues);

const AppProvider = (props: Props) => {
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    const _teachers = localStorage.getItem('teachers');
    if (_teachers?.length) setTeachers(JSON.parse(_teachers));
  }, []);

  const value = {
    teachers,
  };

  return React.createElement(appContext.Provider, { value }, props.children);
};

const Providers = (props: Props) => {
  return <AppProvider>{props.children}</AppProvider>;
};

export default Providers;
