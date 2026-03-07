import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
function Marketplace(){

const [products,setProducts] = useState([]);
const [search,setSearch] = useState("");
const [category,setCategory] = useState("");
const [page,setPage] = useState(1);

const limit = 6;


const fetchProducts = async ()=>{

 try{

  const res = await axios.get(
   "https://marketnest-goea.onrender.com/api/products",
   {
    params:{
     search,
     category,
     page,
     limit
    }
   }
  );

  setProducts(res.data);

 }catch(err){

  console.log(err);

 }

};


useEffect(()=>{
 fetchProducts();
},[page]);


return(
<>
<Navbar />

<div style={{padding:"40px",fontFamily:"Arial"}}>

<h1>Marketplace</h1>

<p style={{
 background:"#eef2ff",
 padding:"10px",
 borderRadius:"6px",
 marginBottom:"20px"
}}>
Customers can browse products, search items and filter by category.
</p>


<div style={{
 display:"flex",
 gap:"10px",
 marginBottom:"30px",
 flexWrap:"wrap"
}}>

<input
 style={input}
 placeholder="Search products..."
 value={search}
 onChange={(e)=>setSearch(e.target.value)}
/>


<select
 style={input}
 value={category}
 onChange={(e)=>setCategory(e.target.value)}
>
<option value="">All Categories</option>
<option value="Shoes">Shoes</option>
<option value="Electronics">Electronics</option>
<option value="Accessories">Accessories</option>
<option value="Watch">Watch</option>
<option value="Slippers">Slippers</option>
<option value="Dress">Dress</option>
</select>


<button style={searchBtn} onClick={()=>{
 setPage(1);
 fetchProducts();
}}>
Search
</button>

</div>



<div style={{
 display:"grid",
 gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
 gap:"20px"
}}>

{products.length===0 ? (

<p>No products found</p>

):(

    products.map(p=>(

        <div key={p._id} style={productCard}>
        
        {p.images && p.images.length > 0 && (
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
        
        <h3 style={{marginBottom:"5px"}}>{p.name}</h3>
        
        <p style={{
         color:"#16a34a",
         fontWeight:"bold",
         fontSize:"18px"
        }}>
        ₹{p.price}
        </p>
        
        <p style={{color:"#555"}}>
        Category: {p.category}
        </p>
        
        </div>
    ))

)}

</div>



<div style={{
 marginTop:"30px",
 display:"flex",
 gap:"10px"
}}>

<button
 disabled={page===1}
 onClick={()=>setPage(page-1)}
>
Prev
</button>

<span>Page {page}</span>

<button
 onClick={()=>setPage(page+1)}
>
Next
</button>

</div>

</div>
</>

);

}



const input={
    padding:"10px",
    borderRadius:"8px",
    border:"1px solid #ddd",
    outline:"none"
   }
   
   const searchBtn={
    background:"#4f46e5",
    color:"white",
    border:"none",
    padding:"10px 16px",
    borderRadius:"8px",
    cursor:"pointer",
    fontWeight:"bold"
   }
   
   const productCard={
    background:"white",
    padding:"20px",
    borderRadius:"12px",
    boxShadow:"0 6px 18px rgba(0,0,0,0.1)",
    transition:"0.2s"
   }


export default Marketplace;