import {Link , Outlet} from "react-router-dom";
import {BusFront , Wifi , WifiOff} from "lucide-react";
import BottomNav from "./BottomNav";
import useNetworkStatus from "../hooks/useNetworkStatus";

export default function AppLayout(){
    const isOnline = useNetworkStatus();
    return(
        <div className="app-shell">
            <header className="topbar">
                <Link to="/" className="brand">
                <span className="brand-icon">
                    <BusFront size={23}/>
                </span>

                <span>
                    <strong>BusResQ</strong>
                        <small>Passenger Assistance</small>
                </span>
                </Link>

                <span className={`connection ${isOnline  ? "online" : "offline"}`}>
                    {isOnline ? <Wifi size={15}/> : <WifiOff size={15}/>}
                    {isOnline ? "Online" : "Offline"}
                </span>
            </header>

            <main className="page-content">
                <Outlet/>
            </main>
        <BottomNav/>
        </div>
    )
}