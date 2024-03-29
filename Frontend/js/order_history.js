const token = localStorage.getItem("token");

// Current Page
let currPage = 1;
const pageSize = 6;

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Whole number formatter
const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
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
    let urlParams = new URLSearchParams(window.location.search)

    // Populate Shopping Cart on initial load
    if (urlParams.has('customerId')) {
        await populateOrders(urlParams.get('customerId'));
    } else {
        const customer = await getCustomerLoggedIn();
        await populateOrders(customer.id);
    }

});

async function populateOrders(customerId) {
    // Get Customer Info
    console.log(customerId);
    const getCustomer = await fetch(`https://valenciashopping.store/api/customers/${customerId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const customer = await getCustomer.json();
    console.log(customer);

    // Display Customer Info
    const custName = document.querySelector("#customer-name");
    const custEmail = document.querySelector("#customer-email");
    const custId = document.querySelector("#customer-id");
    const numOrders = document.querySelector("#num-orders");

    custId.textContent = `Customer ID: ${customer.id}`;
    custName.textContent = `Customer Name: ${customer.name}`;
    custEmail.textContent = `Email: ${customer.email}`;

    const urlParams = new URLSearchParams({ orderStatus: "Shipped", customerId: customerId }).toString();
    const getOrders = await this.fetch(`https://valenciashopping.store/api/orderDetails?${urlParams}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const orders = await getOrders.json();
    numOrders.textContent = `Orders: ${numberFormatter.format(orders.length)}`;
    if (orders.length <= 0) {
        console.log(`no orders for user ${customerId}`);
        return
    }
    // sort orders by date descending
    orders.sort((a, b) => {
        return new Date(a.orderDate) - new Date(b.orderDate);
    });
    console.log(orders);
    const ordersList = document.querySelector("#ordersList");
    clearInnerHTML(ordersList);

    // Most recent orders first
    orders.reverse()

    orders.forEach((order) => {
        addOrder(order, ordersList);
    });

    // Add Pagination
    createPagination("#ordersList");

}

function createPagination(itemListId = "#productList") {
    currPage = 1;
    const itemList = document.querySelector(itemListId);

    // Add Pagination
    const productPaginator = document.querySelector('#productPaginator');
    clearInnerHTML(productPaginator);

    // Previous Button
    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    const prevButtonLink = document.createElement('a');
    prevButtonLink.classList.add('page-link');
    prevButtonLink.setAttribute('href', '#');
    prevButtonLink.innerText = 'Previous';
    prevButton.appendChild(prevButtonLink);
    productPaginator.appendChild(prevButton);

    prevButton.addEventListener('click', () => {
        if (currPage > 1) {
            const pageButtonOld = document.querySelector(`#page-${currPage}`);
            pageButtonOld.classList.remove('active');
            currPage--;
            const pageButtonNew = document.querySelector(`#page-${currPage}`);
            pageButtonNew.classList.add('active');
            turnPage(itemList);
        }
    });

    console.log(Math.ceil(itemList.children.length / pageSize));

    for (let i = 0; i < Math.ceil(itemList.children.length / pageSize); i++) {
        const pageButton = document.createElement('li');
        pageButton.id = "page-" + (i + 1);
        pageButton.classList.add('page-item');
        const pageButtonLink = document.createElement('a');
        pageButtonLink.classList.add('page-link');
        pageButtonLink.setAttribute('href', '#');
        pageButtonLink.innerText = i + 1;
        pageButton.appendChild(pageButtonLink);
        productPaginator.appendChild(pageButton);
        if (i === 0) pageButton.classList.add('active');
        pageButton.addEventListener('click', (evt) => {
            const pageButtonOld = document.querySelector(`#page-${currPage}`);
            pageButtonOld.classList.remove('active');
            currPage = i + 1;
            const pageButtonNew = document.querySelector(`#page-${currPage}`);
            pageButtonNew.classList.add('active');
            turnPage(itemList);
        });
    }

    // Next Button
    const nextButton = document.createElement('li');
    nextButton.classList.add('page-item');
    const nextButtonLink = document.createElement('a');
    nextButtonLink.classList.add('page-link');
    nextButtonLink.setAttribute('href', '#');
    nextButtonLink.innerText = 'Next';
    nextButton.appendChild(nextButtonLink);
    productPaginator.appendChild(nextButton);

    nextButton.addEventListener('click', () => {
        if (currPage < Math.ceil(itemList.children.length / pageSize)) {
            const pageButtonOld = document.querySelector(`#page-${currPage}`);
            pageButtonOld.classList.remove('active');
            currPage++;
            const pageButtonNew = document.querySelector(`#page-${currPage}`);
            pageButtonNew.classList.add('active');
            turnPage(itemList);
        }
    });

    // Hide products that are not on current page
    turnPage(itemList);
}

function turnPage(itemList) {
    let start = (currPage - 1) * pageSize;
    let end = (currPage - 1) * pageSize + pageSize - 1;
    end = end > itemList.children.length - 1 ? itemList.children.length - 1 : end;
    console.log("start:", start);
    console.log(end);
    itemList.children.forEach((product, index) => {
        if (index >= start && index <= end) {
            product.classList.remove('d-none');
        } else {
            product.classList.add('d-none');
        }
    });
}

function addOrder(order, ordersList) {
    const orderContainer = document.createElement("div");
    const orderContClasses = ["card", "order-card", "mb-4"];
    orderContainer.classList.add(...orderContClasses);

    // Create Order Header
    createOrderHeader(order, orderContainer);

    // Create Order Body
    createOrderBody(order, orderContainer);

    ordersList.appendChild(orderContainer);
}

function createOrderBody(order, orderContainer) {
    const orderBody = document.createElement("div");
    orderBody.classList.add("card-body");

    // Add Delivered title
    const date = formatDate(order.orderDate);
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = `Delivered ${date}`;
    orderBody.appendChild(title);

    const msg = document.createElement("p");
    msg.classList.add("card-text");
    msg.textContent = "Your order was left in the mail room.";
    orderBody.appendChild(msg);

    // Create List of items for order
    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add(...["table-responsive", "cart-items"]);
    populateOrderItems(order, itemsContainer);

    orderBody.appendChild(itemsContainer);

    orderContainer.appendChild(orderBody);
}

function populateOrderItems(order, itemsContainer) {
    // Create containing table
    const cartTable = document.createElement("table");
    const cartTableClasses = ["table", "align-middle"];
    cartTable.classList.add(...cartTableClasses);
    itemsContainer.appendChild(cartTable);

    // Create containing cart body for table
    const cartBody = document.createElement("tbody");
    cartBody.classList.add("border-0");
    cartTable.appendChild(cartBody);

    const orderItems = order.orderItems;

    // Set Cart Items
    orderItems.forEach(item => {
        createCartCard(cartBody, item);
    });
}

function formatDate(dateStr) {
    return new Date(Date.parse(dateStr)).toLocaleDateString();
}

function createOrderHeader(order, orderContainer) {
    const orderHeader = document.createElement("div");
    orderHeader.classList.add(...["card-header", "order-header"]);
    //Get & Set Cart Grand Total
    let total = 0;
    orderItems = order.orderItems;
    orderItems.forEach(item => {
        total += item.product.price * item.quantity;
    })
    total = currencyFormatter.format(total);
    const dateObj = formatDate(order.orderDate);
    const numItems = order.orderItems.length;
    orderHeader.innerHTML = `
    <div class="d-flex align-items-center mt-2">
        <div class="column mx-1">
            <div class="row">
                <h6>Order ID</h6>
            </div>
            <div class="row">
                <p class="small">${order.id}</p>
            </div>
        </div>
        <div class="column ms-5">
            <div class="row">
                <h6>Order Placed</h6>
            </div>
            <div class="row">
                <p class="small">${dateObj}</p>
            </div>
        </div>
        <div class="column ms-5">
            <div class="row">
                <h6>Total</h6>
            </div>
            <div class="row">
                <p class="small" id="cart-total">${total}</p>
            </div>
        </div>
        <div class="column mx-5">
            <div class="row">
                <h6>Items</h6>
            </div>
            <div class="row">
                <p class="small" id="cart-total">${numberFormatter.format(numItems)}</p>
            </div>
        </div>
    </div>
    `;
    orderContainer.appendChild(orderHeader);
}

function clearInnerHTML(e1) {
    while (e1.firstChild) e1.removeChild(e1.firstChild);
}

async function createCartCard(cartList, item) {
    const cartCardBody = document.createElement("div");
    const cartCardBodyClasses = ["row", "mx-0", "py-4", "g-0", "border-bottom"];
    cartCardBody.classList.add(...cartCardBodyClasses);

    const total = currencyFormatter.format(item.product.price * item.quantity);

    cartCardBody.innerHTML = `
    <div class="col-2 position-relative">
        <a href="product.html?id=${item.product.id}">
            <picture class="justify-content-center align-items-center">
                <img class="img-fluid border" src="${item.product.image_url}">
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
    `;
    cartList.appendChild(cartCardBody);

}