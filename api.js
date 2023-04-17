const express = require("express");
const {
  userModal,
  productModal,
  orderModal,
  brandModal,
  passModal,
} = require("./schema");
const app = express();
const router = express.Router();
var CryptoJS = require("crypto-js");
require("dotenv").config({ path: "password.env" });
const nodemailer = require("nodemailer");
//adding password
router.post("/api/addAdmin", async (req, res) => {
  const { username, password } = req.body;
  const admin = new passModal({ username, password });
  try {
    await admin.save();
    res.send("added successfully");
  } catch (error) {
    res.status(500).send("unsuccessfull");
  }
  res.send("hi");
});
router.post("/api/checkAdmin", async (req, res) => {
  const { username, password } = req.body;
  const admins = await passModal.find();
  const single = admins[0];
  if (single.username === username && single.password === password) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});
// adding user
router.post("/api/addUser", async (req, res) => {
  const { email } = req.body;
  let user = await userModal.findOne({ email });
  if (!user) {
    let newUser = new userModal({ email });
    try {
      await newUser.save();
      res.status(200).send("Successfully added the user");
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(200).send("User already registered");
  }
});
//updating user
router.put("/api/updateUser", async (req, res) => {
  const { email, name, city, address, postal, phone1, phone2 } = req.body;
  try {
    await userModal.findOneAndUpdate(
      { email },
      { name, city, address, postalCode: postal, phone1, phone2 }
    );
    res.status(200).send("success");
  } catch (error) {
    res.status(500).send(error);
  }
});

//getting user details
router.post("/api/getUser", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await userModal.findOne({ email });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//check if user is registered

router.post("/api/checkUser", async (req, res) => {
  const { email } = req.body;

  let user = await userModal.findOne({ email });

  if (user && user.city != "") {
    res.status(200).json(true);
  } else {
    res.status(200).json(false);
  }
});
//                        Products
//1. adding products
router.post("/api/addProduct", async (req, res) => {
  try {
    const newProduct = new productModal(req.body);
    await newProduct.save();
    res.status(200).send("Product successfully added");
  } catch (error) {
    res.status(500).send(error, "in adding product");
  }
});
//2. adding brand
router.post("/api/addBrand", async (req, res) => {
  try {
    const newBrand = new brandModal(req.body);
    await newBrand.save();
    res.status(200).send("brand successfully added");
  } catch (error) {
    res.status(500).send(error, "in adding brand maybe already existing");
  }
});
//3, get all brands
router.post("/api/getBrand", async (req, res) => {
  try {
    const brands = await brandModal.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).send(error, "in getting brand ");
  }
});
router.post("/api/changeProductPrice", async (req, res) => {
  const { productId, newPrice } = req.body;
  try {
    await productModal.findOneAndUpdate(
      { _id: productId },
      { price: newPrice }
    );
    res.status(200), send("Product Price Updated");
  } catch (error) {
    res.status(500).send(error, "error in updating price");
  }
});
router.post("/api/deleteProduct", async (req, res) => {
  const { productId } = req.body;
  try {
    await productModal.deleteOne({ _id: productId });
    res.status(200).send("Product successfully deleted");
  } catch (error) {
    res.status(500).send(error, "Error in deleting product");
  }
});

router.post("/api/changeProductStatus", async (req, res) => {
  const { productId, status, price } = req.body;
  try {
    await productModal.findOneAndUpdate(
      { _id: productId },
      { status: status, price: price }
    );
    res.status(200).send("Product status and price successfully changed");
  } catch (error) {
    res.status(500).send(error, "error in changing status of product");
  }
});
router.post("/api/getAllProducts", async (req, res) => {
  const { brand } = req.body;

  try {
    let allProducts = await productModal.find({ brand });
    console.log("hif");
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).send(error, " in getting all products");
  }
});
router.post("/api/getAllProductsAdmin", async (req, res) => {
  try {
    let allProducts = await productModal.find();

    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).send(error, " in getting all products");
  }
});
router.post("/api/getSomeProducts", async (req, res) => {
  const { brand, productName } = req.body;
  console.log(brand, productName);
  try {
    let allProducts = await productModal.find({
      brand,
      name: { $regex: productName, $options: "i" },
    });
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).send(error, " in getting all products");
  }
});
router.post("/api/getSomeProduct", async (req, res) => {
  let { productName } = req.body;
  console.log(productName);
  try {
    let products = await productModal.find({ name: { $regex: productName } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error, " in getting some product");
  }
});
// get product based on id
router.post("/api/getProduct", async (req, res) => {
  let { productId } = req.body;
  try {
    let products = await productModal.find({ _id: productId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error, " in getting some product");
  }
});

//          Orders

//checking if user exists
router.post("/api/checkOrder", async (req, res) => {
  let { email } = req.body;

  let user = await orderModal.findOne({ clientEmail: email });

  if (user) {
    console.log(true);
    res.status(200).json({ state: true });
  } else {
    res.status(200).json({ state: false });
  }
});

router.post("/api/addOrder", async (req, res) => {
  let orderDetails = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adeenahmad56@gmail.com",
      pass: "ejtrhgrnbzvefdqz",
    },
  });
  let mailOptions = {
    from: "adeenahmad56@gmail.com",
    to: "fa22-bcs-097@cuilahore.edu.pk",
    subject: "Test Email",
    text: "This is a test email sent using Nodemailer in Node.js!",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  try {
    let newOrder = new orderModal(orderDetails);
    await newOrder.save();
    res.status(200).send("new Order saved");
  } catch (error) {
    res.status(500).send(error, " in adding new order");
  }
});

router.post("/api/getOrders", async (req, res) => {
  try {
    let allOrders = await orderModal.find();
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).send(error, " in getting all orders");
  }
});

router.post("/api/changeOrderStatus", async (req, res) => {
  let { orderId, newStatus } = req.body;
  let user = await orderModal.findOne({ _id: orderId });
  let clientEmail = user.clientEmail;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adeenahmad56@gmail.com",
      pass: "ejtrhgrnbzvefdqz",
    },
  });
  let mailOptions = {
    from: "adeenahmad56@gmail.com",
    to: clientEmail,
    subject: "YOUGEE",
    text: "Your order has been packed and ready to deliver! It will hopefully arive within 7 days. Thanks for your patience we hope that our product will reach upto your expectation!!",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  try {
    await orderModal.findByIdAndUpdate({ _id: orderId }, { status: newStatus });
    res.status(200).send("Order status successfully changed");
  } catch (error) {
    res.status(500).send(error, " in changing status of order");
  }
});
router.post("/api/deleteOrder", async (req, res) => {
  let { orderId } = req.body;
  try {
    await orderModal.findOneAndDelete({ _id: orderId });
    res.status(200).send("Order status successfully changed");
  } catch (error) {
    res.status(500).send(error, " in changing status of order");
  }
});

router.post("/api/getUserOrders", async (req, res) => {
  let { clientEmail } = req.body;
  console.log(clientEmail);
  try {
    let allUserOrders = await orderModal.find({ clientEmail: clientEmail });
    console.log(allUserOrders);
    res.status(200).json(allUserOrders);
  } catch (error) {
    res.status(500).send(error, " in getting user orders");
  }
});

module.exports = router;
