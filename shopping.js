import { menuArray } from "./data.js";
import { addToCart } from "./cart.js";

// `filteredMenu` holds the currently filtered list of products to be displayed.
// Initially, it contains all items from `menuArray`.
let filteredMenu = [...menuArray];

// `currentPage` tracks the current page number for pagination.
let currentPage = 1;

// `itemsPerPage` determines how many items to display per page.
const itemsPerPage = 9;

// `fallbackImageUrl` is a default image URL to use when a product doesn't have an image.
const fallbackImageUrl = "https://bobep.vercel.app/assets/img/logo.webp";

// Function to display products on the current page.
function displayProducts(page = 1) {
  currentPage = page; // Set the current page.

  // Calculate the start and end indices for slicing the `filteredMenu` array.
  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;

  // Get the items to display on the current page.
  const paginatedItems = filteredMenu.slice(start, end);

  // Generate the HTML for the items and insert it into the product list.
  const productListHtml = generateMenuItems(paginatedItems);
  document.querySelector("#masonry").innerHTML = productListHtml;

  // Update the pagination controls and item count.
  updatePaginationControls();
  updateTotalItemsCount(filteredMenu.length);

  // Attach event listeners to the "Add To Cart" buttons.
  handleAddToCartButtons();
}

// Function to update the total count of items found and display it.
function updateTotalItemsCount(count) {
  document.querySelector(
    ".filter-item-show"
  ).innerText = `Search: ${count} items`;
}

// Function to update pagination controls based on the number of pages.
function updatePaginationControls() {
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage); // Calculate total pages.

  // Generate pagination buttons for each page.
  const paginationHtml = Array.from(
    { length: totalPages },
    (_, index) => `
    <li class="${index + 1 === currentPage ? "active" : ""}">
      <a href="javascript:void(0);" class="pagination-link" data-page="${
        index + 1
      }">
        ${index + 1}
      </a>
    </li>
  `
  ).join("");

  // Insert the pagination buttons into the DOM.
  document.querySelector(".pagination").innerHTML = paginationHtml;
}

// Function to handle search functionality and filter products based on the search query.
function handleSearch(query) {
  query = query.trim().toLowerCase(); // Normalize the query for case-insensitive comparison.

  // Filter the `menuArray` to match the search query.
  filteredMenu = menuArray.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  );

  currentPage = 1; // Reset to the first page.
  displayProducts(currentPage); // Display the filtered results.
}

// Function to filter products based on selected categories.
function handleCategoryFilter(selectedCategories) {
  if (selectedCategories.length === 0) {
    filteredMenu = [...menuArray]; // Show all items if no categories are selected.
  } else {
    // Filter items that belong to the selected categories.
    filteredMenu = menuArray.filter((item) =>
      selectedCategories.includes(item.category.toLowerCase())
    );
  }

  currentPage = 1; // Reset to the first page.
  displayProducts(currentPage); // Display the filtered results.
}

// Function to generate HTML for each product item.
function generateMenuItems(menuArray) {
  return menuArray
    .map((item) => {
      const imageUrl = item.imageUrl || fallbackImageUrl; // Use the fallback image if no image URL is provided.
      return `
      <li class="card-container col-xl-4 col-md-6 m-b30">
        <div class="dz-img-box style-7">
          <div class="dz-media">
            <img src="${imageUrl}" alt="${item.name}" />
            <div class="dz-meta">
              <ul>
                <li class="seller">${item.category}</li>
                <li class="rating"><i class="fa-solid fa-weight"></i> 45 rp</li>
              </ul>
            </div>
          </div>
          <div class="dz-content">
            <h5 class="title"><a href="product-detail.html">${
              item.name
            }</a></h5>
            <p>${item.description}</p>
            <h5 class="price">₽ ${item.price ?? "N/A"}</h5>
            <a href="javascript:void(0);" data-id="${
              item.id
            }" class="btn btn-primary btn-hover-2">Add To Cart</a>
          </div>
        </div>
      </li>
    `;
    })
    .join(""); // Join the array of HTML strings into a single string.
}

