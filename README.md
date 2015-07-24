# Readme

> Confirmer for AngularJS.

### Usage
1. Include the source in your project

    `<script src="/path/to/confirmer.js"></script>`

2. List `lrConfirmer` in module dependency List

    `angular.module("myApp", [ 'lrConfirmer' ])`

3. Include `confirm="Confrim Message"` attribute in any html element you wish along with `ng-click` OR `ng-change` OR `ng-submit(probably in form element)` core directives

    `<button ng-click="handler()" confirm="Are you sure ?"></button>`

4. Believe it or not you are done! `handler()` function will be invoked only after authenticating `confirm` in above example.
