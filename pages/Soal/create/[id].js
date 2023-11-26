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

export async function getServerSideProps(context) {
  const {params} = context;
  const {id} = params;
  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujian/${id}`)
  const res = req.data.data

  return {
    props :{
      ujian: res
    }
  }
}

function CreateSoal(props) {
   const {ujian} = props;
   const router = useRouter();
   const {query} = useRouter();
   const token = Cookies.get('token')

   const [ujian_id, setUjian_id] = useState (ujian.id)
   const [soal_text, setSoal_text] = useState ('');
   const [pilihan_a, setPilihan_a] = useState ('');
   const [pilihan_b, setPilihan_b] = useState ('');
   const [pilihan_c, setPilihan_c] = useState ('');
   const [pilihan_d, setPilihan_d] = useState ('');
   const [nilai_benar, setNilai_benar] = useState ('')
   const [user, setUser] = useState('');

   const [validation, setValidation] = useState ([]);

   const fetchData = async () => {
     axios.defaults.headers.common ['Authorization'] = `Bearer${token}`
     await axios.get (`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
     .then((response) => {
       setUser(response.data);
     })
   }

   useEffect(()=> {
     if(!token) {
       Router.push('/login');
     }
     fetchData();
   }, []);

   const storeSoal = async (e) => {
     e.preventDefault();

     const formData = new FormData();

     formData.append('soal_text', soal_text);
     formData.append('pilihan_a', pilihan_a);
     formData.append('pilihan_b', pilihan_b);
     formData.append('pilihan_c', pilihan_c);
     formData.append('pilihan_d', pilihan_d);
     formData.append('nilai_benar', nilai_benar);
     formData.append('ujian_id', ujian_id);

     await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/soal`, formData)
     .then(()=> {
       Router.push(`/Soal/${ujian.id}`)
     })
     .catch((error)=> {
       setValidation (error.response.data);
     })
     console.log("formData:", formData);
  };
  return (
    <Layout>
         <div className="container" style={{ marginTop: '80px' }}>
                 <div className="row">
                     <div className="col-md-12">
                         <div className="card border-0 rounded shadow-sm">
                             <div className="card-body">
                                 <form onSubmit={storeSoal}>
                                               <div className="form-group mb-3">
                                         <label className="form-label fw-bold">PERTANYAAN</label>
                                         <textarea className="form-control" type="text" value={soal_text} onChange={(e) => setSoal_text(e.target.value)} placeholder="Pertanyaan" required />
                                     </div>
                                     {
                                         validation.soal_text &&
                                             <div className="alert alert-danger">
                                                 {validation.soal_text}
                                             </div>
                                     }

                                     <div className="form-group mb-3">
                                         <label className="form-label fw-bold">Jawaban A</label>
                                         <input className="form-control" rows={3} value={pilihan_a} onChange={(e) => setPilihan_a(e.target.value)} placeholder="" required />
                                     </div>
                                     {
                                         validation.pilihan_a && (
                                             <div className="alert alert-danger">
                                                 {validation.pilihan_a}
                                             </div>
                                     )}

                                     <div className="form-group mb-3">
                                         <label className="form-label fw-bold">Jawaban B</label>
                                         <input className="form-control" rows={3} value={pilihan_b} onChange={(e) => setPilihan_b(e.target.value)} placeholder="Masukkan Content"  required/>
                                     </div>
                                     {
                                         validation.pilihan_b && (
                                             <div className="alert alert-danger">
                                                 {validation.pilihan_b}
                                             </div>
                                     )}


                                     <div className="form-group mb-3">
                                         <label className="form-label fw-bold">Jawaban C</label>
                                         <input className="form-control" rows={3} value={pilihan_c} onChange={(e) => setPilihan_c(e.target.value)} placeholder="Masukkan Content" required/>
                                     </div>
                                     {
                                         validation.pilihan_c && (
                                             <div className="alert alert-danger">
                                                 {validation.pilihan_c}
                                             </div>
                                     )}


                                     <div className="form-group mb-3">
                                         <label className="form-label fw-bold">Jawaban D</label>
                                         <input className="form-control" rows={3} value={pilihan_d} onChange={(e) => setPilihan_d(e.target.value)} placeholder="Masukkan Content" required/>
                                     </div>
                                     {
                                         validation.pilihan_d && (
                                             <div className="alert alert-danger">
                                                 {validation.pilihan_d}
                                             </div>
                                     )}

                                     <div className="form-group mb-3">
                                         <label className="form-label fw-bold">Jawaban Benar</label>
                                         <select className="form-control" value={nilai_benar} onChange={(e) => setNilai_benar(e.target.value)} required>
                                         <option >Pilih Jawaban Benar</option>
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

export default CreateSoal
