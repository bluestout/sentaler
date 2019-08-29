//Wishlist Area
function wishlist_init(){       
  if(localStorage.getItem('cs-wishlist') == null || localStorage.getItem('cs-wishlist') == '[]' ){
    $('.navUser-item--wishlist .wishlist-quantity').html('');
    $('#wishlistcontent .none').css( 'display', 'block' );
    $('#wishlistcontent .wishlist-count').css( 'display', 'none' );
    $('#wishlistcontent ul').css( 'display', 'none' );
  }
  else{
    var activeID = [];
    activeID = JSON.parse(localStorage.getItem('cs-wishlist'));
    if(activeID.length == 0){
      $('.navUser-item--wishlist .wishlist-quantity').html('');
    } else{
      $('.navUser-item--wishlist .wishlist-quantity').html('('+activeID.length+')');
    }
    for(i=0; i<activeID.length; i++ ){
      var classadded = '.wishlist-'+activeID[i];   
      var classaddedi = '.wishlist-'+activeID[i] +' i';   
      $(classadded).addClass("wishlist-added").removeClass("wishlist").attr("title","Added to Wishlist");
      $(classadded).attr("href", "/pages/wish-list");
      $(classaddedi).addClass("fa-heart").removeClass("fa-heart-o");
      $(".wltt").html("Added to Wishlist");
    }
  }
}

function wishlist_add(){
  $( "a.wishlist" ).on( "click", function(e) {
    if(!$(this).hasClass('wishlist-added')){
      e.preventDefault();                        
	  $('#quick-shop-modal').modal('hide');
      //store product ID      
      var storeID = [];        
      if(localStorage.getItem('cs-wishlist') == null )
        storeID = [];
      else
        storeID = JSON.parse(localStorage.getItem('cs-wishlist'));
      storeID.push($(this).data("wishlisthandle"));        
      localStorage.setItem('cs-wishlist', JSON.stringify(storeID));        

      //add class and update count
      $('.navUser-item--wishlist .wishlist-quantity').html('('+storeID.length+')');
      $('.wishlist-'+$(this).data("wishlisthandle")).addClass("wishlist-added").removeClass("wishlist").attr("title","Added to Wishlist"); 
      $('.wishlist-'+$(this).data("wishlisthandle")).attr("href", "/pages/wish-list");
      $('.wishlist-'+$(this).data("wishlisthandle") + ' i').addClass("fa-heart").removeClass("fa-heart-o");
      
      var url="/products/"+$(this).data("wishlisthandle")+".js";
      var content = '#modalwishlist1';
      jQuery.getJSON(url, function(product) {
        $("#modalwishlist1").find('.wishlist-image').attr('class','wishlist-image wishlist-image-'+product.id);
        $("#modalwishlist1").find('.wishlist-image').html('<img src="'+product.featured_image+'" alt="'+product.title+'" />');
        $("#modalwishlist1").find('.wishlist-name').html('<a href="'+product.url+'">'+product.title+'</a>'); 
        $("#modalwishlist1").find('.wishlist-price').attr('class','wishlist-price wishlist-price-'+product.id);
        $("#modalwishlist1").find('.variants-form').attr('id','wishlist-form-cart-'+product.id);
        $("#modalwishlist1").find('.add-to-cart').attr('id','wishlist-addToCart-'+product.id);
        $("#modalwishlist1").find('.variants-wrapper').attr('id','wishlist-variants-container-'+product.id);
        
        addToVariantsWishlist(product);
      });
      $(".wltt").html("Added to Wishlist");
      //Modal
      $('#modalwishlist1').modal();
    }     
  });
}  

function wishlist_check(){    
  $( ".wishlist-class" ).on( "click", function(e) {
    if(localStorage.getItem('cs-wishlist') == null ){
      $('#modalwishlist0').modal();        
      e.preventDefault();
    }
  });
}

