(function(){
'use strict';

angular.module('lrConfirmer', [

])

.provider('Confirm', function ConfirmProvider(){
    var options = this.options = {
          title : null
        , actions : ['OK', 'Dismiss']
        , show : true
    };
    //- End of options

    this.$get = [
          "$q"
        , "$timeout"
        , function ConfirmFactory( $q, $timeout ) {
            var exports = {};

            exports.open = openConfirm;

            return exports;

            //Public
            function openConfirm( evt , message ) {
                var defer = $q.defer();

                $timeout(function() {
                    if( !confirm( message ) ) {
                        return defer.reject();
                    }

                    defer.resolve();
                });

                return defer.promise;
            }
        }
    ]
    //-End of $get
})

.config([
      "$provide"
    , "ConfirmProvider"
    , function config( $provide , ConfirmProvider) {

        //TODO: make `triggerOptions` configurable
        var triggerOptions =  [
              { name : "ngClick",  event : "click" }
            , { name : "ngSubmit", event : "submit" }
            , { name : "ngChange", event : "change" }
        ];

        angular.forEach( triggerOptions, function( triggerer ){
            var decoratingDirective = triggerer.name + "Directive";

            $provide.decorator( decoratingDirective , [
                  '$delegate'
                , '$parse'
                , 'Confirm'
                , decorator( triggerer.event, triggerer.name )
            ]);
        });

        function decorator( evtName, triggererName ) {
            return function( $delegate, $parse, Confirm ) {
                    var directive, originalCompiler, originalController, preConfirmModel, options = ConfirmProvider.options;

                    directive = $delegate[0];
                    originalCompiler = directive.compile;
                    directive.compile = compiler;

                    directive.require = "?ngModel";

                    return $delegate;

                    function compiler(tElem, tAttrs, transclude) {

                        if(! angular.isDefined( tAttrs.confirm ) ) {
                            return originalCompiler( tElem, tAttrs, transclude );
                        }

                        return function link(scope, elem, attrs, ngModelController) {
                            //if ng-model directive is present along with `confirmer` and of course one of triggerer
                            if( ngModelController ) {
                                scope.$watch(function( ) {
                                    return ngModelController.$viewValue;
                                }, function( newVal, oldVal) {
                                    preConfirmModel = oldVal;
                                });
                            }

                            elem.on( evtName , function( evt ) {

                                var fn = $parse( attrs[  triggererName  ] );
                                var fnCancel = angular.isDefined( attrs.confirmCancel ) && $parse( attrs[ "confirmCancel" ] );

                                scope.$apply(function() {
                                    var showConfirm, confirmActions;

                                    showConfirm = angular.isDefined( attrs.confirmOn )
                                                  ? $parse( attrs["confirmOn"] )( scope )
                                                  : options.show
                                                  ;

                                    if( !showConfirm ) {
                                        return fn(scope, { $event : evt });
                                    }

                                    confirmActions = attrs["confirmActions"] && attrs["confirmActions"].split(",") || options.actions;

                                    Confirm
                                        .open( evt, attrs["confirm"], attrs["confirmTitle"] || options.title , confirmActions )

                                        .then(function(){
                                            //Confirmed
                                            if( ngModelController ) {
                                                return fn(scope, { $event : evt, $oldValue :  preConfirmModel });
                                            }

                                            fn(scope, { $event : evt });
                                        })

                                        .catch(function() {

                                            //rollback to old value
                                            if(ngModelController) {
                                                ngModelController.$setViewValue( preConfirmModel );
                                            }

                                            if( angular.isFunction( fnCancel ) ) {

                                                if( ngModelController ) {
                                                    return fnCancel(scope, { $oldValue :  preConfirmModel});
                                                }

                                                fnCancel(scope);
                                            }

                                        })
                                        ;
                                });

                            });
                        }

                    }
            }
        }

    }
])
;

}())
