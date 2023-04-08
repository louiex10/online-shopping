window.addEventListener('DOMContentLoaded', async function() {


    // fetch product data from api
    const getProducts = await this.fetch('https://valenciashopping.store/api/products');
    const products = await getProducts.json();
    const productsList = document.querySelector('#productList');

    products.forEach(product => {
        createProductCard(productsList, product);
    });



});

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
    const productContainerClasses = ['col-12', 'col-sm-6', 'col-lg-4'];
    productContainer.classList.add(...productContainerClasses);

    const productCard = document.createElement("div");
    const productCardClasses = ['card', 'border', 'border-transparent',
        'position-relative', 'overflow-hidden', 'h-100', 'transparent'
    ];
    productCard.classList.add(...productCardClasses);
    productContainer.appendChild(productCard);

    const productImgDiv = document.createElement("div");
    const productImgDivClasses = ['card-img', 'position-relative'];
    productImgDiv.classList.add(...productImgDivClasses);
    productCard.appendChild(productImgDiv);

    const productPic = document.createElement("picture");
    const productPicClasses = ['position-relative', 'overflow-hidden', 'd-block', 'bg-light'];
    productPic.classList.add(...productPicClasses);
    productImgDiv.appendChild(productPic);

    const productImg = document.createElement("img");
    const productImgClasses = ['w-100', 'img-fluid', 'position-relative', 'z-index-10'];
    productImg.classList.add(...productImgClasses);
    productImg.src = product.image_url;
    productImgDiv.appendChild(productImg);

    const cartButtonDiv = document.createElement("div");
    const cartButtonDivClasses = ['position-absolute', 'start-0', 'bottom-0', 'end-0', 'z-index-50', 'p-2'];
    cartButtonDiv.classList.add(...cartButtonDivClasses);
    productImgDiv.appendChild(cartButtonDiv);

    const cartButton = document.createElement("button");
    const cartButtonClasses = ['btn', 'btn-quick-add'];
    cartButton.classList.add(...cartButtonClasses);
    cartButtonDiv.appendChild(cartButton);
    cartButton.innerHTML = '<i class="ri-add-line me-2"></i> Add to Cart';
    cartButton.id = `productList-${product.id}`

    const productCardBody = document.createElement("div");
    const productCardBodyClasses = ['card-body', 'px-0'];
    productCardBody.classList.add(...productCardBodyClasses);
    productCardBody.innerHTML = `<p class="text-decoration-none link-cover">${product.name}</p>
    <small class="text-muted d-block">${product.category}, Size ${product.size}</small>
    <p class="mt-2 mb-0 small">$${product.price}</p>`
    productCard.appendChild(productCardBody);

    productsList.appendChild(productContainer);
}