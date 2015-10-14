angular.module('app', [])
.controller('AddUserController', function($scope) {
    $scope.message = '';
    $scope.addUser = function () {
        // TODO for the reader: actually save user to database...
        console.log($scope.user);
        $scope.message = 'Thanks, ' + $scope.user.first + ', we added you!';
    };
});
