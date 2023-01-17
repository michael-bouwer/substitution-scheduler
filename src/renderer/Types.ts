export interface Teacher {
  key: string;
  initial: string;
  firstName: string;
  lastName: string;
  email: string | undefined;
  contact: string | undefined;
}

export interface Subject {
  name: string;
  code: string;
  description: string | undefined;
}
