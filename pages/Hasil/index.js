
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

export async function getServerSideProps() {

  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujihasil`)
  const res = req.data.data
  {
    return {
      props :{
        ujihasil : res
      }
    }
}
}

function UjihasilIndex (props) {

  const {ujihasil} = props;
  const router = useRouter();
  const token = Cookies.get('token');
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');
  const [filterUjian, setFilterUjian] = useState([]);

    const fetchDataUser = async() => {
    // axios.defaults.headers.common['Authorization'] = `Bearer${token}`
    await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
    .then((response) => {
      setUserId(response.data.id),
      setUser(response.data)
    })
  }

  const fetchfilterdata = () => {
    if(userId){
      const filterhasil = ujihasil.filter((ujihasil)=> ujihasil.id_user === userId);
      setFilterUjian(filterhasil);

    }
  }
  console.log('filterhasil :', filterUjian)

  useEffect(() => {
  fetchDataUser()
  },[])

  useEffect(() => {
   fetchfilterdata();
 }, [userId]);

   return (
     <Layout>
       <div className="container" style={{ marginTop: '80px' }}>
           <div className="row">
               <div className="col-md-12">
                   <div className="card border-0 shadow-sm rounded-3">
                       <div className="card-body">
                       Nama : <strong className="text-uppercase">{user.name}</strong>
                       <hr />
                           <table className="table table-bordered mb-0">
                               <thead>
                                   <tr>
                                       <th scope="col">Nama Ujian</th>
                                       <th scope="col">Kategori</th>
                                       <th scope="col">Tanggal Dikerjakan</th>
                                       <th scope ="col">Hasil</th>
                                   </tr>
                               </thead>
                               <tbody>
                               { filterUjian.map((ujihasil) => (
                                   <tr key={ujihasil.id}>
                                       <td className = "text-center">{ ujihasil.Nama_ujian}</td>
                                      <td> {ujihasil.Kategori}</td>
                                       <td>{moment(ujihasil.created_at).format('LLL')}</td>
                                       <td> {ujihasil.total}</td>
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

export default UjihasilIndex
