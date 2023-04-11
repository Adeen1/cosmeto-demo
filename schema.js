const mongoose = require("mongoose");

//User schema
const schema = mongoose.Schema;
const userSchema = new schema(
  {
    email: { type: String, unique: true },
    phone1: { type: String, default: "" },
    phone2: { type: String, default: "" },

    name: { type: String },

    postalCode: { type: String },
    city: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

const productSchema = new schema({
  name: { type: String },
  category: { type: String, default: "Hair-Cosmetics" },
  price: { type: Number },
  brand: { type: String },
  status: { type: String, default: "Available" },
  description: { type: String },
  guide: { type: String },
  quantity: { type: String },
  features: { type: Array },
  img: { type: Array },
  volume: { type: Array, default: [] },
  color: { type: Array, default: [] },
  resource: { type: String },
});
const orderSchema = new schema({
  clientName: { type: String },
  clientEmail: { type: String },
  clientPhone1: { type: String },
  clientPhone2: { type: String, default: "" },
  clientAddress: { type: String },
  clientPostal: { type: String },
  clientCity: { type: String },
  total: { type: Number },
  items: { type: Array },
  status: { type: String, default: "packing" },
});

const brandSchema = new schema({
  name: { type: String, unique: true },
});
const passSchema = new schema({
  username: { type: String },
  password: { type: String },
});
const modal = mongoose.model;
const userModal = modal("User", userSchema);
const productModal = modal("products", productSchema);
const orderModal = modal("orders", orderSchema);
const brandModal = modal("brand", brandSchema);
const passModal = modal("password", passSchema);

module.exports = { userModal, productModal, orderModal, brandModal, passModal };
