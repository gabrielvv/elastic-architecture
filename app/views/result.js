var app = angular.module('catsvsdogs', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

app.controller('statsCtrl', function($scope){
  console.log("ctrl init")
  $scope.aPercent = 50;
  $scope.bPercent = 50;

  var updateScores = function(){
    socket.on('scores', function (json) {
       data = JSON.parse(json);
       console.log("on scores", data)
       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);

       var percentages = getPercentages(a, b);

       bg1.style.width = percentages.a + "%";
       bg2.style.width = percentages.b + "%";

       $scope.$apply(function () {
         $scope.aPercent = percentages.a;
         $scope.bPercent = percentages.b;
         $scope.total = a + b;
       });
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    console.log("on message")
    init();
  });
});

function getPercentages(a, b) {
  var result = {};

  if (a + b > 0) {
    result.a = Math.round(a / (a + b) * 100);
    result.b = 100 - result.a;
  } else {
    result.a = result.b = 50;
  }

  return result;
}
