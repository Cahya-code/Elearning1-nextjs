//layout
import Layout from "../../components/layout";

//import hook react
import { useState, useEffect } from 'react';

//import Head
import Head from 'next/head';

import Link from 'next/link';

//import router
import Router from 'next/router';

//import axios
import axios from "axios";

//import js cookie
import Cookies from 'js-cookie';

function Login() {

    //define state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //define state validation
    const [validation, setValidation] = useState([]);

    //function "loginHanlder"
    const loginHandler = async (e) => {
        e.preventDefault();

        //initialize formData
        const formData = new FormData();

        //append data to formData
        formData.append('email', email);
        formData.append('password', password);

        //send data to server
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/login`, formData)
        .then((response) => {

            //set token on cookies
            Cookies.set('token', response.data.token);

            //redirect to dashboard
            Router.push('/Dashboard');
        })
        .catch((error) => {

            //assign error to state "validation"
            setValidation(error.response.data);
        })
    };

    //hook useEffect
    useEffect(() => {

        //check token
        if(Cookies.get('token')) {

            //redirect page dashboard
            Router.push('/dashboard');
        }
    }, []);

    return(
        <Layout>
            <Head>
                <title>Login Account - SantriKoding.com</title>
            </Head>
            <div className="container" style={{ marginTop: '80px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card border-0 rounded shadow-sm">
                            <div className="card-body">
                                <h4 className="fw-bold">HALAMAN LOGIN</h4>
                                <hr/>
                                {
                                    validation.message && (
                                        <div className="alert alert-danger">
                                            {validation.message}
                                        </div>
                                    )
                                }
                                <form onSubmit={loginHandler}>
                                    <div className="mb-3">
                                        <label className="form-label">ALAMAT EMAIL</label>
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan Alamat Email" required/>
                                    </div>
                                    {
                                        validation.email && (
                                            <div className="alert alert-danger">
                                                {validation.email[0]}
                                            </div>
                                        )
                                    }
                                    <div className="mb-3">
                                        <label className="form-label">PASSWORD</label>
                                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan Password" required/>
                                    </div>
                                    {
                                        validation.password && (
                                            <div className="alert alert-danger">
                                                {validation.password[0]}
                                            </div>
                                        )
                                    }
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">LOGIN</button>
                                        <hr />
                                      <Link legacyBehavior href = "/register">
                                        <button type="submit" className="btn btn-primary">REGISTER</button>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Login
