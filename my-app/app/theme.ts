import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E5A88',
    secondary: '#4A90E2',
    error: '#B00020',
    background: '#F5F5F5',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export default theme; 