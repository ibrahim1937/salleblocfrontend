import React, {useEffect, useState, useRef} from 'react'
import { Container, Button , Modal, Form, Table } from 'react-bootstrap'
import styled from 'styled-components'
import { deleteRequest, getRequest, postRequest, putRequest } from '../utils/RequestHelper';
import { endpoint } from '../utils/Constants';
import swal from 'sweetalert';
import socketIOClient from "socket.io-client";
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';

function Salle() {

    const [salles, setSalles] = useState(null);
    const [blocs, setBlocs] = useState(null);
    const [change,setChange] = useState(0);

    

    // Modal function
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const nameRef = useRef();
    const selectRef = useRef();
    const typeRef = useRef();

    document.title = "Salle"

    const handleAdd = async (e) => {
        e.preventDefault();
        // if(selectRef.current.value !== null || nameRef.current.value !== null || typeRef.current.value !== null){
        //     handleClose();
        //     return;
        // }


        const { data } = await postRequest(endpoint + "/api/salles", {
            name : nameRef.current.value,
            type : typeRef.current.value,
            bloc : blocs.filter((item) => item._id === selectRef.current.value)[0]
        })


        if(data){
            setChange(change + 1);
            toast.success("The Salle has been added!" , { autoClose : 3000}) 
        }else {
            toast.error("Error Ocurred" , { autoClose : 3000})
        }

        handleClose();


        
    }

    useEffect(() => {
        const socket = socketIOClient(endpoint);
        socket.on("test", data => {
           console.log(data);
        });
    },[])

    useEffect(async () => {
        const result = await getRequest(endpoint + "/api/salles");
        setSalles(result.data);
        const result1 = await getRequest(endpoint + "/api/blocs");
        setBlocs(result1.data);
    },[change])

    return (
        <Container>
            <h1 className="text-center text-info">Gestion des salles</h1>
            <Button className='btn-success m-2' onClick={() => setShow(!show)}>Add A Salle</Button>
            <TableContainer data={salles} changeData={change} changeState={setChange} blocsData={blocs} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Bloc</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" placeholder="Name" ref={nameRef} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Type:</Form.Label>
                            <Form.Control type="text" placeholder="Type" ref={typeRef} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Bloc:</Form.Label>
                            <Form.Select aria-label="Default select example" ref={selectRef} required>
                                <option value={""}>Open this select menu</option>
                                {blocs && blocs.map((item) => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
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

export default Salle



const TableContainer = (props) => {

    const { data } = props;
    const { changeState : setChange } = props;
    const { changeData } = props;
    const { blocsData } = props;
    const [selectedItem, setSelectedItem] = useState(null);
    const [tableData, setTableData] = useState(null);

    const [blocs, setBlocs] = useState(blocsData);


    const TdContainer = styled.td`
        display: flex;
        justify-content: center;
        gap: 15px;
        align-items: center;
    `

    // Modal 

    const nameRef = useRef();
    const selectRef = useRef();
    const typeRef = useRef();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);


    const handleDelete = async (item) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this salle!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
              const { data } = await deleteRequest(endpoint + "/api/salles/" + item._id);
              if(data){
                  setChange(changeData + 1)
                  toast.success("The salle has been deleted!" , { autoClose : 3000}) 
              }else {
                toast.error("Error occurred!" , { autoClose : 3000}) 
              }
            } else {
              toast.info('Your salle data is safe!',{ autoClose : 2000})
            }
          });
        
    }
    const handleEdit = (item) => {
        
        setSelectedItem(item);
        setShow(!show);
    } 

    const handleUpdate = async (e, item) => {
        e.preventDefault();
        const { data } = await putRequest(endpoint + "/api/salles/" + item._id,{
            name : nameRef.current.value,
            type : typeRef.current.value,
            bloc : blocsData.filter((item) => item._id = selectRef.current.value)[0]
        }).catch(error => {
            toast.error("Error occurred!")
        })

        if(data){
            setChange(changeData + 1);
            toast.success("The Salle has been updated!")
            
        }else {
            toast.error("Error occurred!")
        }
        handleClose();
    }

    

    useEffect(() => {
        
        
        
        // table.DataTable().destroy();
        if(data){
            var tempdata = data.map((item, index) => {
                return {
                    "_id" : index + 1,
                    "name" : item.name,
                    "type" : item.type,
                    "bloc" : item.bloc.name,
                    "options" : <TdContainer>
                    <Button className='btn-danger' onClick={() => handleDelete(item)}>Delete</Button>
                    <Button className='btn-primary' onClick={() => handleEdit(item)}>Edit</Button>
                </TdContainer>
                }
            })
            const mydata = {
                columns: [
                    {
                        label : "Id",
                        field : "_id",
                        sort : "asc",
                        width : 50
                    },
                    {
                        label : "Name",
                        field : "name",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "Type",
                        field : "type",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "Bloc",
                        field : "bloc",
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

    }, [data])

    

    return (
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
                <Modal.Title>Add a Bloc</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" placeholder="Name" ref={nameRef} required defaultValue={selectedItem && selectedItem.name}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Type:</Form.Label>
                        <Form.Control type="text" placeholder="Type" ref={typeRef} required defaultValue={selectedItem && selectedItem.type}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Bloc:</Form.Label>
                        <Form.Select aria-label="Default select example" ref={selectRef} required defaultValue={selectedItem && selectedItem.bloc._id}>
                            {blocsData && blocsData.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
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
                </Modal.Footer>
            </Form>
        </Modal>
        </>
    )
}

