angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('expandedMarket', {
    url: '/page1',
    templateUrl: 'templates/expandedMarket.html',
    controller: 'expandedMarketCtrl'
  })

  .state('keyCompanyMetrics', {
    url: '/page2',
    templateUrl: 'templates/keyCompanyMetrics.html',
    controller: 'keyCompanyMetricsCtrl'
  })

$urlRouterProvider.otherwise('/page1')


});