import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

function ProductCard({ product, role, onEdit, onDelete, onView }) {

 return (

  <div className="product-card">

   <img
    src={product.images?.[0] || "https://via.placeholder.com/200"}
    alt={product.name}
   />

   <h3>{product.name}</h3>

   <p className="price">₹{product.price}</p>

   <div className="actions">

    <button
     className="view-btn"
     onClick={() => onView(product._id)}
    >
     <FaEye/> View
    </button>

    {role === "brand" && (

     <div className="brand-actions">

      <button
       className="edit-btn"
       onClick={() => onEdit(product._id)}
      >
       <FaEdit/>
      </button>

      <button
       className="delete-btn"
       onClick={() => onDelete(product._id)}
      >
       <FaTrash/>
      </button>

     </div>

    )}

   </div>

  </div>

 )

}

export default ProductCard;