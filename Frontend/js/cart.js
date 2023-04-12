const token = localStorage.getItem("token");

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

async function getCustomerLoggedIn(username) {
    const getCustomer = await fetch(`http://localhost:8080/api/customers/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const customer = await getCustomer.json();
    return customer;
}

// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    // Populate Shopping Cart on initial load
    await populateShoppingCart();

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
    // console.log(shoppingCart);
    if (shoppingCart.orderItems.length <= 0) {
        console.log("no items found")
        return false;
    }

    // Make call to update order status
    const url = `http://localhost:8080/api/orderDetails/${shoppingCart.id}`
    const body = { orderStatus: "Shipped" };
    const options = {
        method: "PUT",
        headers: new Headers({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
    };
    options.body = JSON.stringify(body);
    const updateCart = await fetch(url, options);
    const resp = await updateCart.json();
    console.log(resp);
    return true;
}

async function createOrGetShoppingCart() {
    // Check if shopping cart exists
    const customer = await getCustomerLoggedIn();
    const urlParams = new URLSearchParams({ orderStatus: "Shopping Cart", customerId: customer.id }).toString();
    const getShoppingCart = await this.fetch(`http://localhost:8080/api/orderDetails?${urlParams}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const shoppingCarts = await getShoppingCart.json();
    console.log(`Shopping Cart\n`, shoppingCarts);
    let shoppingCart;
    // Check if any open shopping cart
    if (shoppingCarts.length > 0) {
        shoppingCart = shoppingCarts[0];
    } else {
        // Create new shopping cart for user
        const url = `http://localhost:8080/api/orderDetails`
        const body = {
            orderStatus: "Shopping Cart",
            customer: { id: customer.id }
        };
        const options = {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` }),
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
    total = currencyFormatter.format(total);
    cartTotal.innerHTML = `${total}`;



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

    const total = currencyFormatter.format(item.product.price * item.quantity);

    cartCardBody.innerHTML = `
    <div class="col-2 position-relative">
        <a href="product.html?id=${item.product.id}">
            <picture class="d-block border">
                <img class="img-fluid" src="${item.product.image_url}">
            </picture>
        </a>
    </div>
    <div class="col-9 offset-1">
        <div>
            <h6 class="justify-content-between d-flex align-items-start mb-2">
                <a href="product.html?id=${item.product.id}">${item.product.name}</a>
                <i class="ri-close-line ms-3 pointer"></i>
            </h6>
            <span class="d-block text-muted fw-bolder text-uppercase fs-9">Size: ${item.product.size} / Qty: ${item.quantity}</span>
        </div>
        <p class="fw-bolder text-end text-muted m-0">${total}</p>
    </div>
    `;
    // Get reference to xButton
    const removeItemButton = cartCardBody.children[1].children[0].children[0].children[1];
    console.log(removeItemButton)

    // Add event listener
    removeItemButton.addEventListener('click', async(evt) => {
        evt.preventDefault();
        //console.log(shoppingCartId, item.id);
        // Delete item
        const deleteItem = await fetch(`http://localhost:8080/api/orderDetails/${shoppingCartId}/removeItem/${item.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const resp = await deleteItem.json();
        //console.log(resp);
        // Repopulate shopping cart
        populateShoppingCart();
    });

    cartList.appendChild(cartCardBody);

}