// Auth token
const token = localStorage.getItem("token");

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Whole number formatter
const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
});

// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    console.log('Admin Panel');
    // Select table using id
    const custTable = this.document.querySelector('#custTable');

    // Create a table body as base
    const tbody = custTable.createTBody();

    // fetch customer data from api
    const getCustomers = await this.fetch('https://valenciashopping.store/api/customers', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const customers = await getCustomers.json();

    // fetch customer data from api
    const getOrders = await this.fetch('https://valenciashopping.store/api/orderDetails?orderStatus=Shipped', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const orders = await getOrders.json();

    // Get KPIs
    const totalOrdersDiv = document.querySelector('#total-orders');
    const totalCustomersDiv = document.querySelector('#total-customers');
    const totalRevenueDiv = document.querySelector('#total-revenue');
    const totalItemsSoldDiv = document.querySelector('#total-items-sold');

    // Calculate KPIs
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    let totalRevenue = 0;
    let itemsSold = 0;
    orders.forEach((o) => {

        o.orderItems.forEach((oi) => {
            totalRevenue += oi.product.price * oi.quantity;
            itemsSold += oi.quantity;
        });
    });

    totalRevenue = currencyFormatter.format(totalRevenue);


    // Set KPIs
    totalOrdersDiv.textContent = numberFormatter.format(totalOrders);
    totalCustomersDiv.textContent = numberFormatter.format(totalCustomers);
    totalRevenueDiv.textContent = `${totalRevenue}`;
    totalItemsSoldDiv.textContent = numberFormatter.format(itemsSold);

    // Group orders by customer id
    const ordersByCustomer = orders.reduce((acc, o) => {
        const customer = o.customer;
        if (!acc[customer.id]) {
            acc[customer.id] = {
                customer,
                orders: 1
            };
        } else {
            acc[customer.id].orders++;
        }
        return acc;
    }, {});

    // For each customer, add a row to customer table
    customers.forEach((c, i) => {
        const orders = ordersByCustomer[c.id] ? ordersByCustomer[c.id].orders : 0;
        createRow(tbody, [c.id, c.name, c.email, orders, c.roles]);
    })
});

/**
 * Takes as input a table body and an array of data of any length.
 * Inserts row into tbody with cells for each piece of data.
 * @param {HTMLTableSectionElement} tbody Table body
 * @param {Array.<String>} data Array with data for each cell.
 * @returns {void} Nothing is returned. tbody is mutated directly.
 */
function createRow(tbody, data = ['1', '2', '3', '4']) {
    const trow = tbody.insertRow();
    for (let i = 0; i < data.length; i++) {
        const tc1 = trow.insertCell();
        const tt1 = document.createTextNode(data[i]);
        tc1.appendChild(tt1);
    }
    const buttonCell = trow.insertCell();
    const ordersButton = document.createElement("button");
    ordersButton.classList.add(...["btn", "btn-dark", "text-center"]);
    ordersButton.textContent = "See Order History";
    ordersButton.addEventListener('click', () => {
        window.location.href = `order_history.html?customerId=${data[0]}`;
    })
    buttonCell.appendChild(ordersButton);
}