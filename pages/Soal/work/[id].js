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

import ReactDOM from 'react-dom';

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

function indexBank (props) {
  const {ujian} = props;
  const token = Cookies.get('token');
  const router = useRouter();

  const [user, setUser] = useState([]);
  const [filterdata, setFilterdata] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const [validation, setValidation] = useState([]);
  const [nama_ujian, setNama_ujian] = useState(ujian.nama_ujian);
  const [kategori, setKategori] = useState (ujian.tipe_ujian);

  // const pada handlechange and handlesubmit
  const [selectedValues, setSelectedValues] = useState([]);
  const [valuesint, setValuesint] = useState([]);
  const [valuesarray, setValuesarray] = useState([]);
  const [user_id, setUser_id] = useState('');
  const [nama_user, setNama_user] = useState('');

  const secondToTime = (seconds) => {
    const hours = Math.floor (seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }


  const fetchDataUser = async() => {
    axios.defaults.headers.common['Authorization'] = `Bearer${token}`;
    await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/user`)
    .then((response)=> {
      setUser(response.data)
      setUser_id(response.data.id)
      setNama_user(response.data.name)
    })
  }

  const fetchDataUjian = async () => {
    if(ujian) {
    axios.defaults.headers.common['Authorization'] = `Bearer${token}`;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/byid/${ujian.id}`)
    .then((response)=>{
      setFilterdata(response.data.data)
    })
    }
  }
///--------------------------------------------------/////
  const handleRadioChange = (e, soalId) => {
  const value = e.target.value;
  const isChecked = e.target.checked;
  // Clone valuesarray agar tidak memodifikasi langsung state
  let newValuesArray = [...valuesarray];
  if (isChecked && value === '1') {
   newValuesArray [soalId] = 1;
 } else if (isChecked && value === '0'){
   // Hapus nilai saat radio button dicentang
   newValuesArray [soalId] = 0;
 } else if (!isChecked && value === '0' && value === '1'){
   newValuesArray[soalId] = 0;
 }
  setSelectedValues(newValuesArray);
  setValuesarray(newValuesArray);
};
// // handleSubmit
// 1. dari data single, dijadikan satu menjadi array string pakai join('')
// 2. kemudian di pisahkan untuk dibentuk data array dengan split
// 3. kemudian diubah ke dalam bentuk array integer dengan parseInt
// 4. kemudian diubah ke dalam bentuk JSON dengan jsonstringify

//----------------------------------------------///
  useEffect(() =>{
    const timer = setTimeout(()=> {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft-1);
          localStorage.setItem('timeLeft', timeLeft - 1);
        } else {
          const simpan = document.getElementById("submitButton");
          if (simpan) {
            simpan.click();
            simpan.textContent ="Sudah dikerjakan"
            simpan.style.backgroundColor = "Red"
            simpan.disabled = true;
          }
        }
      }, 1000);
}, [timeLeft]);
//--------------------------------------------------------/////

  const handleSubmit = async (e) => {
    e.preventDefault();
      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/ujihasil`, {
      adduser : nama_user, id_user : user_id, Kategori : kategori, Nama_ujian : nama_ujian,
      total: valuesarray,
    })
    .then(()=> {
      Router.push('/Hasil')
      const simpan = document.getElementById("submitButton");
      if (simpan) {
        simpan.click();
        simpan.textContent ="Sudah dikerjakan"
        simpan.style.backgroundColor = "Red"
        simpan.disabled = true;
      }
    })
    .catch((error)=> {
        setValidation(error.response);
      })
    }
//----------------------------------/////

    console.log("isi id :", user_id);
    console.log ("valuesarray:", valuesarray);
    console.log("nama user:", nama_user);

  useEffect (() => {
  fetchDataUser();
  fetchDataUjian();
  }, []);

  useEffect (() => {
    if(!token) {
    Router.push('/login')
    const simpan2 = document.getElementById("submitButton");

    }
  });

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
                                <p className= "text-center"><strong> {secondToTime(timeLeft)}</strong></p>
                                <hr />
                                  <table className="table table-bordered mb-5">
                                    <thead>
                                      <tr>
                                <th className= "text-center"scope="col">Detail Ujian</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                      <td className = "text-center">
                                        Judul : {ujian.nama_ujian} <br />
                                        Tanggal dibuat :{moment(ujian.created_at).format('LL')} <br/>
                                        Oleh : {ujian.nama_user}
                                            <br />
                                        MAPEL : {ujian.mapel_name}
                                        </td>
                                  </tr>
                                </tbody>
                                </table>
                                <hr />
                                <form onSubmit={handleSubmit}>
                                <table className="table table-bordered mb-5">
                                  <thead>
                                    <tr>
                              <th scope="col">Soal</th>

                              <th scope ="col"> Jawaban </th>

                              </tr>
                              </thead>
                              <tbody>
                              {filterdata.map((soal) => (
                                    <tr key={soal.id}>
                                      <td>{soal.soal_text}</td>
                                    <td>
                                {soal.jawaban.map((jawaban) => (
                                  <div key={jawaban.id}>
                                  <label>
                                  <input type="radio" name={soal.id}  value={jawaban.nilai_benar} onChange=
                                  {(e) => handleRadioChange(e, soal.id)}/>
                                  {jawaban.answer} {jawaban.nilai_benar}
                                  </label>
                                </div>
                                ))}
                          </td>
                       </tr>
                     ))}
                </tbody>
                  </table>
                  <p> value selected :{valuesarray}</p>
                  <p><strong>Cek Kembali Jawaban Anda Sebelum Menyimpan</strong></p>
                  <button id ="submitButton" className="btn btn-primary border-0 shadow-sm" type="submit">
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

export default indexBank
