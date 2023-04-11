// -- Constants --
// --- Product Card CSS Classes ---
const productContainerClasses = ['col-12', 'col-sm-6', 'col-lg-4'];
const productCardClasses = ['card', 'border', 'border-transparent',
    'position-relative', 'overflow-hidden', 'h-100', 'transparent'
];
const productImgDivClasses = ['card-img', 'position-relative'];
const productPicClasses = ['position-relative', 'overflow-hidden', 'd-block', 'bg-light'];
const productImgClasses = ['w-100', 'img-fluid', 'position-relative', 'z-index-10'];
const cartButtonDivClasses = ['position-absolute', 'start-0', 'bottom-0', 'end-0', 'z-index-50', 'p-2'];
const cartButtonClasses = ['btn', 'btn-quick-add'];
const productCardBodyClasses = ['card-body', 'px-0'];

// -- Cart Card CSS Classes
const cartCardContainerClasses = ["row", "mx-2", "py-4", "g-0", "border-bottom"];
const removeItemDivClasses = ["col", "mt-1", "ml-1"];

const token = localStorage.getItem("token");

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

async function getCustomerLoggedIn(username) {
    const getCustomer = await fetch(`https://valenciashopping.store/api/customers/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const customer = await getCustomer.json();
    return customer;
}

// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    // Check URL params for filter on initial load
    let urlParams = new URLSearchParams(window.location.search).toString();
    urlParams = urlParams === "" ? "" : `?${urlParams}`;

    // Populate Product List on initial load
    await populateProductList(urlParams);

    // Populate Shopping Cart on initial load
    await populateShoppingCart();

    // Set Event Listener on filter button
    const filterButton = document.querySelector('#filterButton');
    filterButton.addEventListener('click', filterProducts);

    const cartAmountButton = document.querySelector("#cart-amount-btn");
    cartAmountButton.addEventListener('click', () => {
        this.window.location.href = "cart.html";
    });
});

// Filter products based on category and size
// Populate filtered products in productList
function filterProducts(evt) {
    evt.preventDefault();
    console.log("filter products");
    // Category Checkboxes
    const filterCategoryMen = document.querySelector('#filter-category-men');
    const filterCategoryWomen = document.querySelector('#filter-category-women');

    // Size Checkboxes
    const filterSizeS = document.querySelector('#filter-size-S');
    const filterSizeM = document.querySelector('#filter-size-M');
    const filterSizeL = document.querySelector('#filter-size-L');
    const filterSizeXL = document.querySelector('#filter-size-XL');

    // Fill Search Params if element is checked
    const searchParams = []
    if (filterCategoryMen.checked) searchParams.push(["category", "MEN"])
    if (filterCategoryWomen.checked) searchParams.push(["category", "WOMAN"])
    if (filterSizeS.checked) searchParams.push(["size", "S"]);
    if (filterSizeM.checked) searchParams.push(["size", "M"]);
    if (filterSizeL.checked) searchParams.push(["size", "L"]);
    if (filterSizeXL.checked) searchParams.push(["size", "XL"]);

    let urlParams = new URLSearchParams(searchParams).toString();
    urlParams = urlParams === "" ? "" : `?${urlParams}`;

    populateProductList(urlParams);

    // Set query params on window
    var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + urlParams;
    window.history.pushState({ path: refresh }, '', refresh);
}

function clearInnerHTML(e1) {
    while (e1.firstChild) e1.removeChild(e1.firstChild);
}

async function populateProductList(params = "") {
    // fetch product data from API
    const getProducts = await this.fetch(`https://valenciashopping.store/api/products${params}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const products = await getProducts.json();
    const productsList = document.querySelector('#productList');

    // Clear Products List
    clearInnerHTML(productsList);

    products.forEach(product => {
        createProductCard(productsList, product);
    });
}

async function createOrGetShoppingCart() {
    // Check if shopping cart exists
    const customer = await getCustomerLoggedIn();
    const urlParams = new URLSearchParams({ "orderStatus": "Shopping Cart", "customerId": customer.id }).toString();
    const getShoppingCart = await this.fetch(`https://valenciashopping.store/api/orderDetails?${urlParams}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const shoppingCarts = await getShoppingCart.json();
    // console.log(`Shopping Cart\n`, shoppingCarts);
    let shoppingCart;
    // Check if any open shopping cart
    if (shoppingCarts.length > 0) {
        shoppingCart = shoppingCarts[0];
    } else {
        // Create new shopping cart for user
        const url = `https://valenciashopping.store/api/orderDetails`
        const body = {
            orderStatus: "Shopping Cart",
            customer: { id: customer.id }
        };
        const options = {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', "Authorization": `Bearer ${token}` }),
        };
        options.body = JSON.stringify(body);
        const createCart = await fetch(url, options);
        shoppingCart = await createCart.json();
    }
    return shoppingCart;
}

async function populateShoppingCart() {
    // fetch shopping cart from API
    const shoppingCart = await createOrGetShoppingCart();

    const orderItems = shoppingCart.orderItems;
    console.log("Order Items\n", orderItems);

    // Populate headers
    const numItems = orderItems.length;
    const cartAmountButton = document.querySelector("#cart-amount-btn");
    cartAmountButton.innerHTML = `Shopping Cart (${numItems})`
    const cartSummaryH6 = document.querySelector('#cart-summary-h6');
    cartSummaryH6.innerHTML = `Cart Summary (${numItems} items)`;

    const cartTotal = document.querySelector('#cart-total');

    // Get a reference to cart and clear it
    const cartCardList = document.querySelector('#cart-items');
    clearInnerHTML(cartCardList);

    if (shoppingCart.orderItems.length <= 0) {
        console.log("No items in order");
        cartTotal.innerHTML = '$0.00';
        return
    }

    //Get & Set Cart Grand Total
    let total = 0;
    orderItems.forEach(item => {
        total += item.product.price * item.quantity;
    })
    total = currencyFormatter.format(total);
    cartTotal.innerHTML = total;

    // Set Cart Items
    orderItems.forEach(item => {
        createCartCard(cartCardList, item, shoppingCart.id);
    });

}

function createCartCard(cartCardList, item, shoppingCartId) {
    const cartCardContainer = document.createElement("div");

    cartCardContainer.classList.add(...cartCardContainerClasses);
    cartCardContainer.id = `cart-card-${item.id}`;

    let total = 0 + item.product.price * item.quantity;
    total = currencyFormatter.format(total);
    cartCardContainer.innerHTML = `
    <div class="col-2 position-relative">
        <picture class="d-block ">
            <img class="img-fluid" src="${item.product.image_url}">
        </picture>
    </div>
    <div class="col-9 offset-1">
        <div>
            <h6 class="justify-content-between d-flex align-items-start mb-2">
                ${item.product.name}
            </h6>
            <span class="d-block text-muted fw-bolder text-uppercase fs-9">Size: ${item.product.size} / Qty: ${item.quantity}</span>
        </div>
        <p class="fw-bolder text-end text-muted m-0">${total}</p>
    </div>
    <div class="col mt-1 ml-1" id="rmitem-${shoppingCartId}-${item.id}">
    </div>
    `;
    // Create Remove Button to easily remove items from cart
    const removeItemDiv = document.createElement("div");
    removeItemDiv.classList.add(...removeItemDivClasses);

    const removeItemButton = document.createElement('button');
    removeItemButton.classList.add("remove-cart-btn");
    removeItemButton.innerHTML = '<u>Remove</u>';
    removeItemDiv.appendChild(removeItemButton);
    cartCardContainer.appendChild(removeItemDiv);
    cartCardList.appendChild(cartCardContainer);

    // Add event listener
    removeItemButton.addEventListener('click', async(evt) => {
        evt.preventDefault();
        //console.log(shoppingCartId, item.id);
        // Delete item
        const deleteItem = await fetch(`https://valenciashopping.store/api/orderDetails/${shoppingCartId}/removeItem/${item.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const resp = await deleteItem.json();
        //console.log(resp);
        // Repopulate shopping cart
        populateShoppingCart();
    });
}

/**
 * Takes as input a productList container and a product.
 * Creates Product Card based off data and adds to productList.
 * @param {HTMLElement}  productsList Product List Container
 * @param {Object} product Product data from database
 * @returns {void} Nothing is returned. productList is mutated directly.
 */
function createProductCard(productsList, product) {
    // Create Product Card
    const productContainer = document.createElement("div");
    productContainer.classList.add(...productContainerClasses);

    const productCard = document.createElement("div");
    productCard.classList.add(...productCardClasses);
    productContainer.appendChild(productCard);

    const productImgDiv = document.createElement("div");
    productImgDiv.classList.add(...productImgDivClasses);
    productCard.appendChild(productImgDiv);

    const productPic = document.createElement("picture");
    productPic.classList.add(...productPicClasses);
    productImgDiv.appendChild(productPic);

    const productImg = document.createElement("img");
    productImg.classList.add(...productImgClasses);
    productImg.src = product.image_url;
    productImgDiv.appendChild(productImg);

    const cartButtonDiv = document.createElement("div");
    cartButtonDiv.classList.add(...cartButtonDivClasses);
    productImgDiv.appendChild(cartButtonDiv);

    const cartButton = document.createElement("button");
    cartButton.classList.add(...cartButtonClasses);
    cartButtonDiv.appendChild(cartButton);
    cartButton.innerHTML = '<i class="ri-add-line me-2 outline-focus"></i> Add to Cart';
    cartButton.id = `productList-${product.id}`

    cartButton.addEventListener('click', async(evt) => {
        evt.preventDefault();
        console.log("add product to cart");
        console.log(product.id);
        const shoppingCart = await createOrGetShoppingCart();
        console.log(shoppingCart.id);
        const addProduct = await fetch(`https://valenciashopping.store/api/orderDetails/${shoppingCart.id}/addProduct/${product.id}`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${token}` }
        });
        const resp = await addProduct.json();
        console.log(resp);
        await populateShoppingCart();
    });

    const productCardBody = document.createElement("div");
    productCardBody.classList.add(...productCardBodyClasses);
    productCardBody.innerHTML = `<p class="text-decoration-none">${product.name}</p>
    <small class="text-muted d-block">${product.category}, Size ${product.size}</small>
    <p class="mt-2 mb-0 small">${currencyFormatter.format(product.price)}</p>`
    productCard.appendChild(productCardBody);

    productsList.appendChild(productContainer);
}