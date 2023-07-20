import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import EntryPage from "../pages/EntryPage";
import { useNavigate } from "react-router-dom"
import { useTable } from "react-table"

import fakeData from "./MOCK_DATA.json"

import "../styles/login.css";


const Tasks = () => {
    const [ isOpen, setIsOpen ] = useState( false );
    const [print, setData] = useState(null);

    const nagivate = useNavigate();

    //Note: We might have to download react-table
    const data = React.useMemo(() => fakeData, []);
    const columns = React.useMemo(() => [
        {
            Header: "ID",
            accessor: "task_id",
        },
        {
            Header: "Task Name",
            accessor: "task_name",
        },
        {
            Header: "Taks Description",
            accessor: "task_description",
        },
        {
            Header: "Employee ID",
            accessor: "employee_id",
        },
        {
            Header: "Sprint ID",
            accessor: "sprint_id",
        },
        {
            Header: "Is Complete",
            accessor: "is_complete",
        }
    ],
    []);

    function getData(val)
    {
        setData(val.target.value)
    }

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data});

   return(
        <div className="container">
            <head>
                <p>No Title</p>
            </head>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell)=> (
                                    <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <body>
                <div className="field">
                    <label className="label">ID</label>
                    <div className="control">
                        <input type="text" placeholder="Your Input ID" onChange={getData} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Task Name</label>
                    <div className="control">
                        <input type="text" placeholder="yOur Input Task Name" onChange={getData} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Task Description</label>
                    <div className="control">
                        <input type="text" placeholder="yoUr Input Task Description" onChange={getData} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Employee ID</label>
                    <div className="control">
                        <input type="text" placeholder="youR Input Employee ID" onChange={getData} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Sprint ID</label>
                    <div className="control">
                        <input type="text" placeholder="YOur Input Sprint ID" onChange={getData} />
                    </div>
                </div>

                <p>Errrr, Where is the button?</p>
                <button className="button is primary" type="submit"></button>
            </body>
        </div>

        
    )
};

export default Tasks;