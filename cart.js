import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// Global cart array to store items
// This array holds all items that are added to the shopping cart.
let cart = [];

// Function to add an item to the cart
// This function handles adding items to the cart. If the item already exists, it increases the quantity.
// If the item is new, it adds it to the cart with a unique identifier.
function addToCart(item) {
  // Check if the item is already in the cart
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    // If the item is already in the cart, increase its quantity
    existingItem.quantity += 1;
  } else {
    // If the item is not in the cart, add it with an initial quantity of 1 and a unique UUID
    cart.push({ ...item, quantity: 1, uuid: uuidv4() });
    addItemToProductList(item); // Add the item to the product list for display
  }

  // Update the cart UI to reflect the changes
  updateCartUI();
}

// Function to add the item to the product list
// This function handles adding the newly added item to the product list on the page.
function addItemToProductList(item) {
  // Get the product list element from the DOM
  const productList = document.querySelector("#product-list");

  // Generate the HTML for the new product item
  const productItemHtml = `
        <li class="col-md-12 m-b30">
            <div class="dz-shop-card style-1">
                <div class="dz-media">
                    <img src="${item.imageUrl}" alt="${item.name}" />
                </div>
                <div class="dz-content">
                    <div class="dz-head">
                        <h6 class="dz-name mb-0">
                            <a href="product-detail.html">${item.name}</a>
                        </h6>
                        <div class="rate">
                            <i class="fa-solid fa-star"></i> ${item.rating}
                        </div>
                    </div>
                    <div class="dz-body">
                        <ul class="dz-meta">
                            <li>By <span class="text-primary font-weight-500">${item.vendor}</span></li>
                            <li><i class="flaticon-scooter"></i> ${item.deliveryTime} min</li>
                        </ul>
                        <p class="mb-0">
                            <span class="text-primary font-weight-500">₽${item.price}</span> For one
                        </p>
                    </div>
                </div>
            </div>
        </li>
    `;

  // Insert the new product item into the product list
  productList.insertAdjacentHTML("beforeend", productItemHtml);
}

// Function to remove an item from the cart
// This function handles removing an item from the cart based on its unique UUID.
function removeFromCart(itemId) {
  // Filter out the item with the specified UUID from the cart array
  cart = cart.filter((cartItem) => cartItem.uuid !== itemId);

  // Update the cart UI to reflect the changes
  updateCartUI();
}

// Function to update the quantity of an item in the cart
// This function handles updating the quantity of an item in the cart. If the quantity is set to 0 or less,
// it automatically sets the quantity to 1 (minimum allowed).
function updateItemQuantity(itemId, newQuantity) {
  // Find the item in the cart based on its UUID
  const item = cart.find((cartItem) => cartItem.uuid === itemId);

  if (item) {
    // Update the item's quantity, ensuring it's at least 1
    item.quantity = newQuantity > 0 ? newQuantity : 1;
  }

  // Update the cart UI to reflect the changes
  updateCartUI();
}

// Function to update the cart UI in the header and the cart section
// This function updates various parts of the UI to reflect the current state of the cart,
// including the item count, item list, and total prices.
function updateCartUI() {
  // Get elements from the DOM for the cart list and cart items section
  const cartList = document.querySelector(".cart-list");
  const cartItemsSection = document.querySelector("#cart-items");

  // Calculate the total number of items and the total price
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // Update the item count displayed in the header
  document.querySelector(".cart-btn .badge").textContent = cartItemCount;
  document.querySelector("#cart-count").textContent = `(${cartItemCount})`;

  // Generate the HTML for the items in the cart dropdown (in the header)
  cartList.innerHTML = cart
    .map(
      (item) => `
            <li class="cart-item">
                <div class="media">
                    <div class="media-left">
                        <a href="product-detail.html">
                            <img alt="/" class="media-object" src="${item.imageUrl}" />
                        </a>
                    </div>
                    <div class="media-body">
                        <h6 class="dz-title">
                            <a href="product-detail.html" class="media-heading">${item.name}</a>
                        </h6>
                        <span class="dz-price">₽ ${item.price}</span>
                        <span class="item-close" data-id="${item.uuid}">&times;</span>
                    </div>
                </div>
            </li>
        `
    )
    .join("");

  // Append total price and buttons at the bottom of the cart dropdown
  cartList.insertAdjacentHTML(
    "beforeend",
    `
        <li class="cart-item text-center d-flex justify-content-between">
            <h6 class="text-primary mb-0">Total:</h6>
            <h6 class="text-primary mb-0">₽ ${cartTotal.toFixed(2)}</h6>
        </li>
        <li class="text-center d-flex">
            <a href="shop-cart.html" class="btn btn-primary me-2 w-100 d-block btn-hover-1">
                <span>View Cart</span>
            </a>
            <a href="shop-checkout.html" class="btn btn-outline-primary w-100 d-block btn-hover-1">
                <span>Order Now</span>
            </a>
        </li>
    `
  );

  // Generate the HTML for the items in the cart section (sidebar)
  cartItemsSection.innerHTML = cart
    .map(
      (item) => `
            <div class="cart-item style-1">
                <div class="dz-media">
                    <img src="${item.imageUrl}" alt="${item.name}" />
                </div>
                <div class="dz-content">
                    <div class="dz-head">
                        <h6 class="title mb-0">${item.name}</h6>
                        <a href="javascript:void(0);" class="remove-item" data-id="${
                          item.uuid
                        }">
                            <i class="fa-solid fa-xmark text-danger"></i>
                        </a>
                    </div>
                    <div class="dz-body">
                        <div class="btn-quantity style-1">
                            <span class="input-group-btn-vertical">
                                <button class="btn btn-default bootstrap-touchspin-up" type="button" data-id="${
                                  item.uuid
                                }">
                                    <i class="ti-plus"></i>
                                </button>
                                <input type="text" value="${
                                  item.quantity
                                }" readonly />
                                <button class="btn btn-default bootstrap-touchspin-down" type="button" data-id="${
                                  item.uuid
                                }">
                                    <i class="ti-minus"></i>
                                </button>
                            </span>
                        </div>
                        <h5 class="price text-primary mb-0">₽ ${(
                          item.price * item.quantity
                        ).toFixed(2)}</h5>
                    </div>
                </div>
            </div>
        `
    )
    .join("");

  // Update total price in the sidebar
  document.querySelector("#item-total").textContent = `₽ ${cartTotal.toFixed(
    2
  )}`;
  document.querySelector("#cart-total").textContent = `₽ ${(
    cartTotal + 8.5
  ).toFixed(2)}`;

  // Add event listeners to remove buttons in both the header and sidebar
  document.querySelectorAll(".item-close").forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemId = e.target.dataset.id;
      removeFromCart(itemId);
    });
  });

  // Add event listeners to the quantity increase buttons
  document.querySelectorAll(".bootstrap-touchspin-up").forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemId = e.target.dataset.id;
      const item = cart.find((cartItem) => cartItem.uuid === itemId);
      if (item) {
        updateItemQuantity(itemId, item.quantity + 1);
      }
    });
  });

  // Add event listeners to the quantity decrease buttons
  document.querySelectorAll(".bootstrap-touchspin-down").forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemId = e.target.dataset.id;
      const item = cart.find((cartItem) => cartItem.uuid === itemId);
      if (item) {
        updateItemQuantity(itemId, item.quantity - 1);
      }
    });
  });
}

// Initial cart UI setup
// This function runs when the DOM content is fully loaded and ensures that the cart UI is updated
// to reflect the current state of the cart (if items were saved in the session).
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI(); // Initial update of the cart UI
});

export { addToCart, removeFromCart, updateCartUI };
