// -- Cart Card CSS Classes
const cartCardContainerClasses = ["row", "mx-2", "py-4", "g-0", "border-bottom"];
const removeItemDivClasses = ["col", "mt-1", "ml-1"];

const token = localStorage.getItem('token');

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

function clearInnerHTML(e1) {
    while (e1.firstChild) e1.removeChild(e1.firstChild);
}


// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    // Check URL params for filter on initial load
    let urlParams = new URLSearchParams(window.location.search);

    // Populate Shopping Cart on initial load
    await populateShoppingCart();

    // Populate Product Info on initial load
    if (urlParams.has('id')) {
        await populateProduct(urlParams.get('id'));
    } else {
        await populateProduct(950);
    }
});

async function populateProduct(productId) {
    const getProduct = await fetch(`https://valenciashopping.store/api/products/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const product = await getProduct.json();
    //console.log(product);

    // Query select Product Info
    const productName = document.querySelector("#product-name");
    const productDescription = document.querySelector("#product-description");
    const productPrice = document.querySelector("#product-price");
    const productImage = document.querySelector("#product-img");
    const productCategory = document.querySelector("#product-category");
    const productSizeRadio = document.querySelector("#product-size-radio");
    const productSize1 = document.querySelector("#product-size1");
    const productSize2 = document.querySelector("#product-size2");
    const productButton = document.querySelector("#add-product-btn");

    // Set Product Info
    productName.textContent = product.name;
    productDescription.textContent = product.description;
    productPrice.textContent = currencyFormatter.format(product.price);
    productImage.src = product.image_url;
    productCategory.textContent = `Available Sizes (${product.category})`;
    productSize1.textContent = product.size;
    productSize2.textContent = product.size;
    productSizeRadio.value = product.size;

    // Add Product to Cart
    productButton.addEventListener('click', async(evt) => {
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

    // Suggested Products
    await populateSuggestions(product);

}


// populateSuggestions with products
async function populateSuggestions(product) {
    const suggestions = document.querySelector("#suggested-products");
    clearInnerHTML(suggestions);
    const prodParams = new URLSearchParams({ "category": product.category }).toString();
    const getProducts = await fetch(`https://valenciashopping.store/api/products?${prodParams}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    let products = await getProducts.json();
    // Randomize products
    products = products.sort(() => Math.random() - 0.5);
    // Filter out current product
    products = products.filter(p => p.id !== product.id);
    console.log(products);

    products.forEach(p => {
        const productDiv = document.createElement('div');
        productDiv.classList.add("swiper-slide");
        productDiv.innerHTML = `
        <!-- Card Product-->
        <div class="card border border-transparent position-relative overflow-hidden h-100 transparent">
            <div class="card-img position-relative">
                <a href="product.html?id=${p.id}">
                    <picture class="position-relative overflow-hidden d-block bg-light">
                        <img class="w-100 img-fluid position-relative z-index-10" src="${p.image_url}">
                    </picture>
                </a>
            </div>
            <div class="card-body px-0">
                <a class="text-decoration-none link-cover" href="./product.html?id=${p.id}">${p.name}</a>
                <small class="text-muted d-block">${p.category}, Size ${p.size}</small>
                <p class="mt-2 mb-0 small">${currencyFormatter.format(p.price)}</p>
            </div>
        </div>
        <!--/ Card Product-->
        `;
        suggestions.appendChild(productDiv);
    });

    // Set swiper settings
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev"
        },
        breakpoints: {
            600: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            },
            1400: {
                slidesPerView: 4
            }
        }
    });

    swiper.update();


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
        <a href="product.html?id=${item.product.id}">
            <picture class="d-block ">
                <img class="img-fluid" src="${item.product.image_url}">
            </picture>
        </a>
    </div>
    <div class="col-9 offset-1">
        <div>
            <h6 class="justify-content-between d-flex align-items-start mb-2">
                <a href="product.html?id=${item.product.id}">${item.product.name}</a>
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