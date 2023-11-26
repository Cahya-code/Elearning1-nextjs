//layout
import Layout from "../../dashboard/layout";

//import hook react
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
//import Head
import Head from 'next/head';

import Link from 'next/link';

import moment from 'moment';

import React from "react";
//import router
import Router from 'next/router';

//import axios
import axios from 'axios';

//import js cookie
import Cookies from 'js-cookie';

export async function getServerSideProps(context) {

  const {params} = context;
  const {id} = params;

  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujian/${id}`)
  const res = req.data.data

  return {
    props :{
      ujian : res
    }
  }
}

  function SoalIndex(props) {
    const {ujian} = props;
    const router = useRouter();
    const token = Cookies.get('token');

    const [user, setUser] = useState ({});
    const [filterdata, setFilterdata] = useState ([]);

    const fetchData = async () => {
      axios.defaults.headers.common['Authorization'] =`Bearer${token}`
      await axios.get (`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
      .then((response) => {
        setUser(response.data)
      });
    };

    const fetchDatasoal = async () => {
      if(ujian) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/byid/${ujian.id}`)
          .then((response) => {
            setFilterdata(response.data.data);
          });
        }
    };

    const deleteSoal = async (id) => {
      const baseUrl = router.basePath;
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}${baseUrl}/api/soal/${id}`)
      fetchDatasoal();
    }


    useEffect(() => {
      if(!token) {
        Router.push('/login')
      }
      fetchData();
      fetchDatasoal();
    }, []);

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
                                    Nama :<strong className="text-uppercase">{user.name}</strong>
                                    <hr />
                                      <table className="table table-bordered mb-5">
                                        <thead>
                                          <tr>
                                    <th className= "text-center"scope="col">Nama Ujian</th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                          <td className = "text-center">
                                            Judul : {ujian.nama_ujian} <br />
                                            Tanggal dibuat :{moment(ujian.created_at).format('LL')} <br/>
                                            Oleh : {user.name}
                                                <br />   <br />
                                            <Link legacyBehavior href={`/Soal/create/${ujian.id}`}>
                                            <button className="btn btn-sm btn-danger border-0 shadow-sm mb-3 me-3">TAMBAH SOAL</button>
                                            </Link></td>

                                      </tr>
                                    </tbody>
                                    </table>
                                    <hr />

                                    <table className="table table-bordered mb-5">
                                      <thead>
                                        <tr>
                                  <th scope="col">Soal</th>
                                  <th scope ="col"> Kunci Jawaban </th>
                                  <th scope ="col"> Jawaban </th>
                                  <th scope="col">aksi</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {filterdata.map((soal) => (
                                        <tr key={soal.id}>
                                          <td>{soal.soal_text}</td>
                                          <td><strong>{soal.Kunci_jawaban}</strong></td>
                                        <td>
                                    {soal.jawaban.map((jawaban) => (
                                      <div key={jawaban.id}>{jawaban.answer}</div>
                                    ))}
                                    </td>
                                  <td className="text-center">
                                  <button onClick ={()=> deleteSoal(soal.id)} href= {`/api/soal/${soal.id}`}className="btn btn-sm btn-danger border-0 shadow-sm mb-3 me-3">DELETE</button>
                          <Link legacyBehavior href={`/Soal/update/${soal.id}`}>
                           <button className="btn btn-sm btn-warning border-0 shadow-sm mb-3 me-3"><strong>EDIT</strong></button>
                         </Link>
                       </td>
                     </tr>
                   ))}
                    </tbody>
                      </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
    )
  }

  export default SoalIndex
