import React, {useEffect, useState, useRef} from 'react'
import { Button, Container, Modal, Form , Table} from 'react-bootstrap'
import swal from 'sweetalert';
import { endpoint } from '../utils/Constants';
import { deleteRequest, getRequest, postRequest, putRequest } from '../utils/RequestHelper';
import styled from 'styled-components';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';

function Creneau() {

    const [show, setShow] = useState(false);
    const [change, setChange] = useState(0);
    const [creneaux, setCreneaux] = useState();
    const handleClose = () => setShow(false);
    const startTime = useRef();
    const endTime = useRef();

    document.title = "Creneau";

    const handleAdd = async () => {
        const { data } = await postRequest(endpoint + "/api/creneaux", {
            startTime : startTime.current.value,
            endTime : endTime.current.value
        })

        if(data) {
            setChange(change + 1)
            toast.success("The creneau has been created!", { autoClose : 3000})
        }else {
            toast.error("Error Occured!", { autoClose : 3000})
        }

        handleClose();


    }

    useEffect(async () => {
        const { data } = await getRequest(endpoint + "/api/creneaux");
        setCreneaux(data);
    },[change])

    return (
        <Container>
            <h1 className='text-center text-info'>Creneau</h1>
            <Button className="btn-success m-2" onClick={() => setShow(!show)}>Add a Creneau</Button>
            <TableContainer data={creneaux} changeState={setChange} changeData={change} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Creneau</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Start Time:</Form.Label>
                            <Form.Control type="time" placeholder="Name" ref={startTime} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>End Time:</Form.Label>
                            <Form.Control type="time" placeholder="Name" ref={endTime} required/>
                        </Form.Group>
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    )
}

export default Creneau


const TableContainer = (props) => {

    const { data } = props;
    const { changeState : setChange } = props;
    const { changeData } = props;

    const [tableData, setTableData] = useState(null);
 



    const TdContainer = styled.td`
        display: flex;
        justify-content: center;
        gap: 15px;
        align-items: center;
    `

    // Modal 

    const startTime = useRef();
    const endTime = useRef();

    const [show, setShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const handleClose = () => setShow(false);


    const handleEdit = (item) => {
        setSelectedItem(item);
        setShow(!show);
    }


    const handleDelete = async (item) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this creneau!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
              const { data } = await deleteRequest(endpoint + "/api/creneaux/" + item._id);
              if(data){
                  setChange(changeData + 1)
                  toast.success("The creneau has been deleted!", { autoClose : 3000})
              }else {
                toast.error("Error occurred!", { autoClose : 3000})
              }
            } else {
                toast.info("Your creneau data is safe!", { autoClose : 2000})
            }
          });
        
    }
    

    const handleUpdate = async (e, item) => {
        e.preventDefault();
        const { data } = await putRequest(endpoint + "/api/creneaux/" + item._id,{
            startTime : startTime.current.value,
            endTime : endTime.current.value,
        })

        if(data){
            setChange(changeData + 1);
            toast.success("The creneau has been updated!", { autoClose : 3000})
        }else {
            toast.error("Error occurred!", { autoClose : 3000})
            
        }
        handleClose();
    }

    useEffect(() => {
        if(data){
            var tempdata = data.map((item, index) => {
                return {
                    "_id" : index + 1,
                    "startTime" : item.startTime,
                    "endTime" : item.endTime,
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
                        label : "Start Time",
                        field : "startTime",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "End Time",
                        field : "endTime",
                        sort : "asc",
                        width : 150
                    },
                    {
                        label : "Options",
                        field : "options",
                        sort : "asc",
                        width : 50
                    }
                ], rows : tempdata
            }
    
            setTableData(mydata);

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
        {/* <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item,index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.startTime}</td>
                                <td>{item.endTime}</td>
                                <TdContainer>
                                    <Button className='btn-danger' onClick={() => handleDelete(item)}>Delete</Button>
                                    <Button className='btn-primary' onClick={() => handleEdit(item)}>Edit</Button>
                                </TdContainer>
                            </tr> 
                        ))}
                        
                        
                    </tbody>
        </Table> */}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit a creneau</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Start Time:</Form.Label>
                        <Form.Control type="time"  ref={startTime} required defaultValue={selectedItem && selectedItem.startTime}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>End Time:</Form.Label>
                        <Form.Control type="time"  ref={endTime} required defaultValue={selectedItem && selectedItem.endTime} />
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

