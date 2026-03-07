import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login(){

 const navigate = useNavigate();

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const login = async ()=>{

  try{

   const res = await axios.post(
    "https://marketnest-goea.onrender.com/api/products",
    { email,password }
   );

   const token = res.data.token;
   const role = res.data.user.role;

   localStorage.setItem("token",token);
   localStorage.setItem("role",role);

   if(role === "brand"){
    navigate("/dashboard");
   }else{
    navigate("/marketplace");
   }

  }catch(err){

   toast.error("Invalid email or password");

  }

 };

 return(

  <div style={styles.container}>

   <div style={styles.card}>

    <h2>MarketNest Login</h2>

    <input
     style={styles.input}
     placeholder="Email"
     onChange={(e)=>setEmail(e.target.value)}
    />

    <input
     style={styles.input}
     type="password"
     placeholder="Password"
     onChange={(e)=>setPassword(e.target.value)}
    />

    <button
     style={styles.button}
     onClick={login}
    >
     Login
    </button>

    <p style={{marginTop:"10px"}}>

     New user?{" "}

     <span
      style={styles.link}
      onClick={()=>navigate("/signup")}
     >
      Create account
     </span>

    </p>

   </div>

  </div>

 )

}

const styles={

 container:{
  height:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"#eef2ff"
 },

 card:{
  background:"white",
  padding:"30px",
  borderRadius:"10px",
  width:"320px",
  boxShadow:"0 4px 12px rgba(0,0,0,0.1)"
 },

 input:{
  width:"100%",
  padding:"10px",
  marginTop:"10px",
  borderRadius:"6px",
  border:"1px solid #ddd"
 },

 button:{
  width:"100%",
  marginTop:"15px",
  background:"#4f46e5",
  color:"white",
  border:"none",
  padding:"10px",
  borderRadius:"6px",
  cursor:"pointer"
 },

 link:{
  color:"#4f46e5",
  cursor:"pointer"
 }

};

export default Login;