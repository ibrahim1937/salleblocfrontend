import React, { useState, useEffect } from 'react'
import { Card, Container } from 'react-bootstrap'
import { endpoint } from '../utils/Constants'
import socketIOClient from "socket.io-client";
import { Bar , Pie, Doughnut, Line} from 'react-chartjs-2';
import { getRequest } from '../utils/RequestHelper';
import "../utils/import"
import MyChart from '../components/MyChart';
import { defaultDataOptions, getDefaultOptions } from '../utils/ChartDataHandler';
import styledComponents from 'styled-components';
import styled from 'styled-components';
import { SiGoogleclassroom } from 'react-icons/si';
import { FaSchool} from "react-icons/fa"
import { BsFillCalendarCheckFill } from "react-icons/bs"
import { RiTimeFill } from "react-icons/ri"
import "../styles/sass.scss"

function Home() {

    
    // occupation per bloc
    const [data,setData] = useState(null);
    // salle per bloc
    const [data2, setData2] = useState(null);
    // occupation per bloc in a specific date
    const [data3, setData3] = useState(null);
    // general statistics
    const [data4, setData4] = useState(null);
    // count occupation per date
    const [data5, setData5] = useState(null);
    // occupation per creneau
    const [data6, setData6] = useState(null);

    const [change, setChange] = useState(0);


    const opt = {
        options: {
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                   label: function(tooltipItem) {
                          return tooltipItem.yLabel;
                   }
                }
            }
        }
    }


    const getData  = async () => {
        var { data } = await getRequest(endpoint + "/api/occupations/perbloc");
        setData(data)
        var { data } = await getRequest(endpoint + "/api/salles/perbloc");
        setData2(data);
        var { data } = await getRequest(endpoint + "/api/stats");
        setData4(data);
        var { data } = await getRequest(endpoint + "/api/stats/occupation");
        setData5(data);
        var { data } = await getRequest(endpoint + "/api/stats/creneau");
        setData6(data);
    }

     
   

    useEffect(async () => {
        await getData();

    }, [change])

    useEffect(() => {
        const socket = socketIOClient(endpoint);
        socket.on("update", async (test) => {
            console.log("hello from socket")
            await getData()
        });
    },[])

    // useEffect(async () => {

    //     const { data } = await getRequest(endpoint + "/api/salles/perbloc");
    //     setData2(data);
  

    // }, [])  
    // useEffect(async () => {

    //     const { data } = await getRequest(endpoint + "/api/stats");
    //     setData4(data);

    // }, [])  
    // useEffect(async () => {
    //     let { data } = await getRequest(endpoint + "/api/stats/occupation");
    //     setData5(data);
        

    // }, [])  
    // useEffect(async () => {
     
    //     const { data } = await getRequest(endpoint + "/api/stats/creneau");
    //     setData6(data);
   

    // }, [])  
    
    

   

    const handleDateChange = async (e) => {
        if(e.target.value === ""){
            setData3(null);
            return;
        }
        const { data } = await getRequest(endpoint + "/api/occupations/perbloc/" + e.target.value);
        setData3(data);
    }

    document.title = 'Home';
    return (
        <>
            <Container>
                <div className='row'>
                    <h3 className='text text-center text-primary'>Statistics</h3>
                </div>
                
                <div className='row m-auto w-100'>
                    <div className='col-11 col-sm-6 col-lg-3 p-1'>
                        <Card className='bg-primary p-2'>
                            <Card.Body>
                               <div className='text-light' style={{ fontWeight : 'bolder' }}>Number of Blocs:</div> 
                               <div className='d-flex gap-3 align-items-center'>
                                    <FaSchool className='text-light' style={{ height: '20px', width : '20px' }}/>
                                    <div className='text-light'>{data4 && data4.blocCount}</div>
                               </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col-11 col-sm-6 col-lg-3 p-1'>
                        <Card className='bg-success p-2'>
                            <Card.Body>
                               <div className='text-light' style={{ fontWeight : 'bolder' }}>Occupations:</div> 
                               <div className='d-flex gap-3 align-items-center'>
                                    <BsFillCalendarCheckFill className='text-light' style={{ height: '20px', width : '20px' }}/>
                                    <div className='text-light'>{data4 && data4.occupationsCount}</div>
                               </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col-11 col-sm-6 col-lg-3 p-1'>
                        <Card className='bg-warning p-2'>
                            <Card.Body>
                               <div className='text-light' style={{ fontWeight : 'bolder' }}>Occupations Today:</div> 
                               <div className='d-flex gap-3 align-items-center'>
                                    <RiTimeFill className='text-light' style={{ height: '20px', width : '20px' }} />
                                    <div className='text-light'>{data4 && data4.occupationsToday}</div>
                               </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col-11 col-sm-6 col-lg-3 p-1'>
                        <Card className='bg-info p-2'>
                            <Card.Body>
                               <div className='text-light' style={{ fontWeight : 'bolder' }}>Number of salles:</div> 
                               <div className='d-flex gap-3 align-items-center'>
                                    <SiGoogleclassroom  className='text-light' style={{ height: '20px', width : '20px' }}/>
                                    <div className='text-light' >{data4 && data4.salleCount}</div>
                               </div>
                            </Card.Body>
                        </Card>
                    </div>
                    
                </div>
                <div className='row'>
                    <div className='col col-sm-11 col-lg-6'>
                        {data && (
                            <MyChart Chart={Bar} height={400} width={600} data={data} label={"Occupations per Salle"} dataOptions={defaultDataOptions} options={getDefaultOptions} />
                        )}
                    </div>
                    <div className='col col-sm-11 col-lg-6'>
                        {data2 && (
                            <MyChart Chart={Bar} height={400} width={600} data={data2} label={"Salle per Bloc"} dataOptions={defaultDataOptions} options={getDefaultOptions} />
                        )}
                    </div>
                </div>
                <div className='row'>
                    <div className='col col-sm-11 col-lg-6'>
                        {data5 && (
                            <MyChart Chart={Line} height={400} width={600} data={data5} label={"Occupation per date"} dataOptions={defaultDataOptions} options={opt} />
                        )}
                    </div>
                    <div className='col col-sm-11 col-lg-6'>
                        {data6 && (
                            <MyChart Chart={Bar} height={400} width={600} data={data6} label={"Occupation per Creneau"} dataOptions={defaultDataOptions} options={getDefaultOptions} />
                        )}
                    </div>
                </div>
                <div className="row">
                    <h4 className='text text-center text-primary'>Show Statistics relative to a specific date</h4>
                </div>
                <div className='row d-flex'>
                    <div className="col col-sm-11 col-lg-2 m-1">
                        <label htmlFor='date'>Choose the date:</label>
                    </div>
                    <div className="col col-sm-11 col-lg-2 m-1">
                         <input className='form-control' type={"date"}  id="date" onChange={handleDateChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className="col col-sm-11 col-lg-6">
                        {data3 && (
                                <MyChart Chart={Bar} height={400} width={600} data={data3} label={"Occupations per salle"} dataOptions={defaultDataOptions} options={getDefaultOptions} />
                            )}
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Home



