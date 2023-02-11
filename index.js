$(document).ready(function() {
  /**Load Nav bar and footer into the webpage*/
    
    let login = document.getElementById("login");
    // display logout when user login
    if (JSON.parse(sessionStorage.getItem("member")) != null){
      login.innerHTML = `<i class="fa-solid fa-right-to-bracket mr-2"></i>Logout`;
    }

    //display login when user logout
    login.onclick = function(e){
      if (login.innerHTML === `<i class="fa-solid fa-right-to-bracket mr-2"></i>Logout`){
        e.preventDefault();
        sessionStorage.removeItem("member");
        console.log("babi");
        location.href = 'index.html';
      }
    };


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

$.ajax(settings).done(function (response) {
    console.log(response);

    for (let i = 0; i < 3; i++) {
        console.log(i);

        /*Create Product card*/
        let prodName = $("<h5>");
        prodName.addClass("product-name");
        let prodPrice = $("<h5>");
        prodPrice.addClass("product-price");
        let review = $("<p>");
        review.addClass("review");
        let starIcon = $("<i>");
        starIcon.addClass("fa fa-star text-warning");
        let button = $("<button>");
        button.addClass("add-cart btn btn-primary btn-lg");
        button.attr("type","button");
        let cardbody = $("<div>");
        cardbody.addClass("card-body");
        let prodImg = $("<img>");
        prodImg.attr("src",response[i].Image);
        prodImg.addClass("card-img-top");
        let card = $("<div>");
        card.addClass("card col-md-4 text-black text-center");
        prodName.append(response[i].Name);
        prodPrice.append(response[i].Price);
        review.append(starIcon);
        review.data("rating",response[i].Review);
        review.append(response[i].Review);
        button.text("Add to cart");
        cardbody.append(prodName,prodPrice,review,button);
        card.append(prodImg,cardbody);
        $(".product .row").append(card);
      }

      /*Add to cart button*/
      $(".add-cart").on("click",function(event){
        var btnClicked = event.target;
        
        /*Get the img, name, price and rating of the product.*/
        var img = $(btnClicked).parent().siblings('.card-img-top').attr("src");
        var name = $(btnClicked).siblings('.product-name').text();
        var price = $(btnClicked).siblings('.product-price').text();
        var rating = $(btnClicked).siblings('.review').data("rating");

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
        
        /*Alert user item is added to cart*/
        alert("Item has been added to the cart!")

      });

  });
});


/*when the Category is clicked direct to product page*/
$(".category .phone h3").on("click",function(event){
  $(location).prop('href', 'shop.html');
});

$(".category .accs h3").on("click",function(event){
  $(location).prop('href', 'shop.html');
});

/*When user clicked "Start to shop"*/
$(".startToshop").on("click",function(event){
  $(location).prop('href', 'shop.html');
});
