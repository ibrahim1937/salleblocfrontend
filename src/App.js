import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import Bloc from './pages/Bloc';
import Salle from './pages/Salle';
import Creneau from './pages/Creneau';
import Occupation from './pages/Occupation';
import QrCodePage from './pages/QrCodePage';
import Login from './pages/Login';
import DatatablePage from './pages/Test2';
import 'sweetalert2/src/sweetalert2.scss'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"
import History from './pages/History';
import SignUp from './pages/SignUp';
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from "./Routes/AuthRoutes";
import NotAuthRoutes from "./Routes/NotAuthRoutes";


function App() {
  return (
    <>
      
        <Router>
          <AuthProvider>
            <ToastContainer />
            <Routes>
                <Route element={<AuthRoutes />}>
                  <Route path="/" exact element={<Home />} />
                  <Route path="/bloc" exact element={<Bloc />} />
                  <Route path="/salle" exact element={<Salle />} />
                  <Route path="/creneau" exact element={<Creneau />} />
                  <Route path="/occupation" exact element={<Occupation />} />
                  <Route path="/qrcode" exact element={<QrCodePage />} />
                  <Route path="/test" exact element={<DatatablePage />} />
                  <Route path="/history" exact element={<History />} />
                </Route>
                <Route element={<NotAuthRoutes />}>
                  <Route path="/signup" exact element={<SignUp />} />
                  <Route path="/login" exact element={<Login />} />
                </Route>
             
             

            </Routes>  
      
            </AuthProvider>
        </Router>
    </>
  );
}
export default App;
