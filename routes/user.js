const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getLoggedUserDetails,
    adminAllUsers,
    adminDeleteUser,
} = require("../controllers/userController");

const {isLoggedIn , customRole}= require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedUserDetails);
router.route("/admin/users").get(isLoggedIn, customRole('admin'), adminAllUsers);
router.route("/admin/user/:id").delete(isLoggedIn, customRole('admin'), adminDeleteUser);


module.exports = router;
