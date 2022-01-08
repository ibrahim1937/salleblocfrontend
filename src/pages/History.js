import { MDBDataTable } from 'mdbreact';
import React, { useEffect, useState} from 'react'
import { Container } from 'react-bootstrap'
import { endpoint } from '../utils/Constants';
import { getRequest } from '../utils/RequestHelper';


function History() {

    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [data, setData] = useState(null);
    const [tableData, setTableData] = useState(null);
    console.log(date)

    const getDate = (mydate) => {
        var d = new Date(mydate);
       
        var date = d.getUTCDate();
        var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
        var year = d.getUTCFullYear();
            
        var dateStr = date + "/" + month + "/" + year;
        return dateStr;
    }

    useEffect(async () => {
        const { data } = await getRequest(endpoint + "/api/occupations/" + date);
        console.log(data)

        var tempdata = data.map((item, index) => {
            return {
                "_id" : index + 1,
                "name" : item.salle.name,
                "type" : item.salle.type,
                "creneau" : item.creneau.startTime + " - " + item.creneau.endTime,
                "createdAt" : getDate(item.createdAt),
                "user" : `${item.user.firstName} ${item.user.secondName}`
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
                    label : "Salle Name",
                    field : "name",
                    sort : "asc",
                    width : 150
                },
                {
                    label : "Salle Type",
                    field : "type",
                    sort : "asc",
                    width : 150
                },
                {
                    label : "Creneau",
                    field : "creneau",
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
                }
            ], rows : tempdata
        }
        setTableData(mydata);
    }, [date])

    return (
        <Container>
            <h1 className="text-center text-info">Occupation History</h1>
            <div className='form-group'>
                <label htmlFor='date' className='text text-grey'>Enter the date</label>
                <input type="date" className='form-control' defaultValue={date} onChange={(e) => setDate(e.target.value) } />
            </div>
            {tableData && (
             <MDBDataTable
             striped
             bordered
             hover
             data={tableData}
           />
        )}
        </Container>
    )
}

export default History
