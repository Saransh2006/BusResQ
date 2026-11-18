import { NavLink } from "react-router-dom";
import {House , FilePlus2 , ClipboardList} from "lucide-react";

const links = [
{to : "/" , label : "Home" , icon : House , end : true},
{to : "/report" , label : "Report" , icon : FilePlus2},
{to : "/reports" , label : "My Reports" , icon : ClipboardList},
];

export default function BottomNav(){
    return(
        <nav className="bottom-nav">
            {links.map(({to , label , icon: Icon , end})=>{
                <NavLink 
                key={to}
                 to = {to}
                  end = {end} 
                  className={({isActive})=>
                    `nav-link ${ isActive ? "active" : ""}`
            }
            >
                <Icon size = {20}/>
                <span>{label}</span>
            </NavLink>
            })}
        </nav>
    );
}