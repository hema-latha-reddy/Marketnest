import axios from "axios";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails(){

 const {id} = useParams();

 const [product,setProduct] = useState(null);

 useEffect(()=>{

  fetchProduct();

 },[]);

 const fetchProduct = async ()=>{

  const res = await axios.get(
   `http://localhost:5050/api/products/${id}`
  );

  setProduct(res.data);

 };

 if(!product){
  return <h2 style={{padding:"40px"}}>Loading product...</h2>
 }

 return(

 <div className="details-container">

  <div className="details-card">

   <img
    src={product.images?.[0] || "https://via.placeholder.com/400"}
    alt={product.name}
   />

   <div className="details-info">

    <h2>{product.name}</h2>

    <p className="price">₹{product.price}</p>

    <p>Category: {product.category}</p>

    <p>

     This product is listed by a brand.
     Customers can only view product details.

    </p>

   </div>

  </div>

 </div>

 )

}

export default ProductDetails;