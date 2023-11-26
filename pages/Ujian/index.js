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

export async function getServerSideProps() {
   const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujian`)
   const res = req.data.data
   return {
     props :{
       ujian : res
     }
   }
}

function UjianIndex (props) {

  const {ujian} = props;
  const router = useRouter();
  const token = Cookies.get('token');

  const [validation, setValidation] = useState([]);
  const [filterUjian, setFilterUjian] = useState([]);
  const [filterUjian1, setFilterUjian1] = React.useState([]);
  const [userId, setUserId] = useState ('');
  const [user, setUser] = useState ('');
  const [tableData, setTableData] = useState (ujian)

  const fetchData = async () => {
    axios.defaults.headers.common['Authorization'] =`Bearer${token}`
    await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
    .then((response) => {
      setUser(response.data)
      setUserId(response.data.id);
    });
  };

  const filterUjianById = () => {
  if (userId) {
    const filterData = ujian.filter((ujian) => ujian.id_user === userId);
    setFilterUjian(filterData);
    setFilterUjian1(ujian);
  }
};

  const deleteSoal = async (id) =>{
  await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujian/${id}`)
  refreshData();
  }

  const refreshData = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujian`)
    const refreshUjian = response.data.data
    const updateujian = refreshUjian.filter((ujian)=> ujian.id_user === userId);
    const response1 = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujian`)
    const refreshUjian1 = response.data.data
    const updateujian1 = refreshUjian1;
    setFilterUjian(updateujian);
    setFilterUjian1(updateujian1);
  }

  const handleSearch = (searchTerm) => {
        const filteredujian = ujian.filter((ujian) =>{
        return ujian.nama_ujian.toLowerCase().includes(searchTerm.toLowerCase());
    })
    setFilterUjian1(filteredujian);

  }


  useEffect(() => {
    if(!token) {
      Router.push('/login');
    }
    fetchData();
  },[]);

  useEffect(() => {
    filterUjianById();
  },[userId]);

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
                                      <th scope="col">Guru</th>
                                      <th scope="col">Nama_Ujian</th>
                                      <th scope="col">Kategori</th>
                                      <th scope ="col"> MAPEL </th>
                                      <th scoper="col">Tanggal Buat </th>
                                  </tr>
                              </thead>
                              <tbody>
                              { filterUjian.map((ujian) => (
                                  <tr key={ujian.id}>
                                      <td className = "text-center">{ ujian.nama_user}</td>
                                      <td> {ujian.nama_ujian}</td>
                                      <td> {ujian.tipe_ujian}</td>
                                      <td> {ujian.mapel_name}</td>
                                      <td>{moment(ujian.created_at).format('LLL')}</td>
                                      <td>
                                      <Link legacyBehavior href={`/Soal/${ujian.id}`}>
                                          <button className="btn btn-primary border-0 shadow-sm mb-3 me-2">Detail Soal</button>
                                      </Link>
                                      <button className="btn btn-danger border-0 shadow-sm mb-3 ms-2" onClick = {()=>deleteSoal(ujian.id)}>Hapus</button>
                                      </td>

                                  </tr>
                              ))}
                              </tbody>
                          </table>
                          <hr/>
                          <hr/>
                          <div className="d-flex justify-content-center align-items-center">
                            <strong className="text-uppercase">  Bank Soal
                              SMA 3 Kayu Rampang</strong>
                          </div>
                        <hr/>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => handleSearch(e.target.value)}/>
                          <button className="btn btn-success" type="submit">Search</button>
                        </form><hr/>
                          <table className="table table-bordered mb-0">
                              <thead>
                                  <tr>
                                      <th scope="col">Nama_Ujian</th>
                                      <th scope="col">Kategori</th>
                                      <th scope="col">MAPEL</th>
                                      <th scoper="col">Tanggal Buat </th>
                                  </tr>
                              </thead>
                              <tbody>
                              { filterUjian1.map((ujian) => (
                                  <tr key={ujian.id}>

                                      <td> {ujian.nama_ujian}</td>
                                      <td> {ujian.tipe_ujian}</td>
                                      <td className = "text-center">{ ujian.mapel_name}</td>
                                      <td>{moment(ujian.created_at).format('LLL')}</td>
                                      <td>
                                      <Link legacyBehavior href={`/BankSoal/${ujian.id}`}>
                                          <button className="btn btn-primary border-0 shadow-sm mb-3 me-2">Lihat</button>
                                      </Link><Link legacyBehavior href={`/Soal/work/${ujian.id}?startTimer=true`}>
                                          <button className="btn btn-primary border-0 shadow-sm mb-3 me-2">Kerjakan</button>
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

export default UjianIndex
