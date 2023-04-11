// Auth token
const token = localStorage.getItem("token");

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

    // For each customer, add a row to customer table
    customers.forEach((c) => {
        createRow(tbody, [c.id, c.name, c.email, c.roles]);
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