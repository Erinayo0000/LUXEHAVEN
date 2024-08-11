document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    initializePage();
});
function displayCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    if (cartSummary) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        cartSummary.innerHTML = ''; // Clear existing content

        Promise.all(cart.map(item => 
            fetch(`https://fakestoreapi.com/products/${item.id}`)
                .then(response => response.json())
                .then(product => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    productDiv.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>$${product.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <button class="remove-from-cart" data-product-id="${product.id}">Remove</button>
                    `;
                    cartSummary.appendChild(productDiv);
                })
        )).then(() => {
    
        }).catch(error => console.error('Error displaying cart summary:', error));
    } else {
        console.error("cart-summary element not found");
    }
}

function initializePage() {
    if (document.getElementById('featured-products')) {
        console.log("Fetching featured products...");
        fetchFeaturedProducts();
    }

    if (document.querySelector('.categories-list')) {
        console.log("Fetching categories...");
        fetchCategories();
    }

    if (document.querySelector('.cart-count')) {
        console.log("Fetching cart count...");
        fetchCartCount();
    }


    if (window.location.pathname.endsWith('cart.html')) {
        console.log("Displaying cart summary...");
        displayCartSummary();
    }

    if (window.location.pathname.endsWith('checkout.html')) {
        console.log("Setting up checkout...");
        setupCheckout();
    }
}


function fetchFeaturedProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(products => {
            const featuredProducts = document.getElementById('featured-products');
            products.slice(1, 4).forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                    <a href="product.html?id=${product.id}">View Details</a>
                `;
                featuredProducts.appendChild(productDiv);
            });
        });
}
function fetchCategories() {
    fetch('https://fakestoreapi.com/products/categories')
        .then(response => response.json())
        .then(categories => {
            const categoriesContainer = document.querySelector('.categories-list');
            categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category');
                categoryDiv.innerHTML = `<a href="shop.html?category=${category}">${category}</a>`;
                categoriesContainer.appendChild(categoryDiv);
            });
        });
}

function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    fetchCartCount();
}
function fetchCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCountElement.textContent = cart.length;
        console.log(`Cart count updated: ${cart.length}`);
    } else {
        console.error("cart-count element not found");
    }
}


// Product Page
document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromURL();
    if (productId) {
        fetchProductDetails(productId);
    }
});

function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function fetchProductDetails(productId) {
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            displayProductDetails(product);
        })
        .catch(error => console.error('Error fetching product details:', error));
}

function displayProductDetails(product) {
    document.getElementById('product-title').innerText = product.title;
    document.getElementById('product-description').innerText = product.description;
    document.getElementById('product-price').innerText = `$${product.price}`;
    
    const productGallery = document.getElementById('product-gallery');
    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.title;
    productGallery.appendChild(productImage);

    document.getElementById('add-to-cart').addEventListener('click', () => {
        addToCart(product);
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;
}


// Cart Page

if (window.location.pathname.endsWith('cart.html')) {
    const cartSummary = document.getElementById('cart-summary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(item => {
        fetch(`https://fakestoreapi.com/products/${item.id}`)
            .then(response => response.json())
            .then(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                `;
                cartSummary.appendChild(productDiv);
            });
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('subtotal').textContent = `$${subtotal}`;
    document.getElementById('total').textContent = `$${subtotal}`;

    document.getElementById('checkout').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
}



// Checkout Page
if (window.location.pathname.endsWith('checkout.html')) {
    const orderSummary = document.getElementById('order-summary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(item => {
        fetch(`https://fakestoreapi.com/products/${item.id}`)
            .then(response => response.json())
            .then(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                `;
                orderSummary.appendChild(productDiv);
            });
    });

    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.removeItem('cart');
        alert('Order placed successfully!');
        window.location.href = 'index.html';
    });
}

