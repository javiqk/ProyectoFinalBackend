const fs = require("fs");
const express = require("express");
const { log } = require("console");
const { Router } = express;

const multer = require("multer");
const { nextTick } = require("process");

const app = express();
const router = Router();
const routerCart = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", router);
app.use("/api/carrito", routerCart);

app.use(express.static("public"));
app.use("/static", express.static(__dirname + "/public"));


const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log("Port " + server.address().port + "está escuchando");
});

server.on("Error", (error) => console.log(`error en servidor ${error} `));


let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });



router.get("/", (req, resp) => {
  resp.json({ AllProducs: containerProduct.read() });
});

router.get("/:num", (req, res) => {
  res.json(containerProduct.getById(req.params.num));
});

router.post("/", (req, res) => {
  res.send({ ProductSaved: containerProduct.save(req.body) });
});

router.put("/:num", (req, resp) => {
  resp.json({
    EditedProduct: containerProduct.edit(
      req.params.num,
      req.body.title,
      req.body.price,
      req.body.descripcion,
      req.body.foto,
      req.body.stock
    ),
  });
});

router.delete("/:num", (req, resp) => {
  resp.json({ ProductDeleted: containerProduct.deleteById(req.params.num) });
});


routerCart.get("/", (req, resp) => {
  resp.json({ AllCartsAvailable: containerCart.readCart() });
});

routerCart.get("/:num", (req, res) => {
  res.json(containerCart.getById(req.params.num));
});

routerCart.post("/nuevoCarrito", (req, res) => {
  res.send({ CartCreated: containerCart.save(req.body) });
});

routerCart.post("/:num", (req, res) => {

  let productById = containerProduct.getById(req.body.productID);

  let resultado = containerCart.edit(req.params.num, productById);

  res.json({ ProductAdded: productById });
});

routerCart.get("/:num/productos", (req, resp) => {
  resp.json({
    ProductsInTheCart: containerCart.readProductInTheCart(req.params.num),
  });
});

routerCart.delete("/:num", (req, resp) => {

  let respond = containerCart.deleteById(req.params.num)
  resp.json({ CartEliminate: respond });
});


routerCart.delete("/:num/productos/:id_prod", (req, resp) => {
  containerCart.deleteProductInTheCart(req.params.num, req.params.id_prod);

  resp.json({
    CartEliminate: containerCart.deleteProductInTheCart(),
  });
});