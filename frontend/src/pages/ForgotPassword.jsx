import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword(){

 const navigate = useNavigate();

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [message,setMessage] = useState("");
 const [error,setError] = useState("");

 const reset = async ()=>{

  setError("");
  setMessage("");

  try{

   const res = await axios.post(
    "https://marketnest-goea.onrender.com/api/products",
    {
     email,
     newPassword:password
    }
   );

   setMessage(res.data.message);

   setTimeout(()=>{
    navigate("/");
   },2000);

  }catch(err){

   setError("User not found");

  }

 };

 return(

 <div className="auth-container">

  <div className="auth-card">

   <h2>Reset Password</h2>

   <input
    className="auth-input"
    placeholder="Email"
    onChange={(e)=>setEmail(e.target.value)}
   />

   <input
    className="auth-input"
    type="password"
    placeholder="New Password"
    onChange={(e)=>setPassword(e.target.value)}
   />

   {error && <p style={{color:"red"}}>{error}</p>}
   {message && <p style={{color:"green"}}>{message}</p>}

   <button
    className="auth-btn"
    onClick={reset}
   >
    Reset Password
   </button>

  </div>

 </div>

 )

}

export default ForgotPassword;