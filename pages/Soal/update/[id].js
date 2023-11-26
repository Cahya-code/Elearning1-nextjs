//layout
import Layout from "../../../dashboard/layout";

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

export async function getServerSideProps (context) {
  const {params} = context;
  const {id} = params;

  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/soal/${id}`)
  const res = req.data.data

  return {
    props :{
        soal : res
    }
  }
}

  function EditSoal (props) {
    const {soal} = props;
    const router = useRouter();
    const token = Cookies.get('token')

    const [soal_text, setSoal_text] = useState(soal.soal_text);
    const [pilihan_a, setPilihan_a] = useState (soal.pilihan_a);
    const [pilihan_b, setPilihan_b] = useState (soal.pilihan_b);
    const [pilihan_c, setPilihan_c] = useState (soal.pilihan_c);
    const [pilihan_d, setPilihan_d] = useState (soal.pilihan_d);
    const [nilai_benar, setNilai_benar] = useState (soal.nilai_benar);
    const [user, setUser] = useState ('');
    const [userid, setUserid] = useState('');
    const [filteranswer, setFilteranswer] = useState ('');

    const [validation, setValidation] = useState ([]);

    const fetchData = async () => {
    axios.defaults.headers.common ['Authorization'] = `Bearer${token}`;
    await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
    .then ((response) => {
      setUser(response.data)
      setUserid(response.data.id)
    })
  }

  const fecthDataAnswer = async () => {
        const dataupdate = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/jawaban/${soal.id}`)
        setFilteranswer(dataupdate);
  }

    const updateHandler = async (e) => {
      e.preventDefault();

      const formData = new FormData ();

      formData.append ('soal_text', soal_text);
      formData.append ('pilihan_a', pilihan_a);
      formData.append ('pilihan_b', pilihan_b);
      formData.append ('pilihan_c', pilihan_c);
      formData.append ('pilihan_d', pilihan_d);
      formData.append ('nilai_benar', nilai_benar);
      formData.append ('_method', 'PUT');

      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/soal/${soal.id}`, formData)
      .then(() => {
        Router.push(`/Soal/${soal.ujian_id}`)
      })
      .catch((error) => {
        setValidation(error.response.data);
      })
    };

    useEffect (() => {
      if (!token) {
        Router.push('/login')
      }
      fetchData();
      fecthDataAnswer();
    }, []);

    return (
      <Layout>
           <div className="container" style={{ marginTop: '80px' }}>
                   <div className="row">
                       <div className="col-md-12">
                           <div className="card border-0 rounded shadow-sm">
                               <div className="card-body">
                                   <form onSubmit={updateHandler}>
                                        <div className="form-group mb-3">
                                           <label className="form-label fw-bold">PERTANYAAN</label>
                                           <textarea className="form-control" type="text" value={soal_text} onChange={(e) => setSoal_text(e.target.value)} placeholder="Pertanyaan"/>
                                       </div>
                                            <div className="form-group mb-3">
                                             <label className="form-label fw-bold">Jawaban A</label>
                                             <input className="form-control" type="text" rows={3} value={pilihan_a} onChange={(e) => setPilihan_a(e.target.value)} placeholder=""/>
                                         </div>

                                         <div className="form-group mb-3">
                                             <label className="form-label fw-bold">Jawaban B</label>
                                             <input className="form-control"  type="text" rows={3} value={pilihan_b} onChange={(e) => setPilihan_b(e.target.value)} placeholder="Masukkan Content" />
                                         </div>

                                         <div className="form-group mb-3">
                                             <label className="form-label fw-bold">Jawaban C</label>
                                             <input className="form-control" type="text" rows={3} value={pilihan_c} onChange={(e) => setPilihan_c(e.target.value)} placeholder="Masukkan Content"/>
                                         </div>

                                         <div className="form-group mb-3">
                                             <label className="form-label fw-bold">Jawaban D</label>
                                             <input className="form-control" type="text" rows={3} value={pilihan_d} onChange={(e) => setPilihan_d(e.target.value)} placeholder="Masukkan Content" />
                                         </div>

                                       <div className="form-group mb-3">
                                           <label className="form-label fw-bold">Jawaban Benar</label>
                                           <select className="form-control" value={nilai_benar} onChange={(e) => setNilai_benar(e.target.value)} >
                                           <option value ="">Pilih Jawaban Benar</option>
                                           <option value="A">A</option>
                                           <option value="B">B</option>
                                           <option value="C">C</option>
                                           <option value="D">D</option>
                                           </select>
                                       </div>
                                       <button className="btn btn-primary border-0 shadow-sm" type="submit">
                                           SIMPAN
                                       </button>
                                   </form>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </Layout>

    )
  }

  export default EditSoal
