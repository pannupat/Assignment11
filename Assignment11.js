const readline = require("readline");
const fs = require("fs");

const datashop = fs.readFileSync("data.json");
let productt = JSON.parse(datashop).map(product => ({ ...product, balance: product.quantity }));

async function minishop() {
  const cart = [];

  while (true) {
    const input = await askInput("กรุณาพิมพ์คำสั่ง (ดูรายการสินค้า, ดูประเภทสินค้า, เพิ่มสินค้าในตะกร้า, ลบสินค้าในตะกร้า, แสดงสินค้าในตะกร้า): ");
    const [command, product_Id] = input.split(" ");

    switch (command) {
      case "ดูรายการสินค้า":
        displayProducts();
        break;

      case "ดูประเภทสินค้า":
        displayCategories();
        break;

      case "เพิ่มสินค้าในตะกร้า":
        addToCart(product_Id);
        break;

      case "ลบสินค้าในตะกร้า":
        removeFromCart(product_Id);
        break;

      case "แสดงสินค้าในตะกร้า":
        displayCart();
        break;

      default:
        console.log("คำสั่งไม่ถูกต้อง");
    }
  }

  function askInput(question) {
    return new Promise((resolve, reject) => {
      const readInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readInterface.question(question, input => {
        resolve(input);
        readInterface.close();
      });
    });
  }

  function displayProducts() {
    console.table(productt);
  }

  function displayCategories() {
    const categories = [...new Set(productt.map(product => product.category))];
    const categoryCount = categories.map(category => {
      const amount = productt.filter(product => product.category === category).length;
      return { category, amount };
    });
    console.table(categoryCount);
  }

  function addToCart(product_Id) {
    if (!product_Id) {
      console.log("โปรดระบุรหัสสินค้าที่ต้องการเพิ่ม");
      return;
    }

    const product = productt.find(product => product.product_id === product_Id);
    if (!product) {
      console.log("ไม่พบสินค้า");
      return;
    }

    if (product.balance > 0) {
      const index = cart.findIndex(item => item.name === product.name);
      if (index !== -1) {
        cart[index].amount++;
      } else {
        cart.push({ name: product.name, amount: 1 });
      }
      product.balance--;
      console.log(`เพิ่มสินค้า ${product.name} สำเร็จ`);
    } else {
      console.log("สินค้าหมด");
    }
  }

  function removeFromCart(product_Id) {
    if (!product_Id) {
      console.log("โปรดระบุรหัสสินค้าที่ต้องการลบ");
      return;
    }

    const product = productt.find(product => product.product_id === product_Id);
    if (!product) {
      console.log("ไม่พบสินค้า");
      return;
    }

    const index = cart.findIndex(item => item.name === product.name);
    if (index !== -1) {
      cart[index].amount--;
      if (cart[index].amount === 0) {
        cart.splice(index, 1);
      }
      product.balance++;
      console.log(`ลบสินค้า ${product.name} สำเร็จ`);
    } else {
      console.log("ไม่พบสินค้าในตะกร้า");
    }
  }

  function displayCart() {
    console.table(cart);
  }
}

minishop();