function wishlist_show(){    
  var cont = '#wishlistcontent ul',
      productjson = '/products.js',
      getID= [];
  if(localStorage.getItem('cs-wishlist') != null ){
    getID = JSON.parse(localStorage.getItem('cs-wishlist'));
    $('.wishlist-page .wishlist-count').html(getID.length+' Saved products');
    for(j=0; j<getID.length; j++){
      var url = "/products/"+getID[j]+".js";
      
      jQuery.getJSON(url, function(product) {
        var wcn = ".wishlist-"+product.handle;              
        $(cont).append('<li class="wlr wishlist-'+product.handle+'"><div class="wishlist-image-'+product.id+'"></div><div class="wishlist-name"></div><div class="wishlist-price-'+product.id+'"></div><div class="wishlist-addCart"></div><div class="wishlist-remove" data-wishlisthandle="'+product.handle+'"><i class="fa fa-times-circle-o" aria-hidden="true"></i></div></li>');                    
        $(wcn).find('.wishlist-image-'+product.id).append('<img src="'+product.featured_image+'" alt="" />');
        $(wcn).find('.wishlist-name').append('<a href="'+product.url+'">'+product.title+'</a>');
        
        $(wcn).find('.wishlist-addCart').append('<form action="/cart/add" method="post" class="variants" id="wishlist-form-cart-'+product.id+'" enctype="multipart/form-data"><div id="wishlist-variants-container-'+product.id+'" class="variants-wrapper"></div> <div class="quantity-content"><label>QTY</label><input type="text" size="5" class="item-quantity item-quantity-qs" name="quantity" value="1" /></div><div class="others-bottom"><a id="wishlist-addToCart-'+product.id+'" class="btn btn-quick-shop add-to-cart">Add to cart</a><div class="wishlist-remove" data-wishlisthandle="'+product.handle+'"><span class="lnr lnr-trash"></span></div></div></form>');  
                            
        addToVariantsWishlist(product);
        
        $(GLOBAL['common']['init']);
        
        $(wcn).find('.wishlist-remove').on("click", function(){ 
          $(wcn).hide("fade");
          var storeID2= [],
              ri = $(this).data("wishlisthandle");            
          storeID2 = JSON.parse(localStorage.getItem('cs-wishlist'));            
          storeID2 = jQuery.grep(storeID2, function(value) {
            return value != ri;
          });
          localStorage.setItem('cs-wishlist', JSON.stringify(storeID2));
          if(storeID2.length == 0){
            $('.navUser-item--wishlist .wishlist-quantity').html('');
            $('#wishlistcontent .none').css( 'display', 'block' );
            $('#wishlistcontent .wishlist-count').css( 'display', 'none' );
            $('#wishlistcontent ul').css( 'display', 'none' );
          } else{
            $('.navUser-item--wishlist .wishlist-quantity').html('('+storeID2.length+')');
          }
          $('.wishlist-page .wishlist-count').html(storeID2.length+' Saved products');
        });
        $(wcn).find('.wishlist-detail').append('<a href="'+product.url+'">View More</a>');
        
      });
      
    }
  }
  else{
    $('.wishlist-0').hide();
    $('#wishlistcontent .none').show();
  }
  
}

