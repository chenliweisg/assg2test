$(document).ready(function() {

        let login = document.getElementById("login");
        //display logout when user login
        if (JSON.parse(sessionStorage.getItem("member")) != null){
          login.innerHTML = `<i class="fa-solid fa-right-to-bracket mr-2"></i>Logout`;
        }

        //display login when user logout
        login.onclick = function(e){
          if (login.innerHTML === `<i class="fa-solid fa-right-to-bracket mr-2"></i>Logout`){
            e.preventDefault();
            sessionStorage.removeItem("member");
            location.href = 'index.html';
            }
    };
    
    });

const searchInput = document.getElementById("search-bar");
let products = [];
let phones = [];
let accessories = [];
let hiddenitemslist = [];

//get product info
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://accountdetails-3613.restdb.io/rest/products",
    "method": "GET",
    "headers": {
      "content-type": "application/json",
      "x-apikey": "63df19783bc6b255ed0c4685",
      "cache-control": "no-cache"
    }
  };
  
  $.ajax(settings).then(function (response) {
    console.log(response);

    //loading product into html
    for (i=0; i<response.length; i++){
      let root = document.getElementById("products");
      let container = document.createElement("div");
      let namediv = document.createElement("div");
      let pricediv = document.createElement("div");
      let reviewdiv = document.createElement("p");
      let imagediv = document.createElement("img");
      let containImg = document.createElement("div");/*Liwei */
      
      let pname = response[i].Name;
      let pprice = response[i].Price;
      let preview = response[i].Review;

      imagediv.setAttribute("src", response[i].Image);
      namediv.textContent = pname;
      pricediv.textContent = "$" + pprice;
      reviewdiv.innerHTML = `<i class="fa fa-star text-warning"></i>` + preview;

      namediv.classList.add("name");
      pricediv.classList.add("price");
      pricediv.setAttribute("data-price",pprice);
      reviewdiv.classList.add("review");
      imagediv.classList.add("image");
      containImg.append(imagediv); /*Liwei */
      console.log(containImg); /*Liwei */
      container.appendChild(containImg); /*Liwei */
      container.appendChild(namediv);
      container.appendChild(pricediv);
      container.appendChild(reviewdiv);

      container.id = response[i]._id;
      container.classList.add("products-container");
      root.appendChild(container);

      //storing the products
      const item = {name: pname.toLowerCase(), price: pprice, id: response[i]._id, brand: response[i].Brand, type: response[i].ProductType, display: true, review: response[i].Review};
      products.push(item);

      if (response[i].ProductType === "Phone"){
        const productObject = {name: pname.toLowerCase(), price: pprice, id: response[i]._id, brand: response[i].Brand};
        phones.push(productObject);
      }
      else {
        const productObject = {name: pname.toLowerCase(), price: pprice, id: response[i]._id, brand: response[i].Brand};
        accessories.push(productObject);
      }
    }

    if (optionPhone.className === "list-selected"){
      products.forEach(product => {
        const productdiv = document.getElementById(product.id);
        if (product.type != "Phone"){
          productdiv.style.display = "none";
          product.display = false;
        }
        else if (product.type === "Phone"){
          productdiv.style.display = "block";
        }
      });
    }
    
    /*Liwei*/
    $("#products").addClass("row");
    $("#products").children().addClass("col-md-4");
    let btn = $("<button>");
    btn.addClass("addCart btn btn-primary btn-lg btn-block");
    btn.attr("type","button");
    btn.text("Add to cart");
    $("#products").children().append(btn);
    $(".image").addClass("img-fluid");
    $(".image").parent().addClass("imgContainer");


    /*Add to cart button*/
    $(".addCart").on("click",function(event){

      let addCartBtn = event.target;
      let cardDiv = $(addCartBtn).parent();
      /*Get the img, name, price and rating from the product card*/
      let img = cardDiv.find("img").attr("src");
      let name = cardDiv.find(".name").text();
      let price = cardDiv.find(".price").data("price");
      let rating = cardDiv.find(".review").text();
      console.log(img,name,price,rating);

      /*CartList from localstorage*/
      let cart = JSON.parse(localStorage.getItem("cart"));

      /*When CartList from localstorage is null, give cart an empty array*/
      if(JSON.parse(localStorage.getItem("cart"))==null)
      {
        cart = [];
      }

      /*new Item object function*/
      function item(image,name,price,review,qty){
          this.image = image;
          this.name = name;
          this.price = price;
          this.review = review;
          this.qty = qty;
      }

      /*Create new item with the data from API*/
      let newItem = new item(img,name,price,rating,1);
      
      /*Loop through the cart to see if the current item already existed in cart*/
      var found = false;
      for (let i = 0; i < cart.length; i++) {
        if(cart[i].name == name){
          cart[i].qty +=1;
          /*Update the new qty of the item in localstorage*/
          localStorage.setItem("cart",JSON.stringify(cart));
          found = true;
          break;
        }
      }
      
      /*When the item does not exist in the cart, push it to localstorage*/
      if (found == false){
        cart.push(newItem);
        localStorage.setItem("cart",JSON.stringify(cart));
      }

      /*Alert user item is added*/
      alert("ITEM ADDED TO CART")
      
    });

});

