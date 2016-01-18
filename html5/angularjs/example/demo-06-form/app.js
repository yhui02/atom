angular.module('app', [])
    .controller('AddUserController', function ($scope) {
        $scope.message = '';
        $scope.addUser = function () {
            // TODO for the reader: actually save user to database...
            console.log($scope.user);
            $scope.message = 'Thanks, ' + $scope.user.first + ', we added you!';
        };

        /**
         * 获取验证码（倒计时）
         */
        $scope.getValidateCode = function () {
            $http.post('/wx/getValidateCode.do', {mobile: mobile}).then(function (re) {
                // success
                console.log('success', re);

                $scope.msg = '验证码已发送！';

                $scope.countDown = 60;
                var timer = setInterval(function () {
                    $scope.countDown--;
                    $scope.$apply();
                    if ($scope.countDown <= 0) {
                        clearInterval(timer);
                        $scope.smsVerifyBtnDisabled = false;
                        $scope.$apply();
                    }
                }, 1000);
            }, function (re) {
                // error
                console.log('err', re)
            });
        }
    });
