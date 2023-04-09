// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {

    // Populate Shopping Cart on initial load
    const shoppingCart = await populateShoppingCart();

    // Complete Order Button
    const checkoutButton = document.querySelector("#checkout-btn");
    checkoutButton.addEventListener('click', async() => {
        checkoutButton.disabled = true;
        const checkout = await checkoutCart();
        if (checkout) {
            this.window.location.href = "order_confirmed.html"
        } else {
            console.log("no items in shopping cart");
            checkoutButton.disabled = false;
            createAlert();
        }
    });

});

// Let user know they can't submit cart when it is empty
function createAlert() {
    const hasAlert = document.querySelector("#no-cart-alert");
    if (hasAlert) {
        return
    }
    const checkoutButton = document.querySelector("#checkout-btn");
    const parentDiv = checkoutButton.parentElement
    const alert = document.createElement("div");
    alert.id = "no-cart-alert"
    const alertClasses = ["alert", "alert-warning", "alert-dismissable", "fade", "show", "mt-1"];
    alert.classList.add(...alertClasses);
    alert.role = "alert";
    alert.innerHTML = `
        Your cart is empty. You need to add items to your cart before submitting an order.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    parentDiv.appendChild(alert);
}

async function checkoutCart() {
    const shoppingCart = await createOrGetShoppingCart();
    console.log(shoppingCart);
    if (shoppingCart.orderItems.length <= 0) {
        console.log("no items found")
        return false;
    }

    // Make call to update order status
    const url = `https://valenciashopping.store/api/orderDetails/${shoppingCart.id}`
    const body = { orderStatus: "Shipped" };
    const options = {
        method: "PUT",
        headers: new Headers({ 'content-type': 'application/json' }),
    };
    options.body = JSON.stringify(body);
    const updateCart = await fetch(url, options);
    const resp = await updateCart.json();
    console.log(resp);
    return true;
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
    if (shoppingCarts.length > 0) {
        shoppingCart = shoppingCarts[0];
    } else {
        // Create new shopping cart for user
        const url = `https://valenciashopping.store/api/orderDetails`
        const body = {
            orderStatus: "Shopping Cart",
            customer: { id: 2 } //@TODO: add logic for logged in user id, hardcoded to id=2
        };
        const options = {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json' }),
        };
        options.body = JSON.stringify(body);
        const createCart = await fetch(url, options);
        shoppingCart = await createCart.json();
    }
    return shoppingCart;
}

function clearInnerHTML(e1) {
    while (e1.firstChild) e1.removeChild(e1.firstChild);
}
async function populateShoppingCart() {
    // fetch shopping cart from API
    const shoppingCart = await createOrGetShoppingCart();
    const orderItems = shoppingCart.orderItems;
    console.log("Order Items\n", orderItems);

    // Populate headers
    const numItems = orderItems.length;
    const cartTotal = document.querySelector('#cart-total');

    // Get reference to cart and clear it
    const cartDiv = document.querySelector('#cart-items');
    clearInnerHTML(cartDiv);

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
    cartTotal.innerHTML = `$${total.toFixed(2)}`;



    // Create containing table
    const cartTable = document.createElement("table");
    const cartTableClasses = ["table", "align-middle"];
    cartTable.classList.add(...cartTableClasses);
    cartDiv.appendChild(cartTable);

    // Create containing cart body for table
    const cartBody = document.createElement("tbody");
    cartBody.classList.add("border-0");
    cartTable.appendChild(cartBody);

    // Set Cart Items
    orderItems.forEach(item => {
        createCartCard(cartBody, item, shoppingCart.id);
    });
}

async function createCartCard(cartList, item, shoppingCartId) {
    const cartCardBody = document.createElement("div");
    const cartCardBodyClasses = ["row", "mx-0", "py-4", "g-0", "border-bottom"];
    cartCardBody.classList.add(...cartCardBodyClasses);

    const total = (item.product.price * item.quantity).toFixed(2);

    cartCardBody.innerHTML = `
    <div class="col-2 position-relative">
        <picture class="d-block border">
            <img class="img-fluid" src="${item.product.image_url}">
        </picture>
    </div>
    <div class="col-9 offset-1">
        <div>
            <h6 class="justify-content-between d-flex align-items-start mb-2">
                ${item.product.name}
                <i class="ri-close-line ms-3 pointer"></i>
            </h6>
            <span class="d-block text-muted fw-bolder text-uppercase fs-9">Size: ${item.product.size} / Qty: ${item.quantity}</span>
        </div>
        <p class="fw-bolder text-end text-muted m-0">$${total}</p>
    </div>
    `;
    // Get reference to xButton
    const removeItemButton = cartCardBody.children[1].children[0].children[0].children[0];

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

    cartList.appendChild(cartCardBody);

}