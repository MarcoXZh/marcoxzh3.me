/**
 * Initializations
 */
$(document).ready(function() {
  // Change activa nav-item to the current page
  var li = $('a.nav-link[href="' + window.location.pathname + '"]').parent();
  li.addClass('active');
  li.siblings().removeClass('active');


  return ;
  // Enable tech stack dropup
  $('#dropup').click(function() {
    if($('.dropdown-menu').hasClass('show')) {
      $('.dropdown-menu').removeClass('show')
    } else {
      $('.dropdown-menu').addClass('show')
    } // if($('#dropdown-menu').hasClass('show'))
  }); // $('#dropup').click(function() { ... });


}); // $(document).ready(function() { ... };
