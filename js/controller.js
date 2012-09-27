var dec = 2;

var _on_edit_leave

function on_edit_leave(){
    _on_edit_leave();
}

angular.module('trans', []).filter('currency',function () {

    return function (input, color) {
        return '$' + parseFloat(input).toFixed(2);
    }

}).filter('date',function () {
        return function (dt) {
            //  console.log('date time: ', dt);
            var d = new Date();
            d.setTime(dt);
            return d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
        }
    }).filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });

//angular.module('transServices', ['filter']).factory();

function TableCtrl($scope, $filter) {

    var st = new Date();
    $scope.MONTHS_OF_DATA = 5;
    st.setMonth(st.getMonth() - $scope.MONTHS_OF_DATA);
    $scope.data = random_transactions(st, new Date());

    $scope.page = 0;
    $scope.page_size = 10;
    $scope.sorter='date'
    $scope.set_page = function (p) {
        $scope.page = p;
    }

    $scope.sorter = 'date';

    $scope.$watch('sorter', _sort_items)

    function _sort_items() {
        $scope.data = _.sortBy($scope.data, function (i) {
            return i[$scope.sorter];
        })
    }

    $scope.edit = function(row, item){
       var editing = 'edit_' + item;;
        _.each($scope.data, function(d){
            d.edit_name = d.edit_amount = false;
        })
        row[editing] = true;

        _on_edit_leave = _.bind(function(){
           this[editing] = false;
            delete this[editing];
            $scope.$digest();
            _on_edit_leave = false;
        }, row)
    }

    $scope.types = function(){
        return _.reduce($scope.data, function(tl, d){
            tl.push(d.type);
            return _.sortBy(_.uniq(tl), _.identity);
        }, []);
    }

    $scope.popout = function(row, item){
        if (row.flyout){
            row.flyout = false
        } else {
            _.each($scope.data, function(d){
                d.flyout = false;
            });
            row.flyout = true;
        }
    }

    $scope.delete_checked = function(){
        $scope.data = _.reject($scope.data, function(d){
            return d.checked;
        })
    }

    $scope.rclass = function(n){
       return n % 2 ?  'odd' : ''
    }

    $scope.hclass = function(w, c){
        return (w == c) ? 'active' : ''
    }

    $scope.zero_out = function(){
        _.each($scope.data, function(d){
            if (d.checked){
                d.amount = 0;
                d.checked = false;
            }
        })
    }
    _sort_items();

    function _update_pages() {
        $scope.pages = _.range(0, Math.max(1, Math.ceil($scope.data.length / $scope.page_size)), 1);
    }

    $scope.pclass=function(p){
        return p == $scope.page ? 'active' : ''
    }
    _update_pages();

    $scope.$watch('page_size', _update_pages);

    $scope.total = function (items) {
        if (!items) {
            items = $scope.data;
        }

        console.log('items: ', items);

        return _.reduce(items, function(n, i){
            var a = parseFloat(i.amount);
            if (!a) return n;
            if (isNaN(a)) return n;
            return n + a;
        }, 0)
    }
    $scope.total_on_page = function(){
        return $scope.total($scope.data.slice($scope.page * $scope.page_size, ($scope.page + 1) * $scope.page_size))
    }

}

TableCtrl.$inject = ['$scope', '$filter'];