import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link , useNavigate} from 'react-router-dom';
import { SidebarData } from '../data/NavBar';
import '../styles/Navbar.css';
import { IconContext } from 'react-icons';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const { currentUser, logout } = useAuth();

  const showSidebar = () => setSidebar(!sidebar);

  const history = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    history("/login");
  }

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className='text-light font-weight-bold p-2'>
            {currentUser && `Hello, ${currentUser.firstName} ${currentUser.secondName}`}
          </div>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              if((SidebarData.length - 1) === index ){
                return(
                  <li key={index} className={item.cName} style={{ cursor: "pointer" }} onClick={handleLogout}>
                    <a>
                      {item.icon}
                      <span className='text-light'>{item.title}</span>
                    </a>
                  </li>
                )
              }else {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              }
              
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;