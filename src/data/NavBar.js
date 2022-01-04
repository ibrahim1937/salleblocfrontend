import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as SiIcons from 'react-icons/si';
import * as FcIcons from 'react-icons/fc';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Bloc',
    path: '/bloc',
    icon: <FaIcons.FaSchool />,
    cName: 'nav-text'
  },
  {
    title: 'Salle',
    path: '/salle',
    icon: <SiIcons.SiGoogleclassroom />,
    cName: 'nav-text'
  },
  {
    title: 'Creneau',
    path: '/creneau',
    icon: <AiIcons.AiOutlineFieldTime />,
    cName: 'nav-text'
  },
  {
    title: 'Occupation',
    path: '/occupation',
    icon: <FcIcons.FcOvertime />,
    cName: 'nav-text'
  },
  {
    title: 'Qr Generator',
    path: '/qrcode',
    icon: <FaIcons.FaQrcode />,
    cName: 'nav-text'
  },
  {
    title: 'History',
    path: '/history',
    icon: <FaIcons.FaHistory />,
    cName: 'nav-text'
  }
  // {
  //   title: 'Messages',
  //   path: '/messages',
  //   icon: <FaIcons.FaEnvelopeOpenText />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Support',
  //   path: '/support',
  //   icon: <IoIcons.IoMdHelpCircle />,
  //   cName: 'nav-text'
  // }
];