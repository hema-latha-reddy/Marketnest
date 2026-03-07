import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup(){

 const navigate = useNavigate();

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [confirmPassword,setConfirmPassword] = useState("");
 const [role,setRole] = useState("customer");
 const [showPassword,setShowPassword] = useState(false);
 const [error,setError] = useState("");

 const signup = async ()=>{

  if(password.length < 6){
   setError("Password must be at least 6 characters");
   return;
  }

  if(password !== confirmPassword){
   setError("Passwords do not match");
   return;
  }

  try{

   await axios.post(
    "https://marketnest-goea.onrender.com/api/products",
    {name,email,password,role}
   );

   toast.success("Account created successfully");

   navigate("/");

  }catch(err){

    if(err.response && err.response.data.message){
     setError(err.response.data.message);
    }else{
     setError("Signup failed. Try again.");
    }
   
   }
 };

 return(

 <div style={styles.container}>

  <div style={styles.card}>

   <h2>Create Account</h2>

   <input
    style={styles.input}
    placeholder="Full Name"
    onChange={(e)=>setName(e.target.value)}
   />

   <input
    style={styles.input}
    placeholder="Email"
    onChange={(e)=>setEmail(e.target.value)}
   />

   <div style={styles.passwordBox}>

    <input
     style={styles.passwordInput}
     type={showPassword ? "text" : "password"}
     placeholder="Password"
     onChange={(e)=>setPassword(e.target.value)}
    />

    <span
     style={styles.eye}
     onClick={()=>setShowPassword(!showPassword)}
    >
     {showPassword ? "🙈" : "👁"}
    </span>

   </div>

   <input
    style={styles.input}
    type="password"
    placeholder="Confirm Password"
    onChange={(e)=>setConfirmPassword(e.target.value)}
   />

   <div style={styles.rules}>

    Password must contain:
    <ul>
     <li>Minimum 6 characters</li>
     <li>Combination of letters or numbers</li>
    </ul>

   </div>

   <select
    style={styles.input}
    onChange={(e)=>setRole(e.target.value)}
   >
    <option value="customer">Customer</option>
    <option value="brand">Brand</option>
   </select>

   {error && (
    <p style={{color:"red"}}>{error}</p>
   )}

   <button
    style={styles.button}
    onClick={signup}
   >
    Create Account
   </button>

   <p style={{marginTop:"10px"}}>

    Already have an account?{" "}
    <span
     style={styles.link}
     onClick={()=>navigate("/")}
    >
     Login
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
  width:"340px",
  boxShadow:"0 4px 12px rgba(0,0,0,0.1)"
 },

 input:{
  width:"100%",
  padding:"10px",
  marginTop:"10px",
  borderRadius:"6px",
  border:"1px solid #ddd"
 },

 passwordBox:{
  display:"flex",
  alignItems:"center",
  marginTop:"10px",
  border:"1px solid #ddd",
  borderRadius:"6px"
 },

 passwordInput:{
  flex:1,
  padding:"10px",
  border:"none",
  outline:"none"
 },

 eye:{
  padding:"0 10px",
  cursor:"pointer"
 },

 rules:{
  fontSize:"13px",
  color:"#555",
  marginTop:"10px"
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

}

export default Signup;