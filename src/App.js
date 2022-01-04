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
import Test from './pages/Test';
import DatatablePage from './pages/Test2';
import 'sweetalert2/src/sweetalert2.scss'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"
import History from './pages/History';

function App() {
  return (
    <>
      <Router>
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/bloc" exact element={<Bloc />} />
            <Route path="/salle" exact element={<Salle />} />
            <Route path="/creneau" exact element={<Creneau />} />
            <Route path="/occupation" exact element={<Occupation />} />
            <Route path="/qrcode" exact element={<QrCodePage />} />
            <Route path="/test" exact element={<DatatablePage />} />
            <Route path="/history" exact element={<History />} />
          </Routes>
      </Router>
    </>
  );
}
export default App;
