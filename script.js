document.addEventListener("DOMContentLoaded", loadProducts);

let products = JSON.parse(localStorage.getItem("products")) || [];

function addProduct() {
    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let stock = document.getElementById("productStock").value;
    let category = document.getElementById("productCategory").value;

    if (name && price && stock) {
        let product = {
            id: Date.now(),
            name,
            price: parseFloat(price),
            inStock: parseInt(stock),
            category,
            minStock: 5,
            totalSales: 0
        };
        products.push(product);
        saveAndRender();
    }
}

function updateStock(productId) {
    let product = products.find(p => p.id === productId);
    if (product && product.inStock > 0) {
        product.inStock--;
        product.totalSales++;
        saveAndRender();
    }
}

// ฟังก์ชันลบสินค้า
function deleteProduct(productId) {
    if (confirm("คุณต้องการลบสินค้านี้หรือไม่?")) {
        products = products.filter(product => product.id !== productId);
        saveAndRender();
    }
}

function checkLowStock() {
    let lowStockProducts = products.filter(p => p.inStock <= p.minStock);
    if (lowStockProducts.length > 0) {
        alert("มีสินค้าที่ใกล้หมด:\n" + lowStockProducts.map(p => `${p.name} (เหลือ ${p.inStock} ชิ้น)`).join("\n"));
    }
}

function generateSalesReport() {
    let report = "รายงานยอดขาย\n\n";
    products.forEach(product => {
        report += `${product.name}: ขายไป ${product.totalSales} ชิ้น\n`;
    });
    alert(report);
}

function showBestSellers() {
    let sortedProducts = [...products].sort((a, b) => b.totalSales - a.totalSales);
    let topProductsText = document.getElementById("topProductsText");

    if (!topProductsText) {
        console.error("ไม่พบ element #topProductsText ใน HTML");
        return;
    }

    if (sortedProducts.length === 0) {
        topProductsText.textContent = "ยังไม่มีสินค้าขายดี";
        return;
    }

    let topThree = sortedProducts.slice(0, 3).map((product, index) =>
        `${index + 1}. ${product.name} - ขายแล้ว ${product.totalSales} ชิ้น`
    ).join(" | ");

    topProductsText.textContent = `🔥 สินค้าขายดี: ${topThree}`;
}

// อัปเดตรายการสินค้า และเพิ่มปุ่ม "ลบ"
function renderTable() {
    let tableBody = document.getElementById("productTable");
    tableBody.innerHTML = "";

    products.forEach(product => {
        let row = `<tr>
            <td>${product.name}</td>
            <td>${product.price} บาท</td>
            <td>${product.inStock}</td>
            <td>${product.category}</td>
            <td><button onclick="updateStock(${product.id})">ขาย</button></td>
            <td><button onclick="deleteProduct(${product.id})" style="background-color: red; color: white;">ลบ</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function loadProducts() {
    renderTable();
}
