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
    const getProducts = await this.fetch(`https://valenciashopping.store/api/products${params}`);
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
    // @TODO: Add logic for sending customer info from jwt
    const urlParams = new URLSearchParams({ "orderStatus": "Shopping Cart" }).toString();
    const getShoppingCart = await this.fetch(`https://valenciashopping.store/api/orderDetails?${urlParams}`)
    const shoppingCarts = await getShoppingCart.json();
    // console.log(`Shopping Cart\n`, shoppingCarts);
    let shoppingCart;
    // Check if any open shopping cart
    if (shoppingCarts) {
        shoppingCart = shoppingCarts[0];
    } else {
        // Create new one for user
        const createCart = await fetch("https://valenciashopping.store/api/orderDetails", {
            method: "POST",
            body: {
                customer: { id: 2 },
                orderStatus: "Shopping Cart"
            } //@TODO: add logic for logged in user id, hardcoded to id=2
        })
        shoppingCart = await createCart.json();
    }
    return shoppingCart;
}

async function populateShoppingCart() {
    // fetch shopping cart from API
    const shoppingCart = await createOrGetShoppingCart();

    // Check if any items in cart
    console.log(`Shopping Cart\n`, shoppingCart);

    const orderItems = shoppingCart.orderItems;
    console.log("Order Items\n", orderItems);

    // Populate headers
    const numItems = orderItems.length;
    const cartAmountButton = document.querySelector("#cart-amount-btn");
    cartAmountButton.innerHTML = `Shopping Cart (${numItems})`
    const cartSummaryH6 = document.querySelector('#cart-summary-h6');
    cartSummaryH6.innerHTML = `Cart Summary (${numItems} items)`;

    const cartTotal = document.querySelector('#cart-total');

    if (!shoppingCart.orderItems) {
        console.log("No items in order");
        cartTotal.innerHTML = '$0.00';
        return
    }

    //Get & Set Cart Grand Total
    let total = 0;
    orderItems.forEach(item => {
        total += item.product.price * item.quantity;
    })
    cartTotal.innerHTML = `$${total.toFixed(2)}`;

    // Set Cart Items
    const cartCardList = document.querySelector('#cart-items');
    clearInnerHTML(cartCardList);
    orderItems.forEach(item => {
        createCartCard(cartCardList, item, shoppingCart.id);
    });

}

function createCartCard(cartCardList, item, shoppingCartId) {
    const cartCardContainer = document.createElement("div");
    const cartCardContainerClasses = ["row", "mx-2", "py-4", "g-0", "border-bottom"];
    cartCardContainer.classList.add(...cartCardContainerClasses);
    cartCardContainer.id = `cart-card-${item.id}`;

    const total = 0 + item.product.price * item.quantity;
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
        <p class="fw-bolder text-end text-muted m-0">$${total.toFixed(2)}</p>
    </div>
    <div class="col mt-1 ml-1" id="rmitem-${shoppingCartId}-${item.id}">
    </div>
    `;
    // Create Remove Button to easily remove items from cart
    const removeItemDiv = document.createElement("div");
    const removeItemDivClasses = ["col", "mt-1", "ml-1"];
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
        const deleteItem = await fetch(`https://valenciashopping.store/api/orderDetails/${shoppingCartId}/removeItem/${item.id}`, { method: "DELETE" });
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
    cartButton.innerHTML = '<i class="ri-add-line me-2"></i> Add to Cart';
    cartButton.id = `productList-${product.id}`

    cartButton.addEventListener('click', async(evt) => {
        evt.preventDefault();
        console.log("add product to cart");
        console.log(product.id);
        const shoppingCart = await createOrGetShoppingCart();
        console.log(shoppingCart.id);
        const addProduct = await fetch(`https://valenciashopping.store/api/orderDetails/${shoppingCart.id}/addProduct/${product.id}`, { method: 'POST' });
        const resp = await addProduct.json();
        console.log(resp);
        await populateShoppingCart();
    });

    const productCardBody = document.createElement("div");
    productCardBody.classList.add(...productCardBodyClasses);
    productCardBody.innerHTML = `<p class="text-decoration-none link-cover">${product.name}</p>
    <small class="text-muted d-block">${product.category}, Size ${product.size}</small>
    <p class="mt-2 mb-0 small">$${product.price.toFixed(2)}</p>`
    productCard.appendChild(productCardBody);

    productsList.appendChild(productContainer);
}