import React, {useEffect, useState, useRef} from 'react'
import { Container, Table, Button , Modal, Form} from 'react-bootstrap'
import { endpoint } from '../utils/Constants'
import { getRequest, deleteRequest, putRequest, postRequest } from '../utils/RequestHelper'
import styled from 'styled-components'
import swal from 'sweetalert';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify'
import { ExportCSV } from '../utils/ExportCSV'


function Bloc() {

    const [blocs, setBlocs] = useState([]);
    const [change, setChange] = useState(0);
    const nameRef = useRef();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleAdd = async () => {

        const name = nameRef.current.value;
        if(name === null){
            return;
        }

        const { data } = await postRequest(endpoint + "/api/blocs/", { name });
        if(data){
            setChange(change + 1);
            toast.success('The bloc has been added!', { autoClose : 3000})  
        }else {
            toast.success('Error occurred!', { autoClose : 3000})
        }
        handleClose();


    }


    document.title = "Bloc"

    

    useEffect(async () => {
        const result =  await getRequest(endpoint + "/api/blocs");
        setBlocs(result.data);
    },[change])

    return (
        <Container>
            <h1 className="text-center text-primary">Gestion des blocs</h1>

            <Button className='btn-success m-2' onClick={() => setShow(!show)}>Add A bloc</Button>
            {blocs && <ExportCSV csvData={blocs.map((item) => {
                var temp = item;
                delete temp.__v
                return temp
            })} fileName={"blocs" + new Date().getTime()} />}
            <CustomTable data={blocs} changeState={setChange} changeData={change} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Bloc</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" placeholder="Name" ref={nameRef} />
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

export default Bloc




const CustomTable = (props) => {
    const { data } = props;
    const { changeState : setChange} = props;
    const { changeData } = props;

    const [tableData, setTableData] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleUpdate = async (item) => {

        const name = nameRef.current;
        if(name === null){
            return;
        }
        const { data } = await putRequest(endpoint + "/api/blocs/" + item._id, {...item, name : name.value});
        if(data){
            setChange(changeData + 1);
            toast.success('The bloc has been updated!', { autoClose : 3000}) 
        }else {
            toast.error('Error occurred!', { autoClose : 3000})
        }
        handleClose();
    }

    const nameRef = useRef();

    const [selectedItem, setSelectedItem] = useState(null);

    const TdContainer = styled.td`
        display: flex;
        justify-content: center;
        gap: 15px;
        align-items: center;
    `

    const handleEdit = (item) => {
        setShow(!show);
        setSelectedItem(item)
    }


    const deleteFunction = async (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this bloc!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
              const { data } = await deleteRequest(endpoint + "/api/blocs/" + id);
              if(data){
                  setChange(changeData + 1)
                  toast.success('The bloc has been deleted!', { autoClose : 3000})
              }else {
                toast.error('Error occured!', { autoClose : 3000})
              }
            } else {
                toast.info('Your bloc data is safe', { autoClose : 2000})
            }
          });
    }

    useEffect(() => {
        var tempdata = data.map((item, index) => {
            return {
                "_id" : index + 1,
                "name" : item.name,
                "options" : <TdContainer>
                <Button className='btn-danger' onClick={() => deleteFunction(item._id)}>Delete</Button>
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
                    label : "Options",
                    field : "options",
                    sort : "asc",
                    width : 50
                }
            ], rows : tempdata
        }

        setTableData(mydata);
    },[data])

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
                <Modal.Title>Edit Bloc</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" placeholder="Name" ref={nameRef} defaultValue={selectedItem && selectedItem.name} />
                    </Form.Group>
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleUpdate(selectedItem)}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
        </>
    )
}


