/**
 * Initializations
 */
$(document).ready(function() {
  // Change activa nav-item to the current page
  var li = $('a.nav-link[href="' + window.location.pathname + '"]').parent();
  li.addClass('active');
  li.siblings().removeClass('active');

}); // $(document).ready(function() { ... };
