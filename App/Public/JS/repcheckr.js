/**
 * Created by dietn on 19/12/14.
 */

    /*
    Angular JS code
     */
var repcheckr = angular.module('repcheckr',[]);

repcheckr.controller('productController', function($scope, $http){


});

repcheckr.controller('statsController', function($scope, $http) {
});

/*
JQuery code
 */
var currentProduct = 0;
var products;

$(document).ready(function(){
    //startup
    getProducts(function(){
        getStats(currentProduct);
        setPageTitle(products[0].product);
    });
    //asign click handlers
    assignClickHandlers();
});

function assignClickHandlers(){
    $(document).on('click','.lnkProduct',function(){
        currentProduct = $(this).attr('productId');
        setPageTitle($(this).text());
        getStats(currentProduct);
    });

    $(document).on('click','#btnRefresh',function(){
        getStats(currentProduct);
    });
}

function getProducts(callback){
    $.ajax({
        url: '/product',
        success: function(json){
            var result = JSON.parse(json);
            products = result;
            currentProduct = result[0].id;
            for(var i = 0; i < result.length; i++){
                var toAppend = '<li class="lnkProduct" productId="' + result[i].id +'"><a href="#">' + result[i].product + '</a></li>';
                $('#drpProduct').append(toAppend);
            }
            callback();
        },
        error: function(err){
            console.log(err)
        }
    })
}


function getStats(productId){
    $.ajax({
        url:'/stats/get/'+productId,
        success:function(json){
            var data = JSON.parse(json);
            refreshCharts(data[0]);
        },
        error:function(err){
            console.log(err);
        }
    });

    $.ajax({
        url: '/stats/score/' + productId,
        success: function(json){
            json = JSON.parse(json);
            $('#scoreHolder').text('Reputation score: ' + json.totalScore);
        },
        error: function(err){
            console.log(err);
            $('#scoreHolder').text('');
        }
    })
}

function refreshCharts(json){
    if(json.total_pages === 0 && json.total_autocom === 0 && json.total_tweets === 0) {
        $('#grpWeb').html('<h4>There is no data available...</h4>');
        $('#grpTwitter').html('');
        $('#grpAutocom').html('');
    }else {
        var webData = [
            ['state', 'value'],
            ['Negative pages', json.negative_pages],
            ['Positive pages', json.positive_pages]
        ];
        drawChart(webData, 'Web reputation', 'grpWeb');

        var twitterData = [
            ['state', 'value'],
            ['Negative tweets', json.negative_tweets],
            ['Positive tweets', json.positive_tweets]
        ];
        drawChart(twitterData, 'Twitter reputation', 'grpTwitter');

        var twitterData = [
            ['state', 'value'],
            ['Negative autocomplete results', json.negative_autocom],
            ['Positive autocomplete results', json.positive_autocom]
        ];
        drawChart(twitterData, 'Google autocomplete reputation', 'grpAutocom');
    }
}

function drawChart(data,title,id) {

    var data = google.visualization.arrayToDataTable(data);

    var options = {
        title: title,
        colors: ['#E2000E', '#05590C']
    };

    var chart = new google.visualization.PieChart(document.getElementById(id));
    chart.draw(data, options);
}

function setPageTitle(productName){
    $('#selectedProduct').text('Reputation statistics for ' + productName);
}