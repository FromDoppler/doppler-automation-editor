(function() {
  'use strict';

  angular
    .module('dopplerApp.lists')
    .controller('subscribersMassiveAddCtrl', subscribersMassiveAddCtrl);

  subscribersMassiveAddCtrl.$inject = [
    '$scope',
    '$translate',
    'addMassiveSubscribersService'
  ];

  function subscribersMassiveAddCtrl($scope, $translate, addMassiveSubscribersService) {
    $scope.status = Model.Status; //eslint-disable-line no-undef
    $scope.origin = Model.Origin; //eslint-disable-line no-undef
    $scope.score = Model.Score; //eslint-disable-line no-undef
    $scope.subscribersCount = Model.SubscribersCount; //eslint-disable-line no-undef
    $scope.subscribersStandBy = Model.SubscribersStandBy; //eslint-disable-line no-undef
    $scope.oneSubscriber = Model.SubscribersCount === 1 ? '_singular' : ''; //eslint-disable-line no-undef
    $scope.oneSubscriberStandBy = Model.SubscribersStandBy === 1 ? '_singular' : ''; //eslint-disable-line no-undef
    $scope.canCreate = Model.CanCreate; //eslint-disable-line no-undef
    $scope.searchText = Model.SearchText; //eslint-disable-line no-undef
    $scope.listName = '';
    $scope.duplicatedListNameMessage = false;
    $scope.characterLimitMessage = false;
    $scope.isLoading = true;

    $translate.onReady().then(function() {
      $scope.isLoading = false;
    });

    $scope.goBack = function() {
      window.location = '/Lists/MasterSubscriber';
    };

    $scope.goToMainLists = function() {
      window.location = '/Lists/SubscribersList';
    };

    $scope.createNewList = function() {
      if ($scope.listName.length > 100) {
        $scope.characterLimitMessage = true;
      } else {
        var data = {
          'filters': {
            'searchText': Model.SearchText, //eslint-disable-line no-undef
            'status': Model.Status, //eslint-disable-line no-undef
            'origin': Model.Origin, //eslint-disable-line no-undef
            'score': Model.Score //eslint-disable-line no-undef
          },
          'listName': this.listName,
          'subscribersCount': Model.SubscribersCount, //eslint-disable-line no-undef
          'subscribersStandBy': Model.SubscribersStandBy, //eslint-disable-line no-undef
          'canCreate': Model.CanCreate //eslint-disable-line no-undef
        };
        $scope.isLoading = true;
        addMassiveSubscribersService.createNewList(data)
          .then(function(response) {
            if (response.success) {
              $scope.goToMainLists();
            } else {
              if (response.errorCode === 24) {
                $scope.duplicatedListNameMessage = true;
              }
              $scope.isLoading = false;
            }
          })
          .catch(function(err) {
            if (err.data.Message === 'ListNameAlreadyExists') {
              $scope.duplicatedListNameMessage = true;
            }
            $scope.isLoading = false;
          });
      }
    };

    $scope.deleteErrorMessage = function() {
      $scope.duplicatedListNameMessage = false;
      $scope.characterLimitMessage = false;
    };

    $scope.openPopup = function() {
      $('.user-plan--type a')[0].click(); //eslint-disable-line no-undef
    };
  }
})();
