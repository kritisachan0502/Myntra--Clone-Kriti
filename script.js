
// PRODUCT DATA
const products = [
    {
        id: 1,
        name: "Nike",
        description: "Men's Sports Shoes",
        price: 2499,
        originalPrice: 4999,
        category: "Men",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 2,
        name: "Roadster",
        description: "Casual Jacket",
        price: 1299,
        originalPrice: 2599,
        category: "Men",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"
    },
    {
        id: 3,
        name: "Accessorize",
        description: "Women's Handbag",
        price: 999,
        originalPrice: 1999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    },
    {
        id: 4,
        name: "DressBerry",
        description: "Women's Heels",
        price: 1499,
        originalPrice: 2999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500"
    },
    {
        id: 5,
        name: "H&M",
        description: "Cotton T-shirt",
        price: 599,
        originalPrice: 999,
        category: "Men",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        id: 6,
        name: "Levis",
        description: "Denim Jeans",
        price: 1799,
        originalPrice: 2999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"
    },
    {
        id: 7,
        name: "Fossil",
        description: "Classic Watch",
        price: 2999,
        originalPrice: 5999,
        category: "Men",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
        id: 8,
        name: "Puma",
        description: "Casual Sneakers",
        price: 1999,
        originalPrice: 3999,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    }
];

// SHOPPING DATA
let cart = [];
let wishlist = [];
let selectedCategory = "All";

// HTML ELEMENTS
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// DISPLAY PRODUCTS
function displayProducts(items) {
    if (items.length === 0) {
        productList.innerHTML =
            '<p class="empty-message">No products found.</p>';
        return;
    }

    productList.innerHTML = items.map(product => {
        const discount = Math.round(
            (product.originalPrice - product.price) /
            product.originalPrice * 100
        );

        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.description}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <strong>₹${product.price.toLocaleString("en-IN")}</strong>
                    <p>
                        <del>₹${product.originalPrice.toLocaleString("en-IN")}</del>
                        <span>${discount}% OFF</span>
                    </p>

                    <div class="card-actions">
                        <button onclick="addToCart(${product.id})">
                            ADD TO BAG
                        </button>

                        <button class="wishlist-btn"
                            onclick="toggleWishlist(${product.id})">
                            ${wishlist.includes(product.id) ? "♥" : "♡"}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// ADD PRODUCT TO CART
function addToCart(id) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    updateCart();
    alert("Product added to your bag!");
}

// REMOVE PRODUCT FROM CART
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// UPDATE CART
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const bagCount = document.getElementById("bagCount");
    const cartTotal = document.getElementById("cartTotal");

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    bagCount.textContent = totalQuantity;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-message">Your bag is empty.</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.id);

            return `
                <div class="cart-item">
                    <div>
                        <strong>${product.name}</strong>
                        <p>${product.description}</p>
                        <p>₹${product.price} × ${item.quantity}</p>
                    </div>

                    <button onclick="removeFromCart(${product.id})">
                        Remove
                    </button>
                </div>
            `;
        }).join("");
    }

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    cartTotal.textContent =
        "Total: ₹" + total.toLocaleString("en-IN");
}

// WISHLIST
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    updateWishlist();
    displayProducts(getFilteredProducts());
}

function updateWishlist() {
    const wishlistProducts =
        document.getElementById("wishlistProducts");

    document.getElementById("wishlistCount").textContent =
        wishlist.length;

    const items = products.filter(product =>
        wishlist.includes(product.id)
    );

    wishlistProducts.innerHTML = items.length
        ? items.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.description}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <strong>₹${product.price}</strong>
                    <button onclick="toggleWishlist(${product.id})">
                        Remove from Wishlist
                    </button>
                </div>
            </div>
        `).join("")
        : '<p class="empty-message">Your wishlist is empty.</p>';
}

// FILTER PRODUCTS
function getFilteredProducts() {
    const searchText = searchInput.value.toLowerCase();

    return products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });
}

function filterProducts() {
    let filtered = getFilteredProducts();

    if (sortSelect.value === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayProducts(filtered);
}

// CATEGORY BUTTONS
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category-btn")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        filterProducts();
    });
});

// SEARCH
searchInput.addEventListener("input", filterProducts);

// SORT
sortSelect.addEventListener("change", filterProducts);

// INITIAL DISPLAY
displayProducts(products);
updateCart();
updateWishlist();
