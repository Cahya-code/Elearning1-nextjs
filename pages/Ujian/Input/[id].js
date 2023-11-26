//layout
import Layout from "../../../dashboard/layout";

//import hook react
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
//import Head
import Head from 'next/head';

import Link from 'next/link';
//import router
import Router from 'next/router';

//import axios
import axios from 'axios';

//import js cookie
import Cookies from 'js-cookie';

export async function getServerSideProps (context) {
  const {params} = context;
  const {id} = params;
  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/mapel/${id}`);
  const res = req.data.data

  return {
    props :{
      mapel : res
    },
  }
}

function UjianCreate(props) {

  const router = useRouter();
  const {mapel} = props;
  const {query} = useRouter ();
  const token = Cookies.get('token');

  const [mapel_name, setMapel_name] = useState (mapel.nama);
  const [nama_ujian, setNama_ujian] = useState('');
  const [tipe_ujian, setTipe_ujian] = useState('');
  const [mapel_id, setMapel_id] = useState(mapel.id);
  const [nama_user, setNama_user] = useState('');
  const [id_user, setId_user] =useState('');
  const [user, setUser] = useState('');

  const [validation, setValidation] = useState ([]);

  const fetchData = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer${token}`
    await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
    .then((response) => {
      setUser(response.data);
      setNama_user(response.data.name);
      setId_user(response.data.id);
    })
  }

    useEffect (() => {
      if(!token) {
        Router.push('/login');
      }
      fetchData();
    }, []);

    const storeUjian = async (e) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append('mapel_name', mapel_name);
      formData.append('nama_ujian', nama_ujian);
      formData.append('tipe_ujian', tipe_ujian);
      formData.append('mapel_id', mapel_id);
      formData.append('nama_user', nama_user);
      formData.append('id_user', id_user);

      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujian`, formData)
      .then(()=> {
        Router.push('/Ujian')
      })
      .catch((error)=> {
        setValidation(error.response.data);
      })
    };

    return (
      <Layout>
  <div className="container" style={{ marginTop: '80px' }}>
          <div className="row">
              <div className="col-md-12">
                  <div className="card border-0 rounded shadow-sm">
                      <div className="card-body">
                          <form onSubmit={storeUjian}>
                                <div className="form-group mb-3">
                                <strong className="text-uppercase">{user.name}</strong>
                                <hr />

                                  <label className="form-label fw-bold">Nama Ujian</label>
                                  <textarea className="form-control" type="text" value={nama_ujian} onChange={(e) => setNama_ujian(e.target.value)} placeholder="NAMA UJIAN" required />
                              </div>
                              {
                                  validation.nama &&
                                      <div className="alert alert-danger">
                                          {validation.nama}
                                      </div>
                              }

                              <div className="form-group mb-3">
                                  <label className="form-label fw-bold">JENIS UJIAN</label>
                                  <select className="form-control" value={tipe_ujian} onChange={(e) => setTipe_ujian(e.target.value)} required>
                                  <option >Kategori</option>
                                  <option value="UTS">UTS</option>
                                  <option value="UAS">UAS</option>
                                  <option value="QUIZ">QUIZ</option>
                                  <option value="UH">UH</option>
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

export default UjianCreate
