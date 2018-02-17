/**
 * Show the Google Maps based on the current location
*/
function initialize() {
  // Show map of the author's location
  var address = 'Edmonton, Canada';
  new google.maps.Geocoder().geocode({ address:address },function(add, status) {
    if (status !== google.maps.GeocoderStatus.OK) {
      $('#map').text('Unable to locate<code=' + status + '>: ' + address);
      return;
    } // if (status !== google.maps.GeocoderStatus.OK)
    var map = new google.maps.Map(document.getElementById('map'), {
                                    center:     add[0].geometry.location,
                                    zoom:       10,
                                    mapTypeId:  google.maps.MapTypeId.ROADMAP
    }); // var map = new google.maps.Map( ... );
    var marker = new google.maps.Marker({ position:add[0].geometry.location,
                                          map:map });
    new google.maps.InfoWindow({ content:$('title').text() }).open(map, marker);
  }); // new google.maps.Geocoder().geocode( ... );
} // function initialize()


/**
 * Get user's location
 * @param {*} callback 
 */
var getUsesLocation = function(callback) {
    // Check user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        new google.maps.Geocoder().geocode(
          { 'location':{ lat:pos.coords.latitude, lng:pos.coords.longitude }},
          function(re, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
              if (callback) {
                callback(status);
              } // if (callback)
              return ;
            } // if (status !== google.maps.GeocoderStatus.OK)
            var city = '';
            var country = '';
            re.forEach(function(e) {
              if (e.types.includes('locality')) {
                city = e.address_components[0].long_name;
              } else if (e.types.includes('country')) {
                country = e.address_components[0].long_name;
              } // if - else if
            }); // re.forEach(function(e) { ... });
            if (callback) {
              callback(null, city + ', ' + country);
            } // if (callback)
        }); // new google.maps.Geocoder().geocode( ... );
      }, function(err) {
        if (callback) {
          callback(err);
        } // if (callback)
      }, { enableHighAccuracy:true, timeout:5000, maximumAge:0 });
    } // if (navigator.geolocation)
}; // var getUsesLocation = function(callback) {


/**
 * Initialize the angular module
 */
angular.module('contact_app', [])
       .controller('contact_ctrl', function($scope, $http) {

    // Initialization
    $scope.location_ph = 'Your Location';
    getUsesLocation(function(err, position) {
      $scope.$apply(function() {
        if (err) {
          $scope.location_ph = err;
        } // if (err) 
        $scope.location = err ? '' : position;
      }); // getUsesLocation(function(position) { ... });
    }); // getUsesLocation(function(position) { ... });
    $('#status').on('show.bs.modal', function () {
      setTimeout(function(){ $('#status').modal('hide'); }, 1000);
    }); // $('#status').on('show.bs.modal', function () { ... });


    /**
     * Reset form
     */
    $scope.reset_form = function() {
      $scope.name = '';
      $scope.email = '';
      $scope.subject = '';
      $scope.location = '';
      $scope.message = '';
    }; // $scope.reset_form = function() { ... };


    /**
     * Submit form
     */
    $scope.submit_form = function() {
      $('#submit').attr('data-target', '');
      // Verify inputs
      if (!$scope.name) {
        $('#name').focus();
        return ;
      } // if (!$scope.name) { ... });
      if (!$scope.email) {
        $('#email').focus();
        return ;
      } // if (!$scope.email) { ... });
      if (!$scope.message) {
        $('#message').focus();
        return ;
      } // if (!$scope.message) { ... });

      // Process data
      $('#submit').attr('data-target', '#status');
      $http.post(window.location.pathname, {
        name:     $scope.name.trim(),
        created:  new Date(),
        email:    $scope.email.trim(),
        subject:  $scope.subject.trim(),
        location:  $scope.location.trim(),
        message:  $scope.message.trim()
      }).then(function(res) {
        $scope.response = res.data.post_status;
        $('#dialog').removeClass('text-light');
        $('#dialog').removeClass('bg-danger');
        $('#dialog').addClass('text-info');
        $('#dialog').addClass('bg-light');
      }, function(res) {
        $scope.response = res.data.post_status;
        $('#dialog').removeClass('text-info');
        $('#dialog').removeClass('bg-light');
        $('#dialog').addClass('text-light');
        $('#dialog').addClass('bg-danger');
      }); // $http.post() ... ).then( ... );
    }; // $scope.submit_form = function() { ... };

}); // angular.module('contact_app', []).controller('contact_ctrl',  ... );
