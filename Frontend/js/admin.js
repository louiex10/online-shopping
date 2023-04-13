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

// Current Page
let currPage = 1;
const pageSize = 10;

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

    // add pagination
    createPagination(tbody);

    // Create sales plot
    createSalesPlot(orders);
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

function clearInnerHTML(e1) {
    while (e1.firstChild) e1.removeChild(e1.firstChild);
}

function createPagination(itemList) {
    currPage = 1;

    // Add Pagination
    const productPaginator = document.querySelector('#productPaginator');
    clearInnerHTML(productPaginator);

    // Previous Button
    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    const prevButtonLink = document.createElement('a');
    prevButtonLink.classList.add('page-link');
    prevButtonLink.setAttribute('href', '#customerHeader');
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
        pageButtonLink.setAttribute('href', '#customerHeader');
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
    nextButtonLink.setAttribute('href', '#customerHeader');
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

function createSalesPlot(orders) {
    // 7 days ago
    let sevenDaysAgo = new Date();
    sevenDaysAgo = new Date(sevenDaysAgo.getTime() - 6 * 24 * 60 * 60 * 1000);
    sevenDaysAgo = new Date(sevenDaysAgo.toLocaleDateString());

    // Today
    let today = new Date();
    //console.log(sevenDaysAgo.toLocaleDateString());
    //console.log(today.toLocaleDateString());

    // Filter orders for last 7 days
    const last7Days = orders.filter((o) => {
        const orderDate = new Date(o.orderDate);
        return orderDate > sevenDaysAgo && orderDate <= today;
    });
    //console.log(last7Days);

    // Group orders by date
    const ordersByDate = last7Days.reduce((acc, o) => {
        const date = new Date(o.orderDate).toLocaleDateString();
        const orderSales = o.orderItems.reduce((acc, oi) => {
            return acc + oi.product.price * oi.quantity;
        }, 0);
        if (!acc[date]) {
            acc[date] = orderSales;
        } else {
            acc[date] += orderSales;
        }
        return acc;
    }, {});
    //console.log(ordersByDate);
    // Create array of dates and sales
    let dates = Object.keys(ordersByDate);
    let sales = Object.values(ordersByDate);

    // Sort dates and sales by dates
    let sorted = dates.map((d, i) => {
        return {
            date: d,
            sales: sales[i]
        }
    }).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    // Reassign dates and sales
    dates = sorted.map((d) => d.date);
    sales = sorted.map((d) => d.sales);

    // Add missing dates
    const firstDate = sevenDaysAgo;
    const lastDate = today;
    //console.log(lastDate);
    for (let d = firstDate; d <= lastDate; d.setTime(d.getTime() + 24 * 60 * 60 * 1000)) {
        const date = new Date(d).toLocaleDateString();
        //console.log(date);
        if (!dates.includes(date)) {
            dates.push(date);
            sales.push(0);
        }
    }
    // Sort dates and sales by dates
    sorted = dates.map((d, i) => {
        return {
            date: d,
            sales: sales[i]
        }
    }).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    // Reassign dates and sales
    dates = sorted.map((d) => d.date);
    sales = sorted.map((d) => d.sales);
    //console.log(sorted);

    // Plot sales data
    const salesPlot = document.getElementById('tester');
    Plotly.newPlot(salesPlot, [{
        x: dates,
        y: sales,
        type: 'bar',
    }], {
        yaxis: {
            tickprefix: '$',
            tickformat: ',.0f'
        },
        margin: { t: 0 }
    }, { responsive: true });
    const salesSpinner = document.getElementById('salesSpinner');
    salesSpinner.classList.add('d-none');
}