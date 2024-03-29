import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import UploadPage from "./pages/UploadPage"
import RegisterPage from "./pages/RegisterPage"
import NotFound from "./pages/NotFound"
import MainPage from "./pages/MainPage"
import ResultsPage from "./pages/ResultsPage"
import SettingsPage from "./pages/SettingsPage"

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<LandingPage />}></Route>
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/register' element={<RegisterPage />}></Route>
            <Route path='/upload' element={<UploadPage />}></Route>
            <Route path='/main' element={<MainPage />}></Route>
            <Route path='/results' element={<ResultsPage />}></Route>
            <Route path='/settings' element={<SettingsPage />}></Route>
            <Route path='*' element={<NotFound />}></Route>
        </Routes>
    </BrowserRouter>
  );
};

export default Router;