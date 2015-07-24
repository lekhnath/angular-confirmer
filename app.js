(function(){
'use strict';

angular.module('demoApp', [
        'lrConfirmer'
    ])

    .controller('DemoController', [
        function AppController() {
            var vm = this;

            vm.roleOptions = [ 'SUPER-ADMIN', 'ADMIN', 'MEMBER', 'GUEST' ];
            vm.items = [
                {id : 1, name : "Lekhnath Rijal", address : "Ilam, Nepal"}
            ];

            vm.onClickDeleteButton = function( item, i ) {
                vm.items.splice( i, 1);
            }

            vm.onRoleChange = function( role, from ) {

                alert("Role change to " + (role || "NONE") + " from " + (from || "NONE"));
            }

            vm.onRoleChangeCancel = function( oldVal) {

                console.log("Role not changed");

            }

            vm.onFormSubmit = function( doc ) {
                setTimeout(function(){
                    //so that form gets cleared/reset prior alert message
                    alert("Form submit success");
                }, 0);

                console.log( doc );
            }
        }
    ])


}())
