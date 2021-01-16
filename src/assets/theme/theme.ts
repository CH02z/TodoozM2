export interface Theme {
    name: string;
    properties: any;
  }
  
  export const light: Theme = {
    name: "light",
    properties: {
      "--bg-app": "#F5F7FA",
      "--bg-card": "#ffffff",
      "--bg-due": "#c62b2b",
      "--bg-highprio": "#ffc44f",
      "--color-text": "#626262",
      "--color-textsecondary": "#cecece",
      "--color-line": "#d1d1d1",
    }
  };
  
  export const dark: Theme = {
    name: "dark",
    properties: {
        "--bg-app": "#333333",
        "--bg-card": "#434343",
        "--bg-due": "#843030",
        "--bg-highprio": "#d89d28",
        "--color-text": "#B5B5B5",
        "--color-textsecondary": "#cecece",
        "--color-line": "#565656",
      }
  };