const products = [
{
id: 1,
name: "AirSound Pro",
category: "electronics",
price: 129,
rating: 4.9,
reviews: 128,
emoji: "🎧",
tag: "BESTSELLER"
},
{
id: 2,
name: "Minimal Watch",
category: "accessories",
price: 89,
rating: 4.8,
reviews: 94,
emoji: "⌚",
tag: "NEW"
},
{
id: 3,
name: "Essential Hoodie",
category: "fashion",
price: 64,
rating: 4.7,
reviews: 211,
emoji: "👕",
tag: "POPULAR"
},
{
id: 4,
name: "Cloud Lamp",
category: "home",
price: 48,
rating: 4.6,
reviews: 76,
emoji: "💡",
tag: "NEW"
},
{
id: 5,
name: "Studio Speaker",
category: "electronics",
price: 159,
rating: 4.9,
reviews: 143,
emoji: "🔊",
tag: "TOP RATED"
},
{
id: 6,
name: "Everyday Sneakers",
category: "fashion",
price: 92,
rating: 4.8,
reviews: 187,
emoji: "👟",
tag: "POPULAR"
},
{
id: 7,
name: "Ceramic Vase",
category: "home",
price: 39,
rating: 4.5,
reviews: 62,
emoji: "🏺",
tag: ""
},
{
id: 8,
name: "Classic Backpack",
category: "accessories",
price: 79,
rating: 4.8,
reviews: 115,
emoji: "🎒",
tag: "BESTSELLER"
}
];

let cart = [];

let currentFilter = "all";
let currentSearch = "";
let currentSort = "default";

/* ================= DOM ================= */

const productsGrid = document.getElementById("productsGrid");
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const themeBtn = document.getElementById("themeBtn");

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

const newsletterForm = document.getElementById("newsletterForm");

/* ================= PRODUCTS ================= */

function renderProducts() {

let filtered = [...products];

// Category filter
if (currentFilter !== "all") {
filtered = filtered.filter(
product => product.category === currentFilter
);
}

// Search
if (currentSearch.trim() !== "") {

const search = currentSearch.toLowerCase();

filtered = filtered.filter(product =>
  product.name.toLowerCase().includes(search) ||
  product.category.toLowerCase().includes(search)
);


}

// Sorting
if (currentSort === "low") {
filtered.sort((a, b) => a.price - b.price);
}

if (currentSort === "high") {
filtered.sort((a, b) => b.price - a.price);
}

if (currentSort === "rating") {
filtered.sort((a, b) => b.rating - a.rating);
}

if (filtered.length === 0) {

productsGrid.innerHTML = `
  <div style="
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px;
    color: var(--muted);
  ">
    <h3>No products found</h3>
    <p>Try another search or category.</p>
  </div>
`;

return;


}

productsGrid.innerHTML = filtered.map(product => {

return `
  <article class="product-card">

    <div class="product-image">

      ${
        product.tag
          ? `<span class="product-tag">${product.tag}</span>`
          : ""
      }

      <button
        class="product-like"
        onclick="toggleLike(this)"
        aria-label="Add to wishlist"
      >
        ♡
      </button>

      <div class="product-emoji">
        ${product.emoji}
      </div>

    </div>

    <div class="product-info">

      <span class="product-category">
        ${product.category}
      </span>

      <h3>${product.name}</h3>

      <div class="rating">
        ★★★★★
        <span>
          ${product.rating} (${product.reviews})
        </span>
      </div>

      <div class="product-bottom">

        <strong class="product-price">
          $${product.price}
        </strong>

        <button
          class="add-btn"
          onclick="addToCart(${product.id})"
          aria-label="Add ${product.name} to cart"
        >
          +
        </button>

      </div>

    </div>

  </article>
`;


}).join("");
}

/* ================= FILTER ================= */

document.querySelectorAll(".filter").forEach(button => {

button.addEventListener("click", () => {

document.querySelectorAll(".filter")
  .forEach(btn => btn.classList.remove("active"));

button.classList.add("active");

currentFilter = button.dataset.filter;

renderProducts();


});

});

/* ================= CATEGORY CARDS ================= */

document.querySelectorAll(".category-card").forEach(card => {

card.addEventListener("click", () => {

currentFilter = card.dataset.category;

document.querySelectorAll(".filter")
  .forEach(btn => {

    btn.classList.toggle(
      "active",
      btn.dataset.filter === currentFilter
    );

  });

document
  .getElementById("shop")
  .scrollIntoView({
    behavior: "smooth"
  });

renderProducts();


});

});

