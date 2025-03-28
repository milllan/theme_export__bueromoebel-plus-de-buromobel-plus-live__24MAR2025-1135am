function applyScript(event) {
  //Check the class and update accordingly -- for line no. 3
  var thumbnailImages = document.querySelectorAll('.product-gallery__thumbnail-list-wrapper page-dots img'); 
  var boldValue = event.target.value.toLowerCase();
  thumbnailImages.forEach(function(image) {
    var imgValue = image.getAttribute('alt').toLowerCase();
    // console.log("imgValue",imgValue , "boldValue", boldValue)
    if (boldValue === imgValue) {
      image.parentElement.click();
    }
  });
}

function observeDOM() {
  var observer = new MutationObserver(function(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.target.classList.contains('bold_options_loaded')) {
      var radioInputs = document.querySelectorAll('.bold_option.bold_option_radio .bold_option_value_element input');
      var swatchInputs = document.querySelectorAll('.bold_option.bold_option_swatch .bold_option_value_element input');
   
      radioInputs.forEach(function(input) {
        input.addEventListener('change', applyScript);
      });
         
      swatchInputs.forEach(function(input) {
        input.addEventListener('change', applyScript);
      });
      observer.disconnect();
      break;
    }
  }
  });
  observer.observe(document.body, {
  childList: true,
  subtree: true
  });
}
document.addEventListener('DOMContentLoaded', function() {
  observeDOM();
  setTimeout(async() => {
    var vendor = "{{ product.vendor }}"; // Get the vendor name from the product page
    if (vendor == "Aeris") {
        var element = document.getElementById("discount-bar-container");
        if (element) {
            element.style.display = "none"; // Hide the element
        }
    }
  }, 2000);
});