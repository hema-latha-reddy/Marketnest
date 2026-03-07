import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
function Dashboard(){

const token = localStorage.getItem("token");

const [products,setProducts] = useState([]);
const [summary,setSummary] = useState({total:0,published:0,archived:0});

const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [category,setCategory] = useState("");
const [status,setStatus] = useState("published");
const [images,setImages] = useState([]);
const [editingId,setEditingId] = useState(null);
const [filter,setFilter] = useState("all");


const fetchProducts = async ()=>{

 const res = await axios.get(
  "http://localhost:5050/api/products/brand",
  {headers:{Authorization:`Bearer ${token}`}}
 );

 setProducts(res.data);

};


const fetchSummary = async ()=>{

 const res = await axios.get(
  "http://localhost:5050/api/products/summary",
  {headers:{Authorization:`Bearer ${token}`}}
 );

 setSummary(res.data);

};


useEffect(()=>{
 fetchProducts();
 fetchSummary();
},[]);



const addProduct = async ()=>{

    try{
   
     const formData = new FormData();
   
     formData.append("name",name);
     formData.append("price",price);
     formData.append("category",category);
     formData.append("status",status);
   
     for(let i=0;i<images.length;i++){
      formData.append("images",images[i]);
     }
   
     await axios.post(
      "http://localhost:5050/api/products",
      formData,
      {
       headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
       }
      }
     );
   
     alert("Product created successfully");
   
     fetchProducts();
     fetchSummary();
   
    }catch(err){
     console.log(err);
    }
   
   };

const updateProduct = async ()=>{

 await axios.put(
  `http://localhost:5050/api/products/${editingId}`,
  {name,price,category,status},
  {headers:{Authorization:`Bearer ${token}`}}
 );

 setEditingId(null);

 setName("");
 setPrice("");
 setCategory("");

 fetchProducts();
 fetchSummary();

};



const archiveProduct = async(id)=>{

 await axios.delete(
  `http://localhost:5050/api/products/${id}`,
  {headers:{Authorization:`Bearer ${token}`}}
 );

 fetchProducts();
 fetchSummary();

};



const filteredProducts = products.filter(p=>{

 if(filter==="published") return p.status==="published";
 if(filter==="archived") return p.status==="archived";
 return true;

});



return(
<>
<Navbar />
<div style={{padding:"40px",fontFamily:"Arial"}}>

<h1>Brand Dashboard</h1>

<div style={{display:"flex",gap:"20px",marginBottom:"30px"}}>

<div style={card} onClick={()=>setFilter("all")}>
Total
<h2>{summary.total}</h2>
</div>

<div style={card} onClick={()=>setFilter("published")}>
Published
<h2>{summary.published}</h2>
</div>

<div style={card} onClick={()=>setFilter("archived")}>
Archived
<h2>{summary.archived}</h2>
</div>

</div>



<h2>{editingId ? "Edit Product" : "Add Product"}</h2>

<div style={form}>

<input
style={input}
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<input
placeholder="Category"
value={category}
onChange={(e)=>setCategory(e.target.value)}
/>

<input
 type="file"
 multiple
 onChange={(e)=>setImages(e.target.files)}
/>

<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
>
<option value="published">Published</option>
<option value="draft">Draft</option>
</select>

{editingId ? (

<button style={updateBtn} onClick={updateProduct}>
Update Product
</button>

):(

<button style={addBtn} onClick={addProduct}>
Add Product
</button>

)}

</div>



<h2 style={{marginTop:"40px"}}>My Products</h2>

<div style={grid}>

{filteredProducts.map(p=>(

<div key={p._id} style={productCard}>

{p.images && p.images.length>0 && (
 <img
  src={`https://marketnest-goea.onrender.com/api/products${p.images[0]}`}
  alt="product"
  style={{
   width:"100%",
   height:"150px",
   objectFit:"cover",
   borderRadius:"8px",
   marginBottom:"10px"
  }}
 />
)}

<h3>{p.name}</h3>

<p style={{color:"green"}}>₹{p.price}</p>

<p>{p.category}</p>

<p>Status: {p.status}</p>

<div style={{display:"flex",gap:"10px"}}>

<button
style={editBtn}
onClick={()=>{
 setEditingId(p._id);
 setName(p.name);
 setPrice(p.price);
 setCategory(p.category);
 setStatus(p.status);
}}
>
Edit
</button>

<button
style={archiveBtn}
onClick={()=>archiveProduct(p._id)}
>
Archive
</button>

</div>

</div>

))}

</div>

</div>
</>

);

}



const card={
    background:"linear-gradient(135deg,#6366f1,#4f46e5)",
    color:"white",
    padding:"20px",
    borderRadius:"12px",
    width:"150px",
    textAlign:"center",
    cursor:"pointer",
    boxShadow:"0 6px 18px rgba(0,0,0,0.2)",
    fontWeight:"bold"
   }
   
   const form={
    maxWidth:"420px",
    display:"flex",
    flexDirection:"column",
    gap:"12px",
    background:"white",
    padding:"20px",
    borderRadius:"12px",
    boxShadow:"0 4px 14px rgba(0,0,0,0.1)"
   }
   
   const grid={
    display:"grid",
    gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",
    gap:"20px",
    marginTop:"20px"
   }
   
   const productCard={
    background:"white",
    padding:"20px",
    borderRadius:"12px",
    boxShadow:"0 6px 18px rgba(0,0,0,0.1)",
    transition:"0.2s"
   }
   
   const addBtn={
    background:"#4f46e5",
    color:"white",
    border:"none",
    padding:"10px",
    borderRadius:"8px",
    cursor:"pointer",
    fontWeight:"bold"
   }
   
   const updateBtn={
    background:"#16a34a",
    color:"white",
    border:"none",
    padding:"10px",
    borderRadius:"8px",
    cursor:"pointer",
    fontWeight:"bold"
   }
   
   const editBtn={
    background:"#f59e0b",
    border:"none",
    padding:"6px 10px",
    borderRadius:"6px",
    cursor:"pointer",
    color:"white"
   }
   
   const archiveBtn={
    background:"#ef4444",
    color:"white",
    border:"none",
    padding:"6px 10px",
    borderRadius:"6px",
    cursor:"pointer"
   }

   const input={
    padding:"10px",
    borderRadius:"8px",
    border:"1px solid #ddd",
    outline:"none"
   }


export default Dashboard;