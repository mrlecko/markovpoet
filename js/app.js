//  
// angular plumbing
//
var app = angular.module('app', []);

app.controller('MainController', function($scope) {
    
    $scope.init = function(){
	
      // gather default sources
      $scope.sources = [];
      console.log(data);
      for (var i = 0; i < data.length; i++){
          $scope.sources.push(data[i]);
      }
      
      // state
      $scope.state = {'jumbo':false,};
      // app config
      $scope.appconfig = {'title':"Markov Toy"};
      // generator config
      $scope.runconfig = {
                       'lowercase':true,
                       'filterchars':true,
                       'maxchains':3,
                       'syllables':"3,5,3",
                       'animate':false,
                       'speech':false,
                        };
        }

    // the generate button
    $scope.run = function(){
      $('#output').empty();
      // generate the output
      output = run($scope.sources, $scope.runconfig);
      // turn on the jumbotron
      $scope.state['jumbo'] = true;
      
      // no results fallback
      if (output.length == 0) {
          output = ['no output :('];
      } else {
          // add the art
          if (output.length > 1) {
            output.push('');
            output.push(art[Math.floor(Math.random()*art.length)]);
          }
          
          // render the output
          for (var i = 0; i < output.length; i++) {
            if (output[i].trim().length > 0) {
                if ($scope.runconfig['speech']) {
                    speakit(output[i]);
                    }
                $('#output').append($("<p>" + output[i] + "</p>").hide().fadeIn(2000));
                //$('#output').append($("<p>" + output[i] + "</p>").textillate());
                $(function () {
                    $('#output p').textillate();
                })
            }
          }
      }
    }

    // add additional text source
    $scope.addNewSource = function(){
      $scope.sources.push({'text':''});
    }
    
    // remove text source
    $scope.removeSource = function(index){
      if ($scope.sources.length > 1){
          $scope.sources.splice(index,1);
      }
    }
});

