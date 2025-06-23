import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "../global.css";
import Home from "./pages/Home";
import Layout from "./middleware/Layout";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import ProjectsPage from "./components/projects/ProjectsPage";
import ProjectDetailPage from "./components/projects/ProjectDetailPage";
import ServicesPage from "./components/services/ServicesPage";
import ServiceDetailPage from "./components/services/ServiceDetailPage";
import BlogListPage from "./components/blogs/BlogListPage";
import BlogDetailPage from "./components/blogs/BlogDetailPage";
import OrganizationalChart from "./components/employees/OrganizationalChart ";
import AboutUsPage from "./components/aboutUS/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return error?.response?.status === 408 ||
            error?.response?.status === 429
            ? failureCount < 2
            : false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: { main: "#FF6B35", light: "#FF8A65", dark: "#E55A2B" },
    secondary: { main: "#F7931E", light: "#FFB74D", dark: "#E0841A" },
    background: { default: "#FAFAFA", paper: "#FFFFFF" },
    text: { primary: "#2C2C2C", secondary: "#757575" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
  },
});

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route element={<PrivateRoute />}> */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path='/team' element={<OrganizationalChart/>}/>
          <Route path='/about' element={<AboutUsPage/>}/>
        </Route>
        {/* </Route> */}

        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};
export default App;