function addToVariantsWishlist(product){
  var selectedProduct = product;
  
  var selectedProductID = selectedProduct.id;
  var productVariants = selectedProduct.variants;
  var quickShopVariantsContainer = $('#wishlist-variants-container-'+selectedProductID);
  var quickShopAddButton = $('#wishlist-addToCart-'+selectedProductID);
  var quickShopAddToCartButton = $('#wishlist-addToCart-'+selectedProductID); 
  quickShopVariantsContainer.html('');
  var productVariantsCount = product.variants.length;
  var quickShopPriceContainer = $('.wishlist-price-'+selectedProductID);
  if (productVariantsCount > 1) {  
        // Reveal variants container
        quickShopVariantsContainer.show();
          
        // Build variants element
        var quickShopVariantElement = $('<select>',{ 'id': ('wishlist-variants-' + selectedProductID) , 'name': 'id'});
        var quickShopVariantOptions = '';
        for (var i=0; i < productVariantsCount; i++) {
          quickShopVariantOptions += '<option value="'+ productVariants[i].id +'">'+ productVariants[i].title +'</option>'
        };
        
        // Add variants element to page
        quickShopVariantElement.append(quickShopVariantOptions);
        quickShopVariantsContainer.append(quickShopVariantElement);
          
        // Bind variants to OptionSelect JS
    
        new Shopify.OptionSelectors(('wishlist-variants-' + selectedProductID), { product: selectedProduct, onVariantSelected: selectOptionCallbackWishlist });
        
        for( var i=0; i < selectedProduct.options.length ; i++ ){
          $('#wishlist-variants-'+selectedProductID+'-option-'+i).parent().find('label').html(selectedProduct.options[i].name);
        }  
        // Add label if only one product option and it isn't 'Title'.
        if (selectedProduct.options.length == 1 && selectedProduct.options[0] != 'Title' ){
          $('#wishlist-variants-container-'+selectedProductID+' .selector-wrapper:eq(0)').prepend('<label>'+ selectedProduct.options[0].name +'</label>');
        }
      }
  else { // If product only has a single variant    
        // Hide unnecessary variants container
        quickShopVariantsContainer.hide();  
        // Build variants element
        var quickShopVariantElement = $('<select>',{ 'id': ('wishlist-variants-' + selectedProductID) , 'name': 'id'});
        var quickShopVariantOptions = '';
          
        for (var i=0; i < productVariantsCount; i++) {
          quickShopVariantOptions += '<option value="'+ productVariants[i].id +'">'+ productVariants[i].title +'</option>'
        };
        quickShopVariantElement.append(quickShopVariantOptions);
        quickShopVariantsContainer.append(quickShopVariantElement);  
        quickShopAddToCartButton.removeAttr('disabled').fadeTo(200,1);
        quickShopAddToCartButton.data('variant-id', productVariants[0].id);
        if (selectedProduct && selectedProduct.available) {
          if ( productVariants[0].compare_at_price > 0 && productVariants[0].compare_at_price > productVariants[0].price ) {
            quickShopPriceContainer.html('<span class="price">'+ Shopify.formatMoney(productVariants[0].price, quickShop_money_format) +'</span>'+'<del class="price_compare">'+ Shopify.formatMoney(productVariants[0].compare_at_price, quickShop_money_format) + '</del>' );
          } else {
            quickShopPriceContainer.html('<span class="price">'+ Shopify.formatMoney(productVariants[0].price, quickShop_money_format) + '</span>' );
          }  
        }
        else {
		  quickShopAddToCartButton.attr('disabled', 'disabled').fadeTo(200,0.5);
          var message = selectedProduct ? "Sold Out" : "Unavailable";    
          quickShopPriceContainer.html('<span class="unavailable">' + message + '</span>');
        }
      } // END of (productVariantsCount > 1)
  
  // Update currency
  currenciesCallbackSpecial($('.wishlist-price-'+selectedProductID+' span.money'));
  
}
/* selectOptionCallback
    ===================================== */
var selectOptionCallbackWishlist = function(variant, selector) {
  var quickShopAddButton = $('#wishlist-addToCart-'+selector.product.id);
  var quickShopAddToCartButton = $('#wishlist-addToCart-'+selector.product.id); 
  
  var quickShopPriceContainer = $('.wishlist-price-'+selector.product.id);
  //change image
  if (variant && variant.featured_image) {
    var newImage = variant.featured_image; // New image object.
    $('.wishlist-image-'+variant.featured_image.product_id+' img').attr('src',newImage.src);
  }

  //change
  if (variant && variant.available) {
    quickShopAddToCartButton.data('variant-id', variant.id);
    quickShopAddToCartButton.removeAttr('disabled').fadeTo(200,1);        
    // determine if variant is on sale
    if ( variant.compare_at_price > 0 && variant.compare_at_price > variant.price ) {
      quickShopPriceContainer.html('<span class="price">'+ Shopify.formatMoney(variant.price, quickShop_money_format) +'</span>' + '<del class="price_compare">'+ Shopify.formatMoney(variant.compare_at_price, quickShop_money_format) + '</del>');
    } else {
      quickShopPriceContainer.html('<span class="price">'+ Shopify.formatMoney(variant.price, quickShop_money_format) + '</span>' );
    };     
    // selected an invalid or out of stock variant 
  } else {
    // variant doesn't exist
    quickShopAddToCartButton.attr('disabled', 'disabled').fadeTo(200,0.5);
    var message = variant ? "Sold Out" : "Unavailable";    
    quickShopPriceContainer.html('<span class="unavailable">' + message + '</span>');         
  }
  //swatch
  var form = jQuery('.quick-shop form.variants');
  if(variant!=null){
    for (var i=0,length=variant.options.length; i<length; i++) {
      var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
      if (radioButton.size()) {
        radioButton.get(0).checked = true;
      }
    }
  }

  
  // Update currency
  currenciesCallbackSpecial(quickShopPriceContainer.find('span.money'));
  
} 
$(window).ready(function($) {
  //LocalStore
  wishlist_init();
  wishlist_check();
  wishlist_add();
  if(wishlistpage == 1) wishlist_show();
});