//search filters
let optionPhone = document.getElementById("filterPhones");
let optionAccessories = document.getElementById("filterAccessories");

let pricerange = document.getElementById("pricerange");
let hundredto3 = document.getElementById("100to300"); 
let threehundredto5 = document.getElementById("300to500");
let fivehundredto7 = document.getElementById("500to700");
let sevenhundredto9 = document.getElementById("700to900");
let morethan900 = document.getElementById("more900");

let allbrands = document.getElementById("allbrands");
let apple = document.getElementById("apple");
let xiaomi = document.getElementById("xiaomi");
let google = document.getElementById("google");
let others = document.getElementById("others");

let reviews = document.getElementById("reviews");
let threestars = document.getElementById("3stars");
let fourstars = document.getElementById("4stars");
let fivestars = document.getElementById("5stars");

const dropdowns = document.querySelectorAll(".select-filter");
dropdowns.forEach(dropdown =>{
  const select = dropdown.querySelector(".select");
  const caret = dropdown.querySelector(".caret");
  const menu = dropdown.querySelector(".menu");
  const options = dropdown.querySelectorAll(".menu li");
  const selected = dropdown.querySelector(".selected");

  //add event listener for the filters
  select.addEventListener("click", () =>{
    select.classList.toggle("select-clicked");
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
  });

  //add event listener for the options
  options.forEach(option =>{
    option.addEventListener("click", () =>{
      selected.innerText = option.innerText;
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");

      options.forEach(option => {
        option.className = "";
      });
      option.className = "list-selected";

      //phones
      if (optionPhone.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.type != "Phone"){
            productdiv.style.display = "none";
            product.display = false;
          }
          else {
            productdiv.style.display = "block";
            product.display = true;
          }
        });
      }
      //accessories
      else if (optionAccessories.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.type != "Accessories"){
            productdiv.style.display = "none";
            product.display = false;
          }
          else {
            productdiv.style.display = "block";
            product.display = true;
          }
        });
      }

      //price range
      if (pricerange.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            productdiv.style.display = "block";
            product.display = true;
          }
        });
      }
      //100 to 300 dollars
      else if (hundredto3.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.price > 100 && product.price <= 300){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //300 to 500 dollars
      else if (threehundredto5.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.price > 300 && product.price <= 500){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //500 to 700 dollars
      else if (fivehundredto7.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.price > 500 && product.price <= 700){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //700 to 900 dollars
      else if (sevenhundredto9.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.price > 700 && product.price <= 900){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //more than 900 dollars
      else if (morethan900.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.price > 900){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }

      //all brands
      if (allbrands.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            productdiv.style.display = "block";
            product.display = true;
          }
        });
      }
      //apple
      else if (apple.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.brand === "Apple"){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //xiaomi
      else if (xiaomi.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.brand === "Xiaomi"){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //google
      else if (google.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.brand === "Google"){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //others
      else if (others.className === "list-selected"){
        products.forEach(product => {
          const brand = product.brand;
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (brand != "Apple" && brand != "Xiaomi" && brand != "Google"){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }

      //review
      if (reviews.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            productdiv.style.display = "block";
            product.display = true;
          }
        });
      }
      //3 stars
      else if (threestars.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.review >= 3 && product.review < 4){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //4 stars
      else if (fourstars.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.review >= 4 && product.review < 5){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }
      //5 stars
      else if (fivestars.className === "list-selected"){
        products.forEach(product => {
          const productdiv = document.getElementById(product.id);
          if (product.display === true){
            if (product.review === 5){
              productdiv.style.display = "block";
              product.display = true;
            }
            else {
              productdiv.style.display = "none";
              product.display = false;
            }
          }
        });
      }

    });
  });
});

//search bar
searchInput.addEventListener("input", (e) => {
  const input = e.target.value.toLowerCase();
  products.forEach(product => {
    const productdiv = document.getElementById(product.id);
    if (product.display === true){
      if (product.name.includes(input)){
        productdiv.style.display = "block";
        product.display = true;
      }
      else {
        productdiv.style.display = "none";
        product.display = false;
        const hiddenitems = {id: product.id};
        hiddenitemslist.push(hiddenitems);
      }
    }
    else if (input.length === 0){
      hiddenitemslist.forEach(item => {
        const productdiv = document.getElementById(item.id);
        productdiv.style.display = "block";
        products.forEach(product => {
          if (product.id === item.id){
            product.display = true;
          }
        });
      });
    }
  });
});
