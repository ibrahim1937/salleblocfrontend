import React, { useEffect, useRef, useState} from 'react'
import { Container , Form , Button} from 'react-bootstrap'
import swal from 'sweetalert';
import { endpoint } from '../utils/Constants';
import { getRequest } from '../utils/RequestHelper';
import "../styles/QrStyles.css"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import $ from 'jquery';


function QrCodePage() {

    document.title = "QrCodePage"

    const [temp, setTemp] = useState("");
    const [word, setWord] = useState("test");
    const [size, setSize] = useState(400);
    const [bgColor, setBgColor] = useState("ffffff");
    const [qrCode, setQrCode] = useState("");

    const [show, setShow] = useState(false);

    const [blocs, setBlocs] = useState(null);
    const [salles, setSalles] = useState(null);

    const [selectedBloc, setSelectedBloc] = useState(null);
    const [selectedSalle, setSelectedSalle] = useState(null);

    const blocsRef = useRef();
    const sallesRef = useRef();
    const contentRef = useRef();


    const handleBlocChange = async () => {
        const { data } = await getRequest(endpoint + "/api/salles/findbybloc/" + blocsRef.current.value);
        setSalles(data);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!sallesRef.current.value){
            setShow(false);
            swal("You must select a valid salle!", {
                icon : "error"
            })
            return;
        }

        setShow(true);
        setWord(sallesRef.current.value);


    }

    const download = (e) => {
       
        if(salles){
            var doc = new jsPDF('p', 'pt', 'a4');
            var pageHeight= doc.internal.pageSize.height;
            var number = parseInt(100 + 110 * salles.length-1)
            var result = parseInt(number/parseInt(pageHeight)) + 1
            var y = 0;
            var y1 = 0;
            var index = 0; 
            for(var i=0; i<salles.length; i++){
                y = (110 * index ) + 100
                y1 = (110 * index) + 50
                if (y>=pageHeight)
                {
                    y = 100;
                    y1 = 50;
                    index = 1;
                    doc.addPage();
                    doc.addImage(`http://api.qrserver.com/v1/create-qr-code/?data=${salles[i].salle._id}&size=${size}x${size}&bgcolor=${bgColor}`, "PNG",0,(y - 100),100,100);
                    doc.text(150, y1 , salles[i].salle.name)
                    
                }else{
                    index = index +1
                    doc.addImage(`http://api.qrserver.com/v1/create-qr-code/?data=${salles[i].salle._id}&size=${size}x${size}&bgcolor=${bgColor}`, "PNG",0,(y - 100),100,100);
                    doc.text(150, y1 , salles[i].salle.name)
                }
                
            }
            var bloc = blocs.filter((item) => item._id === blocsRef.current.value);
            doc.save(bloc[0].name + "-" + new Date().getTime() + ".pdf")
        }
    }

    // blocs
    useEffect(async () => {
        const { data } = await getRequest(endpoint + "/api/blocs");
        setBlocs(data);
    }, []);

    const handleClick = () => {

    }
    
    useEffect(() => {
        setQrCode
     (`http://api.qrserver.com/v1/create-qr-code/?data=${word}&size=${size}x${size}&bgcolor=${bgColor}`);
      }, [word, size, bgColor]);

    return (
        <Container className="customHeight">
            <h1 className="text-center text-primary">Qr Code Generator</h1>
            <Form>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Bloc:</Form.Label>
                        <Form.Select aria-label="Default select example" ref={blocsRef} onChange={() => handleBlocChange()} required>
                            <option>Select a bloc</option>
                            {blocs && blocs.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Salle:</Form.Label>
                        <Form.Select aria-label="Default select example"  ref={sallesRef} required>
                            {salles && salles.map((item) => (
                                <option key={item.salle._id} value={item.salle._id}>{item.salle.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <button type="submit" className="btn btn-success m-1" onClick={(e) => handleSubmit(e)}>
                            Generate
                        </button>
                        <button type='button' className='btn btn-success m-1' onClick={download} disabled={!salles}>
                            Download 
                        </button>
                    </Form.Group>
            </Form>
            <div className="input-box"  style={{ display : !show && "none"}}>
                <div className="extra">
                    <h5>Background Color:</h5>
                    <input type="color" onChange={(e) => 
                    { setBgColor(e.target.value.substring(1)) }} />
                    <h5>Dimension:</h5>
                    <input type="range" min="200" max="600"
                    value={size} onChange={(e) => 
                    {setSize(e.target.value)}} />
                </div>
            </div>
            <div className="output-box" style={{ display : !show && "none"}}>
                <img src={qrCode} alt="" />
                <a href={qrCode} download="QRCode">
                <button  type="button" className='btn btn-success custom-btn'>Download</button>
                </a>
            </div>

            

            
        </Container>
    )
}

export default QrCodePage

