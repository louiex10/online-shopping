fetch('https://valenciashopping.store/api/products').then((data)=> {
  return data.json();
})
.then ((completedata) => {
  let products="";
  completedata.map((values)=>{
    products+=` <div class="listing">
         <h1 class="name">${values.name}</h1>
         <img src=${values.image_url} class="images">
          <p>${values.description}</p>
          <p class="category">${values.category}</p>
          <p class="price">${values.price}</p>
        </div>`;
      });
      document.getElementById("listings").innerHTML=products;

}).catch((err)=>{
 console.log(err);
})
