import React,{useEffect, useState, useRef} from 'react'
import { Button, Container, Modal, Form, Table } from 'react-bootstrap'
import swal from 'sweetalert';
import { endpoint } from '../utils/Constants';
import { deleteRequest, getRequest, postRequest, putRequest } from '../utils/RequestHelper';
import styled from 'styled-components';
import socketIOClient from "socket.io-client";
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { ExportCSV } from '../utils/ExportCSV';

function Occupation() {

    document.title = "Occupation"

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [change, setChange] = useState(0);
    const [toggle, setToggle] = useState(true);

    const { currentUser } = useAuth();

    const [creneaux, setCreneaux] = useState(null);
    const [salles, setSalles] = useState(null);
    const [blocs, setBlocs] = useState(null);
    const [occupations, setOccupations] = useState(null);

    const blocsRef = useRef();
    const sallesRef = useRef();
    const creneauxRef = useRef();

    const getDate = (mydate) => {
        var d = new Date(mydate);
       
        var date = d.getUTCDate();
        var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
        var year = d.getUTCFullYear();
            
        var dateStr = date + "/" + month + "/" + year;
        return dateStr;
    }

    const handleAdd = async (e) => {
        const date = new Date();
        e.preventDefault();
        const { data } = await postRequest(endpoint + "/api/occupations", {
            salle : sallesRef.current.value,
            user : currentUser.id
        });

        if(data){
            if(data.status === "success"){
                setChange(change + 1);
                toast.success(data.message, { autoClose : 3000}) 
            }else if(data.status === "error" || data.status === "failure"){
                toast.error(data.message, { autoClose : 3000}) 
            }
            
        }else {
            toast.error("Error Occured!", { autoClose : 3000})
        }
        handleClose();
    }

    const handleBlocChange = async () => {
        if(blocsRef.current.value === ""){
            setSalles(null);
            setToggle(true)
            return;
        }

        const { data } = await getRequest(endpoint + "/api/salles/findbybloc/" + blocsRef.current.value);
        console.log(data);
        setSalles(data);
        setToggle(false);
    }

    useEffect(async () => {
        const { data } = await getRequest(endpoint + "/api/occupations");
        setOccupations(data);
    }, [change])

    useEffect(async () => {
        const { data } = await getRequest(endpoint + "/api/blocs");
        setBlocs(data);
    },[])

    useEffect(async () => {
        const { data } = await getRequest(endpoint + "/api/creneaux");
        setCreneaux(data);
    },[])

    useEffect(() => {
        const socket = socketIOClient(endpoint);
        socket.on("refreshOccupation", async (test) => {
            const { data } = await getRequest(endpoint + "/api/occupations");
            setOccupations(data);
        });
    },[])

    
    

    return (
        <Container>
            <h1 className="text-center text-info">Occupations</h1>
            <Button className='btn-success m-2' onClick={() => setShow(!show)}>Add Occupation</Button>
            {occupations && <ExportCSV csvData={occupations.map((item) => {
                return {
                    user : item.user.firstName + " " + item.user.secondName,
                    creneau : item.creneau.startTime + " - " + item.creneau.endTime,
                    salle : item.salle.name,
                    salle_type : item.salle.type,
                    created_date : getDate(item.createdAt)
                }
            })} fileName={"occupations"+ new Date().getTime()}/>}
            <TableContainer data={occupations} creneauxData={creneaux} blocsData={blocs} changeState={setChange} changeData={change} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Occupation</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Bloc:</Form.Label>
                        <Form.Select aria-label="Default select example" ref={blocsRef}  onChange={handleBlocChange} required>
                            <option value={""}>Select Bloc</option>
                            {blocs && blocs.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName" style={{ display : toggle && "none"}}>
                        <Form.Label>Salle:</Form.Label>
                        <Form.Select aria-label="Default select example" ref={sallesRef} required>
                            {salles && salles.map((item) => (
                                <option key={item.salle._id} value={item.salle._id}>{item.salle.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                        
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleAdd}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    )
}

export default Occupation


const TableContainer = (props) => {

    const { data } = props;
    const { blocsData } = props;
    const { creneauxData } = props;
    const [salles, setSalles] = useState(null);
    const [selectedItem, setSelectedItem] = useState();

    const [tableData, setTableData] = useState(null);

    const { changeState : setChange } = props;
    const { changeData } = props;

    const TdContainer = styled.td`
        display: flex;
        justify-content: center;
        gap: 15px;
        align-items: center;
    `

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [toggle, setToggle] = useState(true);

    const creneauxRef = useRef();
    const blocsRef = useRef();
    const sallesRef = useRef();

    const handleBlocChange = async () => {
        const { data } = await getRequest(endpoint + "/api/salles/findbybloc/" + blocsRef.current.value);
        setSalles(data);
    }

    const handleEdit = async (item) => {
        setSelectedItem(item);
        setShow(!show);
        const { data } = await getRequest(endpoint + "/api/salles/findbybloc/" + item.salle.bloc);
        setSalles(data);
        
    }

    const handleUpdate = async (e, item) => {
        e.preventDefault();
        const { data } = await putRequest(endpoint + "/api/occupations/" + item._id, {
            ...selectedItem,
            creneau : creneauxRef.current.value,
            salle : sallesRef.current.value,
            updatedAt : new Date()
        }).catch(err => {
            toast.error("Error occured!" , {autoClose : 3000})
        })

        if(data){
            setChange(changeData + 1);
            toast.success("The occupation has been updated!", { autoClose : 3000})
            
        }else{
            toast.error("Error occured!" , {autoClose : 3000})
        }

        handleClose();
    }


    const handleDelete = async (item) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this occupation!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
              const { data } = await deleteRequest(endpoint + "/api/occupations/" + item._id);
              if(data){
                  setChange(changeData + 1)
                  toast.success("The occupation has been deleted!", { autoClose : 3000}) 
              }else {
                  toast.error("Error occurred!", { autoClose : 3000})
              }
            } else {
                toast.info("Your occupation  data is safe!", { autoClose : 2000})
            }
          });
    }

    const getDate = (mydate) => {
        var d = new Date(mydate);
       
        var date = d.getUTCDate();
        var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
        var year = d.getUTCFullYear();
            
        var dateStr = date + "/" + month + "/" + year;
        return dateStr;
    }

    useEffect(() => {
        console.log(data)
        if(data){
            var tempdata = data.map((item, index) => {
                return {
                    "_id" : index + 1,
                    "creneau" : item.creneau.startTime + " - " + item.creneau.endTime,
                    "salle" : item.salle.name,
                    "createdAt" : getDate(item.createdAt),
                    "user" : `${item.user.firstName} ${item.user.secondName}`,
                    "options" : <TdContainer>
                    <Button className='btn-danger' onClick={() => handleDelete(item)}>Delete</Button>
                    {/* <Button className='btn-primary' onClick={() => handleEdit(item)}>Edit</Button> */}
                </TdContainer>
                }
            })
            const mydata = {
                columns: [
                    {
                        label : "#",
                        field : "_id",
                        sort : "asc",
                        width : 50
                    },
                    {
                        label : "Creneau",
                        field : "creneau",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "Salle",
                        field : "salle",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "Created At",
                        field : "createdAt",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "User",
                        field : "user",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "Options",
                        field : "options",
                        sort : "asc",
                        width : 150
                    }
                ], rows : tempdata
            }
            setTableData(mydata)

        }  
    },[data])

    return(

        

        <>
        {tableData && (
             <MDBDataTable
             striped
             bordered
             hover
             data={tableData}
           />
        )}
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Occupation</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Creneau:</Form.Label>
                        <Form.Select aria-label="Default select example" ref={creneauxRef} defaultValue={selectedItem && selectedItem.creneau._id} required>
                            <option value={""}>Select Creneau</option>
                            {creneauxData && creneauxData.map((item) => (
                                <option key={item._id} value={item._id}>{item.startTime + " - " + item.endTime}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Bloc:</Form.Label>
                        <Form.Select aria-label="Default select example" ref={blocsRef} defaultValue={selectedItem && selectedItem.salle.bloc} onChange={handleBlocChange} required>
                            {blocsData && blocsData.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Salle:</Form.Label>
                        <Form.Select aria-label="Default select example" defaultValue={selectedItem && selectedItem.salle._id} ref={sallesRef} required>
                            {salles && salles.map((item) => (
                                <option key={item._id} value={item.salle._id}>{item.salle.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                        
                        
                    </Modal.Body>
         <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" onClick={(e) => handleUpdate(e, selectedItem)}>
                    Save Changes
                </Button>
        </Modal.Footer></Form>
         </Modal>
        </>
    )
}