window.addEventListener('DOMContentLoaded', async function() {
    // console.log('Hello');
    // Select table using id
    const custTable = this.document.querySelector('#custTable');

    // Create a table body as base
    const tbody = custTable.createTBody();

    // createRow(tbody, ['1', 'Luis Alarcon', 'lalarcon5@mail.valenciacollege.edu']);
    // createRow(tbody, ['2', 'John Jenkins', 'jjenkins@mail.valenciacollege.edu']);
    // createRow(tbody, ['3', 'Will', 'will@mail.valenciacollege.edu']);

    // fetch customer data from api
    const getCustomers = await this.fetch('http://localhost:8080/api/customers');
    const customers = await getCustomers.json();

    // For each customer, add a row to customer table
    customers.forEach((c) => {
        createRow(tbody, [c.id, c.name, c.email]);
    })

});

/**
 * Takes as input a table body and an array of data of any length.
 * Inserts row into tbody with cells for each piece of data.
 * @param {HTMLTableSectionElement} tbody Table body
 * @param {Array.<String>} data Array with data for each cell.
 * @returns {void} Nothing is returned. tbody is mutated directly.
 */
function createRow(tbody, data = ['1', '2', '3']) {
    const trow = tbody.insertRow();
    for (let i = 0; i < data.length; i++) {
        const tc1 = trow.insertCell();
        const tt1 = document.createTextNode(data[i]);
        tc1.appendChild(tt1);
    }
}