const productList = document.getElementById('product-list');
const cart = document.getElementById('cart');
const cartButton = document.getElementById('toggle-cart-btn');
const searchInput = document.getElementById('search-input');
const cartSection = cart.closest('.col-md-4');

let cartItems = [];
let allProducts = [];

cartButton.addEventListener('click', () => {
  cartSection.classList.toggle('d-none');
});

function updateCart() {
  if (cartItems.length === 0) {
    cart.innerHTML = '<p>No items in cart</p>';
    return;
  }

  cart.innerHTML = cartItems.map((item, index) => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span>${item.name} - $${item.price}</span>
      <button class="btn btn-sm btn-danger" data-index="${index}">Remove</button>
    </div>
  `).join('');

  cart.querySelectorAll('button').forEach(btn =>
    btn.addEventListener('click', () => removeFromCart(btn.dataset.index))
  );
}

function addToCart(product) {
  cartItems.push({ id: product.id, name: product.title, price: product.price });
  updateCart();
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  updateCart();
}

function displayProducts(products) {
  productList.innerHTML = products.map((product, index) => `
    <div class="col">
      <div class="card h-100">
        <img 
          src="${product.image || 'https://via.placeholder.com/200x200?text=No+Image'}"
          alt="${product.title || 'Product'}"
          class="card-img-top"
          style="object-fit: cover; height: 200px;"
          onerror="this.onerror=null;this.src='https://via.placeholder.com/200x200?text=No+Image';"
        >
        <div class="card-body">
          <h5 class="card-title">${product.title || 'No Name'}</h5>
          <p class="card-text">Price: $${product.price || 0}</p>
          <button class="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  productList.querySelectorAll('button').forEach((btn, i) =>
    btn.addEventListener('click', () => addToCart(products[i]))
  );
}

fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    displayProducts(allProducts);
  })
  .catch(err => {
    productList.innerHTML = `<p>Error loading products: ${err.message}</p>`;
  });

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(({ title = '' }) =>
    title.toLowerCase().includes(term)
  );
  displayProducts(filtered);
});
