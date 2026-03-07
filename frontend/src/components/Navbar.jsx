import { useNavigate } from "react-router-dom";

function Navbar(){

 const navigate = useNavigate();

 const role = localStorage.getItem("role");

 const logout = ()=>{

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  navigate("/");

 };


 return(

 <div style={navStyle}>

  <h2 style={{color:"white"}}>MarketNest</h2>

  <div style={{display:"flex",gap:"10px"}}>

   {role==="brand" && (

    <button style={btn} onClick={()=>navigate("/dashboard")}>
     Dashboard
    </button>

   )}

   <button style={btn} onClick={()=>navigate("/marketplace")}>
    Marketplace
   </button>

   <button style={logoutBtn} onClick={logout}>
    Logout
   </button>

  </div>

 </div>

 );

}


const navStyle={
 display:"flex",
 justifyContent:"space-between",
 alignItems:"center",
 background:"#4f46e5",
 padding:"12px 30px",
 marginBottom:"20px"
}

const btn={
 background:"white",
 border:"none",
 padding:"8px 14px",
 borderRadius:"6px",
 cursor:"pointer"
}

const logoutBtn={
 background:"#ef4444",
 color:"white",
 border:"none",
 padding:"8px 14px",
 borderRadius:"6px",
 cursor:"pointer"
}

export default Navbar;