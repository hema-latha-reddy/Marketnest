const router = require("express").Router();

const {
 createProduct,
 getProducts,
 getProductById,
 updateProduct,
 deleteProduct,
 dashboardSummary,
 getBrandProducts
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/role");
const upload = require("../middleware/uploadMiddleware");


// PUBLIC ROUTE
router.get("/", getProducts);


// BRAND ROUTES
router.get("/summary", auth, role("brand"), dashboardSummary);
router.get("/brand", auth, role("brand"), getBrandProducts);


// PRODUCT DETAILS
router.get("/:id", getProductById);


// CREATE PRODUCT
router.post(
 "/",
 auth,
 role("brand"),
 upload.array("images",5),
 createProduct
);


// UPDATE PRODUCT
router.put("/:id", auth, role("brand"), updateProduct);


// ARCHIVE PRODUCT
router.delete("/:id", auth, role("brand"), deleteProduct);


module.exports = router;