import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

export const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e10a93',
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#e10a93',
  },
};
