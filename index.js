import { menuArray } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const orderArray = [];

// Function to create HTML for menu items with fallback image
function createMenuHtml(menuArray) {
  const fallbackImageUrl = "https://bobep.vercel.app/assets/img/logo.webp";

  return menuArray
    .map((menuItem) => {
      const imageUrl = menuItem.imageUrl || fallbackImageUrl;
      return `
      <div class="menuItem" data-item-id="${menuItem.id}">
          <img src="${imageUrl}" alt="${menuItem.name}" class="menuImage">
          <div class="menuDetails">
              <h3>${menuItem.name}</h3>
              <p>${menuItem.description}</p>
              <p>₽ ${menuItem.price ?? "N/A"}</p>
          </div>
          <button class="addDishBtn">To Cart</button>
      </div>
    `;
    })
    .join("");
}

// Function to create HTML for the cart/order items
function createOrderHtml(orderArray) {
  const totalPrice = orderArray.reduce(
    (total, item) => total + (item.price ?? 0),
    0
  );

  const orderItemsHtml = orderArray
    .map(
      (orderItem) => `
    <div class="orderItem" data-uuid="${orderItem.uuid}">
        <div class="orderItemDetails">
            <h2>${orderItem.name}</h2>
            <button class="removeFromOrderBtn">REMOVE</button>
        </div>
        <p class="orderItemPrice">₽ ${orderItem.price ?? "N/A"}</p>
    </div>
  `
    )
    .join("");

  return `
    <div class="orderSummary">
        <h3>Your order</h3>
        ${orderItemsHtml}
        <div class="orderTotal">
            <hr>
            <h3>Total price:</h3>
            <p class="totalPrice">₽ ${totalPrice}</p>
        </div>
        <button class="completeOrderBtn">Complete Order</button>
    </div>
  `;
}

// New functions to dynamically generate category filters and populate menu items
function generateCategoryFilters(menuArray) {
  const categories = [...new Set(menuArray.map((item) => item.category))];
  return categories
    .map((category) => {
      const categoryClass = category.toLowerCase().replace(/\s+/g, "-");
      return `
      <li data-filter=".${categoryClass}" class="btn">
          <a href="javascript:void(0);"><span><i class="flaticon-fast-food"></i></span>${category.toUpperCase()}</a>
      </li>
    `;
    })
    .join("");
}

function generateMenuItems(menuArray) {
  const fallbackImageUrl = "https://bobep.vercel.app/assets/img/logo.webp";

  return menuArray
    .map((item) => {
      const imageUrl = item.imageUrl || fallbackImageUrl;
      const categoryClass = item.category.toLowerCase().replace(/\s+/g, "-");
      return `
      <li class="card-container col-lg-4 col-md-6 col-sm-6 All ${categoryClass}">
          <div class="dz-img-box style-8">
              <a href="${imageUrl}" title="${
        item.name
      }" data-src="${imageUrl}" class="dz-media lg-item">
                  <img src="${imageUrl}" alt="${
        item.name
      }" width="800" height="650" />
              </a>
              <div class="dz-content">
                  <div class="dz-head">
                      <h6 class="title"><a href="product-detail.html">${
                        item.name
                      }</a></h6>
                      <span class="heart"></span>
                  </div>
                  <p class="category">${item.description || item.category}</p>
                  <p class="price">₽ ${item.price ?? "N/A"}</p>
              </div>
          </div>
      </li>
    `;
    })
    .join("");
}

// Render filters and menu items
function renderFilters() {
  const filtersHtml = `
    <li data-filter=".All" class="btn active">
        <a href="javascript:void(0);"><span><i class="flaticon-fast-food"></i></span>ALL</a>
    </li>
    ${generateCategoryFilters(menuArray)}
  `;
  document.querySelector("#category-filters").innerHTML = filtersHtml;
}

function renderMenu() {
  const menuHtml = generateMenuItems(menuArray);
  document.querySelector("#masonry").innerHTML = menuHtml;
}

// Main render function
function render() {
  renderFilters();
  renderMenu();
  document.getElementById("menuContainer").innerHTML =
    createMenuHtml(menuArray);
  document.getElementById("orderContainer").innerHTML =
    createOrderHtml(orderArray);
}

// Event listeners for adding/removing items from the cart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("addDishBtn")) {
    const itemId = e.target.closest(".menuItem").dataset.itemId;
    const itemToAdd = menuArray.find((item) => item.id == itemId);
    if (itemToAdd) {
      itemToAdd.uuid = uuidv4();
      orderArray.push(itemToAdd);
      render();
    }
  } else if (e.target.classList.contains("removeFromOrderBtn")) {
    const uuid = e.target.closest(".orderItem").dataset.uuid;
    const indexToRemove = orderArray.findIndex((item) => item.uuid === uuid);
    if (indexToRemove !== -1) {
      orderArray.splice(indexToRemove, 1);
      render();
    }
  }
});

// Initial render call
render();
