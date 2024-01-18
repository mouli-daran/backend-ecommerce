const express = require("express");
const router = express.Router();

const { isLoggedIn, customRole } = require("../middlewares/user");
const {
  addProduct,
  getAllProduct,
  adminGetAllProduct,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct
} = require("../controllers/productController");

router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn , addReview);
router.route("/review").delete(isLoggedIn , deleteReview);
router.route("/reviews").get(isLoggedIn , getOnlyReviewsForOneProduct);

//admin route
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProduct);

  router
  .route("/admin/product/:id")
  .put(isLoggedIn , customRole('admin') , adminUpdateOneProduct)
  .delete(isLoggedIn , customRole('admin') , adminDeleteOneProduct)



module.exports = router;
