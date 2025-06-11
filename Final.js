const productList = document.getElementById('product-list');
const cart = document.getElementById('cart');
const cartButton = document.getElementById('toggle-cart-btn');
const searchInput = document.getElementById('search-input');
const pageContent = document.getElementById('page-content');
const cartSection = cart.closest('.col-md-4');

let cartItems = [];
let allProducts = [];

const myImages = [
  'dress-2-cr-450x672.jpg',
  'dsc01626-cr-450x672.jpg',
  'img_0158-cr-450x672.jpg',
  'img_0261-cr-450x672.jpg',
  'img_0293-cr-450x672.jpg',
  'img_0506-cr-450x672.jpg',
  'img_1085-cr-450x672.jpg',
  'img_1773-cr-450x672.jpg',
  'img_2554-cr-450x672.jpg',
  'img_2639-cr-450x672.jpg',
  'img_2926-cr-450x672.jpg',
  'lifestyle-f.jpg',
  'lifestyle-m.jpg',
  'loose-fit-t-shirts-2-cr-450x672.jpg',
  'performance-running-1-cr-450x672.jpg',
  'retro-culture-sneakers-1-cr-450x672.jpg',
  'smartcasual-f.jpg',
  'smartcasual-m.jpg',
  'sneakers-1-cr-450x672-1.jpg',
  'sneakers-1-cr-450x672-2.jpg',
  'sneakers-1-cr-450x672.jpg',
  'sneakers-7-cr-450x672.jpg',
  'sneakers-12-cr-450x672.jpg',
  'sportlife-f.jpg',
  'sportlife-m.jpg',
  't-shirts-2-cr-450x672.jpg',
  'ten113046-cr-450x672.jpg'
];


cartButton.addEventListener('click', () => {
  cartSection.classList.toggle('d-none');
  updateCart();
});

function updateCart() {
  if (!cartItems.length) {
    cart.innerHTML = '<p>No items in cart</p>';
    return;
  }
  cart.innerHTML = cartItems.map((item, i) => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span>${item.name} - $${item.price}</span>
      <button class="btn btn-sm btn-danger" data-index="${i}">Remove</button>
    </div>
  `).join('');
  cart.querySelectorAll('button').forEach(btn =>
    btn.addEventListener('click', e => removeFromCart(e.target.dataset.index))
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
  productList.innerHTML = products.map(({ title, name, price, imageUrl }) => `
    <div class="col">
      <div class="card h-100">
        <img src="${imageUrl || 'https://via.placeholder.com/200x200?text=No+Image'}" 
             alt="${title || name || 'Product'}" class="card-img-top" 
             style="object-fit:cover; height:200px;">
        <div class="card-body">
          <h5 class="card-title">${title || name || 'No Name'}</h5>
          <p class="card-text">Price: $${price || 0}</p>
          <button class="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
  productList.querySelectorAll('button').forEach((btn, i) =>
    btn.addEventListener('click', () => addToCart(products[i]))
  );
}

fetch('https://api.escuelajs.co/api/v1/products')
  .then(res => res.json())
  .then(products => {
    allProducts = products.map((p, i) => ({
      id: p.id,
      title: p.title,
      name: p.name,
      price: p.price,
      imageUrl: myImages[i % myImages.length]
    }));
    displayProducts(allProducts);
  })
  .catch(err => productList.innerHTML = `<p>Error loading products: ${err.message}</p>`);

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(({ title = '', name = '' }) =>
    (title + name).toLowerCase().includes(term)
  );
  displayProducts(filtered);
});
