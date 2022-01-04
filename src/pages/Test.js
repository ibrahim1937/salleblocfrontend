import React, {useRef, useEffect} from 'react'
import { Container } from 'react-bootstrap';
import { destroyDataTable, displayDataTable } from '../utils/DataTableHandler';
function Test() {

    const tableRef = useRef();
    

    const data = [
        {
            "name":       "Tiger Nixon",
            "position":   "System Architect",
            "salary":     "$3,120",
            "start_date": "2011/04/25",
            "office":     "Edinburgh",
            "extn":       "5421"
        },
        {
            "name":       "Garrett Winters",
            "position":   "Director",
            "salary":     "$5,300",
            "start_date": "2011/07/25",
            "office":     "Edinburgh",
            "extn":       "8422"
        }
    ];

    const columns = [
        { data: 'name' },
        { data: 'position' },
        { data: 'salary' },
        { data: 'start_date' },
        { data: 'office' },
        { data: 'extn' },
    ];

    useEffect(() => {
        console.log(tableRef.current)
        destroyDataTable(tableRef.current);
        displayDataTable(tableRef.current, data, columns, {order: [[3, "asc"]]})
    }, [])

    return (
        <Container>
            <table id="table_id" class="display table table-bordered" ref={tableRef}>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>position</th>
                        <th>salary</th>
                        <th>start_date</th>
                        <th>office</th>
                        <th>extn</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {data && data.map((item) => (
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.position}</td>
                            <td>{item.salary}</td>
                            <td>{item.start_date}</td>
                            <td>{item.office}</td>
                            <td>{item.extn}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
        </Container>
    )
}

export default Test