// Function to filter products by price range.
function handlePriceRange(minPrice, maxPrice) {
  // Filter items that fall within the specified price range.
  filteredMenu = menuArray.filter(
    (item) => item.price >= minPrice && item.price <= maxPrice
  );

  currentPage = 1; // Reset to the first page.
  displayProducts(currentPage); // Display the filtered results.
}

// Function to render category filters dynamically based on available categories.
function renderFilters() {
  const filtersHtml = generateCategoryFilters(menuArray);
  document.querySelector("#category-filters").innerHTML = filtersHtml;
}

// Function to generate HTML for the category filters.
function generateCategoryFilters(menuArray) {
  const categories = [...new Set(menuArray.map((item) => item.category))]; // Get unique categories.
  return categories
    .map((category) => {
      const categoryId = category.toLowerCase().replace(/\s+/g, "-"); // Create an ID-friendly version of the category name.
      return `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${categoryId}" id="category-${categoryId}" />
        <label class="form-check-label" for="category-${categoryId}">${category}</label>
      </div>
    `;
    })
    .join(""); // Join the array of HTML strings into a single string.
}

// Function to attach event listeners to the "Add To Cart" buttons.
function handleAddToCartButtons() {
  document.querySelectorAll(".btn-hover-2").forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemId = parseInt(e.target.dataset.id); // Get the ID of the item to add.
      const item = filteredMenu.find((menuItem) => menuItem.id === itemId); // Find the corresponding item in the filtered menu.
      addToCart(item); // Add the item to the cart.
    });
  });
}

// Function to render the initial filters and display the products on page load.
function render() {
  renderFilters(); // Render the category filters.
  displayProducts(currentPage); // Display the products for the initial page.
}

// Event listener for the DOMContentLoaded event to ensure the DOM is fully loaded before running scripts.
document.addEventListener("DOMContentLoaded", () => {
  render(); // Call the render function on page load.

  // Attach event listener to the search form for handling search queries.
  document.querySelector("#search-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the form from submitting in the traditional way.
    const query = document.querySelector("#search-input").value; // Get the search input value.
    handleSearch(query); // Perform the search and update the display.
  });

  // Attach event listener to the category filters for handling category selection.
  document.querySelector("#category-filters").addEventListener("change", () => {
    const selectedCategories = Array.from(
      document.querySelectorAll(".form-check-input:checked")
    ).map((input) => input.value); // Get the values of selected categories.
    handleCategoryFilter(selectedCategories); // Filter the products based on the selected categories.
  });

  // Attach event listener to the pagination controls for handling page navigation.
  document.querySelector(".pagination").addEventListener("click", (e) => {
    if (e.target.classList.contains("pagination-link")) {
      const page = parseInt(e.target.dataset.page, 10); // Get the page number from the clicked pagination link.
      displayProducts(page); // Display the products for the selected page.
    }
  });

  // Initialize the price range slider using the noUiSlider library.
  const slider = document.getElementById("slider-tooltips");
  noUiSlider.create(slider, {
    start: [0, 1000], // Set initial slider range values.
    connect: true, // Connect the slider handles.
    range: { min: 0, max: 1000 }, // Set the slider's minimum and maximum range.
    tooltips: [true, true], // Show tooltips on both handles.
    format: {
      to: (value) => parseInt(value), // Convert the slider value to an integer when displaying it.
      from: (value) => parseInt(value), // Convert the slider value to an integer when setting it.
    },
  });

  // Attach an event listener to update the displayed products whenever the slider values change.
  slider.noUiSlider.on("update", (values) => {
    const [minPrice, maxPrice] = values.map((value) => parseInt(value)); // Convert slider values to integers.
    handlePriceRange(minPrice, maxPrice); // Filter the products based on the selected price range.
  });
});

export { displayProducts };
