$(document).ready(function() {
        
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
            location.href = 'index.html';
            }
        }


    /*Create item in cart*/
    function newItem(i){
        $('.cart-items .card').append('<div class="item row d-flex justify-content-between align-items-center"></div>')
        var prodImg = '<div class="prod-img col-sm-12 col-md-3"><img src="" class="img-fluid" alt="Responsive image"></div>'
        var prodDesc ='<div class="prod-desc col-sm-12 col-md-3"><h6 class="prod-name"></h6><p class="review"><i class="fa fa-star text-warning"></i></p></div>'
        var prodQty =`<div class="prod-qty d-flex col-sm-12 col-md-3 "><button class="btn minus-btn btn" ><i class="fas fa-minus"></i></button><input id="qty" min="0" name="qty" value="1" type="number" class="form-control" readonly/><button class="btn plus-btn btn"><i class="fas fa-plus"></i></button></div>`
        var ProdPrice =`<div class="prod-price col-sm-12 col-md-2" data-price=""><h6></h6></div>`
        var RemoveProd =`<div class="remove-prod col-sm-12 col-md-1"><a href="#!" class="text-danger remove-btn"><i class="fa-solid fa-trash-can fa-lg"></i></a><button type="button" class="btn btn-danger remove-btn">Remove</button></div>`
        $('.item').eq(i).append(prodImg,prodDesc,prodQty,ProdPrice,RemoveProd);
    }

    /*Create emptyCartPage*/
    function emptyCartPage(){
        let div = $("<div>")
        let p = $("<p>")
        let a = $("<a>")
        let btn = $("<button>")
        let img = $("<img>")
        div.addClass("cart-empty col-lg-12 text-center");
        img.addClass("img-fluid");
        img.attr("src","http://hsnbazar.com/images/empty-cart.png")
        p.text("Go explore for and add some item before checkout!");
        btn.attr("type","button");
        btn.addClass("btn btn-danger")
        btn.text("Return to Shop");
        a.attr("href","index.html");
        a.append(btn);
        div.append(img,p,a)
        $('.cart .row').append(div)       
    }

    /*Create upsales product*/
    function upsalesPage(image,name,price,rating){
        let proddiv = $("<div>")
        let carddiv = $("<div>")
        let cardbodydiv = $("<div>")
        let imgdiv = $("<div>")
        let img = $("<img>")
        let h5 = $("<h5>")
        let h6 = $("<h6>")
        let p = $("<p>")
        let i = $("<i>")
        let btn = $("<button>")

            proddiv.addClass("prod col-sm-12 col-md-6 col-lg-4");
            carddiv.addClass("card");
            imgdiv.addClass("img-wrapper");
            img.addClass("img-fluid");
            img.attr("src",image)
            imgdiv.append(img)
            cardbodydiv.addClass("card-body")
            h5.text(name)
            h6.text("$"+price)
            h6.attr("data-price",price)
            p.addClass("review")
            i.addClass("fa fa-star text-warning")
            p.append(i)
            p.append(rating)
            btn.addClass("btn btn-primary")
            btn.attr("type","button")
            btn.text("Add to cart")
        
        proddiv.append(carddiv);
        carddiv.append(imgdiv,cardbodydiv);
        cardbodydiv.append(h5,h6,p,btn)
        $(".upsales .col-md-12 .row").append(proddiv)
    }


    /*API */
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
      }

      $.ajax(settings).done(function (response) {
        for (let i = 0; i < 3; i++) {
            upsalesPage(response[i].Image,response[i].Name,response[i].Price,response[i].Review);
        }

        /*Add to cart Btn*/
        $(".prod .btn").on("click",function(event){
            var btnClicked = event.currentTarget

            /*Get name, price and review of the upsales prod*/
            let newProdImg = $(btnClicked).closest('.card').find('img').attr('src');
            let newProdName = $(btnClicked).closest('.card').find('h5').text();
            let newProdPrice = $(btnClicked).closest('.card').find('h6').attr('data-price');
            let newProdReview = $(btnClicked).closest('.card').find('p').text();
            /*New Item*/
            function item(image,name,price,review,qty){
                this.image = image;
                this.name = name;
                this.price = price;
                this.review = review;
                this.qty = qty;
            }
            let newItem = new item(newProdImg,newProdName,newProdPrice,newProdReview,1);

            /*Add to cartList in local storage*/
            var found = false
            for (let i = 0; i < cart.length; i++) {
                if(cart[i].name == newProdName){
                    cart[i].qty +=1;
                    $('.item').eq(i).find('#qty').val(cart[i].qty)
        
                    $('.item').eq(i).find('.prod-price h6').text("$"+(cart[i].price*cart[i].qty).toFixed(2))
                    localStorage.setItem("cart",JSON.stringify(cart));
                    found = true;
                    break;
                }
            }
            /*When the new item does not exist in localstorage cartList, push it in.*/
            if (found == false){
            cart.push(newItem);
            localStorage.setItem("cart",JSON.stringify(cart));

            /*Create a row in the cart for the new item*/
            let z = cart.length-1
            $('.cart-items .card').append('<div class="item row d-flex justify-content-between align-items-center"></div>')
            var prodImg = '<div class="prod-img col-sm-12 col-md-3"><img src="" class="img-fluid" alt="Responsive image"></div>'
            var prodDesc ='<div class="prod-desc col-sm-12 col-md-3"><h6 class="prod-name"></h6><p class="review"><i class="fa fa-star text-warning"></i></p></div>'
            var prodQty =`<div class="prod-qty d-flex col-sm-12 col-md-3 "><button class="btn minus-btn btn" ><i class="fas fa-minus"></i></button><input id="qty" min="0" name="qty" value="1" type="number" class="form-control" /><button class="btn plus-btn btn"><i class="fas fa-plus"></i></button></div>`
            var ProdPrice =`<div class="prod-price col-sm-12 col-md-2" data-price=""><h6></h6></div>`
            var RemoveProd =`<div class="remove-prod col-sm-12 col-md-1"><a href="#!" class="text-danger remove-btn"><i class="fa-solid fa-trash-can fa-lg"></i></a><button type="button" class="btn btn-danger remove-btn">Remove</button></div>`
            $('.item').eq(z).append(prodImg,prodDesc,prodQty,ProdPrice,RemoveProd);

            /*Set image,name,review and qty for the new item*/
            $('.item').eq(z).find('.img-fluid').attr('src', cart[z].image)
            $('.item').eq(z).find('.prod-name').text(cart[z].name)
            $('.item').eq(z).find('.review').append(cart[z].review)
            $('.item').eq(z).find('#qty').val(cart[z].qty)       
            $('.item').eq(z).find('.prod-price h6').text("$"+(cart[z].price*cart[z].qty).toFixed(2))
            $('.item').eq(z).find('.prod-price').data("price",cart[z].price)
            }

            /*update the number of item in the card*/
            $(".noOfItem").text(cart.length+ " items")
            
            let newItemPrice = parseFloat($('.item').eq(cart.length-1).find('.prod-price').data("price"))
            console.log(newItemPrice)
            /*Update Subtotal*/
            subtotal += newItemPrice
            $(".subtotal h6").text("$"+subtotal.toFixed(2))

            /*Calculate total amt*/
            totalAmt = subtotal - 219
            $(".totalAmt h5").text("$"+totalAmt.toFixed(2))     
            
            /*Unhide the cart section & hide the empty cart page*/
            $('.cart-items,.summary').show()
            $('.cart-empty').hide()
        });

    });
              
    /*CartList from localstorage*/
    let cart = JSON.parse(localStorage.getItem("cart"));

    /*Display the number of item in the card*/
    $(".noOfItem").text(cart.length+ " items")

    /*Hide if cart is empty */
    if(cart.length == 0)
    {
        emptyCartPage()
        $('.cart-items,.summary').hide()
    }


    /*Create HTML element*/
    for (let i = 0; i < cart.length; i++) {
        newItem(i);
        $('.item').eq(i).find('.img-fluid').attr('src', cart[i].image)
        $('.item').eq(i).find('.prod-name').text(cart[i].name)
        $('.item').eq(i).find('.review').append(cart[i].review)
        $('.item').eq(i).find('#qty').val(cart[i].qty)
        $('.item').eq(i).find('.prod-price h6').text("$"+(cart[i].price*cart[i].qty).toFixed(2))
        $('.item').eq(i).find('.prod-price').data("price",cart[i].price)
        
    }

    /*Summary*/
    let subtotal = 0;
    let totalAmt = 0;
    for (let i = 0; i < cart.length; i++) {
        /*Calculate subtotal*/
        subtotal += cart[i].price * cart[i].qty
    }
    $(".subtotal h6").text("$"+subtotal.toFixed(2))

    /*Calculate total amt*/
    totalAmt = subtotal - 219
    if(totalAmt<219)
    {
        totalAmt = 0
    }
    $(".totalAmt h5").text("$"+totalAmt.toFixed(2))

    /*remove single item from cart*/
    $(".remove-btn").on("click",function(event){
        var btnClicked = event.target
        /*update qty value and calculate new price*/
        var prodName = $(btnClicked).closest('.item').find('.prod-name').text()
        var qty = parseInt($(btnClicked).closest('.item').find('#qty').val())
        var price = parseFloat($(btnClicked).closest('.item').find('.prod-price').data("price"))

        /*Remove item from the row*/
        btnClicked.closest('.item').remove();
            /*Update local storage*/
            for (let i = 0; i < cart.length; i++) {
            if(cart[i].name == prodName){
                cart.splice(i, 1);
                localStorage.setItem("cart",JSON.stringify(cart));
            }
        }

        /*update the number of item in the card*/
        $(".noOfItem").text(cart.length+ " items")

        /*Update Subtotal*/
        subtotal -= price*qty
        $(".subtotal h6").text("$"+subtotal.toFixed(2))

        /*Update total amt*/
        totalAmt = subtotal - 219
        if(totalAmt<219)
        {
            totalAmt = 0
        }
        $(".totalAmt h5").text("$"+totalAmt.toFixed(2))

        /*Hide if cart is empty */
        if(cart.length == 0)
        {
            emptyCartPage()
            $('.cart-items,.summary').hide()
        }
    });


    /*Minus Btn*/
    $(".minus-btn").on("click",function(event){
        var btnClicked = event.currentTarget

        /*update qty value and calculate new price*/
        var prodName = $(btnClicked).closest('.item').find('.prod-name').text()
        var qty = parseInt($(btnClicked).next().val())-1
        var price = parseFloat($(btnClicked).closest('.item').find('.prod-price').data("price"))
        $(btnClicked).next().val(qty)
        $(btnClicked).closest('.item').find('.prod-price h6').text("$"+(qty * price).toFixed(2));

        /*Remove single item from cart when qty = 0*/
        if($(btnClicked).next().val() == 0){
            btnClicked.closest('.item').remove();
            /*Update local storage*/
            for (let i = 0; i < cart.length; i++) {
                if(cart[i].name == prodName){
                    /*Remove this item from local storage cart*/
                    cart.splice(i, 1);
                    localStorage.setItem("cart",JSON.stringify(cart));
                }
            }
        }
        else{
            /*Update local storage*/
            for (let i = 0; i < cart.length; i++) {
                if(cart[i].name == prodName){
                    cart[i].qty = qty;
                    localStorage.setItem("cart",JSON.stringify(cart));
                }
            }
        }

        /*update the number of item in the card*/
        $(".noOfItem").text(cart.length+ " items")

        /*Update Subtotal*/
        subtotal -= price
        $(".subtotal h6").text("$"+Math.abs(subtotal).toFixed(2))

        /*Update total amt*/
        totalAmt = subtotal - 219
        if(totalAmt<219)
        {
            totalAmt = 0
        }
        $(".totalAmt h5").text("$"+totalAmt.toFixed(2))
        
        /*Hide if cart is empty */
        if(cart.length == 0)
        {
            emptyCartPage()
            $('.cart-items,.summary').hide()
        }
    });


    /*Plus Btn*/
    $(".plus-btn").on("click",function(event){
        var btnClicked = event.currentTarget
        /*update qty value and calculate new price*/
        var prodName = $(btnClicked).closest('.item').find('.prod-name').text()
        var qty = parseInt($(btnClicked).prev().val())+1
        var price = parseFloat($(btnClicked).closest('.item').find('.prod-price').data("price"))
        $(btnClicked).prev().val(qty)
        $(btnClicked).closest('.item').find('.prod-price h6').text("$"+(qty * price).toFixed(2));

        for (let i = 0; i < cart.length; i++) {
            if(cart[i].name == prodName){
                cart[i].qty = qty;
            /*Update local storage*/
                localStorage.setItem("cart",JSON.stringify(cart));
            }
        }

        /*Update SSubtotal*/
        subtotal += price
        $(".subtotal h6").text("$"+subtotal.toFixed(2))

        /*Calculate total amt*/
        totalAmt = subtotal - 219
        $(".totalAmt h5").text("$"+totalAmt.toFixed(2))
    });


 
});

/*Send user to checkout page*/
$(".ckOutBtn").on("click",function(event){
    $(location).prop('href', 'checkout.html');
  });

let newcart = JSON.parse(localStorage.getItem("cart"));
console.log(newcart);