/* ================= SEARCH ================= */

searchInput.addEventListener("input", event => {

currentSearch = event.target.value;

renderProducts();

});

/* ================= SORT ================= */

sortSelect.addEventListener("change", event => {

currentSort = event.target.value;

renderProducts();

});

/* ================= CART ================= */

function addToCart(id) {

const product = products.find(
product => product.id === id
);

const existing = cart.find(
item => item.id === id
);

if (existing) {

existing.quantity += 1;


} else {

cart.push({
  ...product,
  quantity: 1
});


}

updateCart();

showToast(${product.name} added to cart);

}

function removeFromCart(id) {

cart = cart.filter(
item => item.id !== id
);

updateCart();

}

function changeQuantity(id, change) {

const item = cart.find(
product => product.id === id
);

if (!item) return;

item.quantity += change;

if (item.quantity <= 0) {

cart = cart.filter(
  product => product.id !== id
);


}

updateCart();

}

function updateCart() {

const totalItems = cart.reduce(
(sum, item) => sum + item.quantity,
0
);

cartCount.textContent = totalItems;

if (cart.length === 0) {

cartItems.innerHTML = `
  <div class="empty-cart">

    <div>🛒</div>

    <h3>Your cart is empty</h3>

    <p>Add something you love.</p>

  </div>
`;


} else {

cartItems.innerHTML = cart.map(item => {

  return `
    <div class="cart-item">

      <div class="cart-item-image">
        ${item.emoji}
      </div>

      <div>

        <h4>${item.name}</h4>

        <p>$${item.price} each</p>

        <div class="quantity">

          <button
            onclick="changeQuantity(${item.id}, -1)"
          >
            −
          </button>

          <span>${item.quantity}</span>

          <button
            onclick="changeQuantity(${item.id}, 1)"
          >
            +
          </button>

          <button
            onclick="removeFromCart(${item.id})"
            style="
              margin-left: 5px;
              border: 0;
              color: #e33;
            "
          >
            ×
          </button>

        </div>

      </div>

      <strong class="cart-item-price">
        $${(item.price * item.quantity).toFixed(2)}
      </strong>

    </div>
  `;

}).join("");


}

const total = cart.reduce(
(sum, item) =>
sum + item.price * item.quantity,
0
);

cartTotal.textContent = $${total.toFixed(2)};
}

/* ================= CART OPEN/CLOSE ================= */

function openCart() {

cartSidebar.classList.add("open");
overlay.classList.add("show");

document.body.style.overflow = "hidden";

}

function closeCartSidebar() {

cartSidebar.classList.remove("open");
overlay.classList.remove("show");

document.body.style.overflow = "";

}

cartBtn.addEventListener("click", openCart);

closeCart.addEventListener(
"click",
closeCartSidebar
);

overlay.addEventListener(
"click",
closeCartSidebar
);

/* ================= THEME ================= */

themeBtn.addEventListener("click", () => {

document.body.classList.toggle("dark");

const isDark =
document.body.classList.contains("dark");

localStorage.setItem(
"nova-theme",
isDark ? "dark" : "light"
);

});

if (
localStorage.getItem("nova-theme") === "dark"
) {
document.body.classList.add("dark");
}

/* ================= MOBILE MENU ================= */

menuBtn.addEventListener("click", () => {

mobileMenu.classList.toggle("show");

});

document.querySelectorAll(".mobile-menu a")
.forEach(link => {

link.addEventListener("click", () => {

  mobileMenu.classList.remove("show");

});


});

/* ================= WISHLIST ================= */

function toggleLike(button) {

if (button.textContent.trim() === "♡") {

button.textContent = "♥";
button.style.color = "#e63946";


} else {

button.textContent = "♡";
button.style.color = "";


}

}

/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {

toast.querySelector("p").textContent = message;

toast.classList.add("show");

clearTimeout(toastTimer);

toastTimer = setTimeout(() => {

toast.classList.remove("show");


}, 2200);

}

/* ================= NEWSLETTER ================= */

newsletterForm.addEventListener("submit", event => {

event.preventDefault();

const email =
document.getElementById("emailInput").value;

if (!email) return;

showToast("You're on the list! ✦");

newsletterForm.reset();

});

/* ================= CHECKOUT ================= */

document
.getElementById("checkoutBtn")
.addEventListener("click", () => {

if (cart.length === 0) {

  showToast("Your cart is empty");

  return;

}

showToast(
  "Checkout demo — connect your payment system"
);


});

/* ================= INITIALIZE ================= */

renderProducts();
updateCart();
