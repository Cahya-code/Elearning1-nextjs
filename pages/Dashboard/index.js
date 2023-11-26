
import Layout from "../../dashboard/layout";

import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import Head from 'next/head';

import Link from 'next/link';

import moment from 'moment';

import React from "react";

import Router from 'next/router';

import axios from 'axios';


import Cookies from 'js-cookie';

export async function getServerSideProps(){
  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/mapel`)
  const res = req.data.data
  return {
    props :{
      mapel: res
    }
  }

}

function Dashboard(props) {
    const {mapel} = props;
    const token = Cookies.get('token');
    const [user, setUser] = useState({});
    const [pelajaran, setPelajaran] = useState('');
    const [updatemapel, setUpdatemapel] = useState([]);

    const fetchData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
        .then((response) => {
            setUser(response.data);
        })
    }

    const storeMapel= async (e) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append('nama', pelajaran);
      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/mapel`, formData)
      refreshData();
    }

    const refreshData = async () => {
        const responsemapel = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/mapel`)
        const refreshMapel = responsemapel.data.data
        setUpdatemapel(refreshMapel);
    }


    useEffect(() => {
        if(!token) {
          Router.push('/login');
        }
        fetchData();
        refreshData();
    }, []);

    const deleteMapel = async (id) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/mapel/${id}`)
      refreshData();
    }

    const logoutHanlder = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`)
        .then(() => {
            Cookies.remove("token");
            Router.push('/login');
        });
    };



    return (
        <Layout>
            <Head>
                <title>Login Account - SantriKoding.com</title>
            </Head>
            <div className="container" style={{ marginTop: "80px" }}>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card border-0 rounded shadow-sm">
                            <div className="card-body">
                                SELAMAT DATANG <strong className="text-uppercase">{user.name}</strong>
                                <hr />
                                <form onSubmit= {storeMapel}>
                              <label className="form-label fw-bold">Tambah Mata Pelajaran</label>
                              <input className="form-control" type="text" value={pelajaran}
                              onChange={(e) => setPelajaran(e.target.value)} placeholder="NAMA UJIAN" required />
                              <hr/>
                              <button className="btn btn-primary border-0 shadow-sm" type="submit">
                                  <strong>TAMBAH</strong>
                              </button>
                              </form>
                            </div>
                            <table className="table table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <th className ="text-center" scope="col">MATA PELAJARAN</th>
                                        <th className ="text-center"scope="col">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {updatemapel.map((mapel) => (
                                    <tr key={mapel.id}>
                                        <td className = "text-center"><strong>{ mapel.nama}</strong></td>
                                        <td className = "text-center">
                                        <Link legacyBehavior href={`/Ujian/Input/${mapel.id}`}>
                                            <button className="btn btn-primary border-0 shadow-sm mb-3 me-2">Tambah Ujian</button>
                                        </Link>
                                        <button className="btn btn-warning border-0 shadow-sm mb-3 me-2" onClick={()=>deleteMapel(mapel.id)}>Delete Soal</button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    )

}

export default Dashboard;
