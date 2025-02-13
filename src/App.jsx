import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import RootComponent from "./components/RootComponent";
import Home from "./components/categories/Home";
import Report from "./components/categories/Report";
import Access from "./components/categories/Access";
import Setting from "./components/categories/Setting";
import Summaryrecipe from "./components/categories/Summaryrecipe";
import Foodrecipe from "./components/categories/Foodrecipe";
import Summaryentry from "./components/categories/Summaryentry";
import Foodrecipeentry from "./components/categories/Foodrecipeentry";
import Baserecipeentry from "./components/categories/Baserecipeentry";
import Ratemaster from "./components/categories/Ratemaster";
import Ratemasterentry from "./components/categories/Ratemasterentry";
import Baserecipe from "./components/categories/Baserecipe";
import Ratemasterdata from "./components/categories/Ratemasterdata";
import Comingsoon from "./components/categories/Comingsoon";

function App() {
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });

  // Define router with only the required pages: Home, Report, and Setting
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<Home />} /> {/* Default page */}
        <Route path="/home" element={<Home />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/access" element={<Access />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/recipesummary" element={<Summaryrecipe />} />
        <Route path="/foodrecipe" element={<Foodrecipe />} />
        <Route path="/summaryentry" element={<Summaryentry />} />
        <Route path="/foodrecipeentry" element={<Foodrecipeentry />} />
        <Route path="/baserecipeentry" element={<Baserecipeentry />} />
        <Route path="/ratemaster" element={<Ratemaster />} />
        <Route path="/ratemasterentry" element={<Ratemasterentry />} />
        <Route path="/baserecipe" element={<Baserecipe />} />
        <Route path="/ratemasterdata" element={<Ratemasterdata />} />
        <Route path="/comingsoon" element={<Comingsoon />} />
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;





{/*}
import Inter from "../public/static/fonts/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import RootComponent from "./components/RootComponent";
import Home from "./components/categories/Home";
import Report from "./components/categories/Report";
import Access from "./components/categories/Access";
import Setting from "./components/categories/Setting";
import Recipesummary from "./components/categories/Recipesummary";
import Foodrecipe from "./components/categories/Foodrecipe";
import Summaryentry from "./components/categories/Summaryentry";
import Foodrecipeentry from "./components/categories/Foodrecipeentry";
import Baserecipeentry from "./components/categories/Baserecipeentry";
import Ratemaster from "./components/categories/Ratemaster";
import Ratemasterentry from "./components/categories/Ratemasterentry";
import Baserecipe from "./components/categories/Baserecipe";
import Ratemasterdata from "./components/categories/Ratemasterdata";
import Comingsoon from "./components/categories/Comingsoon";

function App() {
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",
    },
    typography: {
      fontFamily: "Inter",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Inter'), url(${Inter}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });

  // Define router with only the required pages: Home, Report, and Setting
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<Home />} /> {/* Default page /}
        <Route path="/home" element={<Home />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/access" element={<Access />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/recipesummary" element={<Recipesummary />} />
        <Route path="/foodrecipe" element={<Foodrecipe />} />
        <Route path="/summaryentry" element={<Summaryentry />} />
        <Route path="/foodrecipeentry" element={<Foodrecipeentry />} />
        <Route path="/baserecipeentry" element={<Baserecipeentry />} />
        <Route path="/ratemaster" element={<Ratemaster />} />
        <Route path="/ratemasterentry" element={<Ratemasterentry />} />
        <Route path="/baserecipe" element={<Baserecipe />} />
        <Route path="/ratemasterdata" element={<Ratemasterdata />} />
        <Route path="/comingsoon" element={<Comingsoon />} />
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
*/}