import React from "react";
import "../styles/login.css";
import { sidebarItems } from "../components/sidebar_items";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Login from "../components/Login";

const Login_page = () => {
    const [ isOpen, setIsOpen ] = useState( false );

    const nagivate = useNavigate();
    
    const ShowItems = ( item ) =>
    {
        const [ showLink, setShowLink ] = useState( false );
        return (
            <ul> 
                <li 
                    className="sidebar_items" 
                    onMouseEnter={ () => { setShowLink( true ) } }
                    onMouseLeave={ () => { setShowLink( false ) } } 
                    onClick={ (e) => { nagivate( `${item.link}` ) } }> 
                    {item.item_name} { showLink && <> { item.link } </> }
                </li>
            </ul>
        );
    };

    return (
        <div className="LoginPage"> 
            <div 
            className={ `sidebar_container ${ isOpen ? "sidebar_on" : "sidebar_off" } ` }>
                <div className="sidebar_header"> Sidebar </div>
                <div className="sidebar_list"> { sidebarItems.map( ShowItems ) } </div>
            </div>

                <Login></Login>
                <div>
                <button className="sidebar_toggle_btn" 
                        onClick={ () => { setIsOpen( !isOpen ) } } >
                        Toggle 
                </button>
                </div>
        </div>
        
    )
};
export default Login_page;