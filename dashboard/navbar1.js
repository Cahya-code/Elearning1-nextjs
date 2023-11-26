
import Link from 'next/link';

import axios from 'axios';

import Router from 'next/router';

import { useState, useEffect } from 'react';

import Cookies from 'js-cookie';



function Navbar() {

  const token = Cookies.get('token');
  const [user, setUser] = useState({});

  const fetchData = async () => {

    axios.defaults.headers.common['Authorization'] = ` Bearer${token}`
    await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
    .then((response)=> {
      setUser(response.data)
    })
  }

  const logoutHanlder = async () => {

    axios.defaults.headers.common['Authorization'] = `Bearer${token}`;
    await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`)
    .then(() => {
      Cookies.remove("token");

      Router.push('/login')
    })
  }

    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark fixed-top border-0 shadow-sm">
                <div className="container">
                    <Link legacyBehavior href="/Dashboard">
                        <a className="navbar-brand">DAHSBOARD</a>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                            <Link legacyBehavior href ="/Ujian">
                                <a className="nav-link text-warning me-2" ><strong>UJIAN</strong></a>
                            </Link>
                            </li>
                            <li className="nav-item">
                            <button onClick={logoutHanlder} className="btn btn-md btn-danger me-3">LOGOUT</button>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
        </header>
    )

}

export default Navbar
