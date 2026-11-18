export default function StatusBadge({status}){
    const styles = {
        Queued : "badge badge-warning" , 
        Syncing : "badge badge-info" , 
        Received : "badge badge-success" , 
        Assigned : "badge badge-info" , 
      "  In Progress" : "badge badge-info" , 
      Resolved : "badge badge-success", 
      Failed : "badge badge-danger",
    };

    return(
        <span className= {styles[status] || "badge"}>{status}</span>
    );
}