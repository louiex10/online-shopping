window.addEventListener('DOMContentLoaded', async function() {
    console.log("Hello");
    const custTable = this.document.querySelector("#custTable");

    const tbody = custTable.createTBody();

    createRow(tbody, ["1", "Luis Alarcon", "lalarcon5@mail.valenciacollege.edu"]);
    createRow(tbody, ["2", "John Jenkins", "jjenkins@mail.valenciacollege.edu"]);
    createRow(tbody, ["3", "Will", "will@mail.valenciacollege.edu"]);

    var getCustomers = await this.fetch("https://valenciashopping.store/api/customers");
    var cust = getCustomers.json();
    console.log(cust);

});

function createRow(tbody, data = ["1", "2", "3"]) {
    const trow = tbody.insertRow();
    for (let i = 0; i < data.length; i++) {
        const tc1 = trow.insertCell();
        const tt1 = document.createTextNode(data[i]);
        tc1.appendChild(tt1);
    }
}