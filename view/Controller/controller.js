var MyApp = angular.module('MyApp',[]);

MyApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log('from controller');
  



   
 
/refresh function is to show the added data as soon as we insert the data /
var refresh = function() {
    	$http({
	      method: 'get' , 
	      url: '/carlist'
	   	}).then(function (response){  //should use then() instead of success() for latest angularjs 
	   		console.log("refreshed the server!");
	   		$scope.vehicles = response.data;
	   		$scope.car = {};
	   	},function (error){	
	   		console.log("Error from login");	
	   	});
	   	$http({
	      method: 'get' , 
	      url: '/cuslist'
	   	}).then(function (response){  //should use then() instead of success() for latest angularjs 
	   		console.log("refreshed the server!");
	   		$scope.customers = response.data;
	   		$scope.cus = {};
	   	},function (error){	
	   		console.log("Error from login");	
	   	});
	};

	refresh();


/function to add car in cars list/
   $scope.addCar = function(){
   	console.log($scope.car);
   	$http.post('/vehiclelist',$scope.car).then(function(response){
   		console.log(response);
   		refresh();
   	});
   };

//function to check car in availability of cars for rentals/
   $scope.checkAvailability = function(from,to,cap,model){
   	console.log();
    if(cap==''){
    	cap=undefined;
    }
    if(model==''){
    	model=undefined;
    }


   	$http({
	      method: 'get' , 
	      url: '/checkavail/'+from+'/'+to+'/'+cap+'/'+model
	   	}).then(function (response){  //should use then() instead of success() for latest angularjs 
	   		console.log("I got the Car list from server!");
	   		$scope.avail = response.data;
	   		//$scope.chk = {};
	   	},function (error){	
	   		console.log("Error from login");	
	   	});
   };

var cid = "";
 $scope.getcarid = function(id){
   	console.log(id);
   	cid=id;
   };



//function for confirm book
     $scope.confirmbook = function(){
   	console.log($scope.user);
   $http({
	      method: 'post',
	      data: $scope.user, 
	      url: '/confirmbook/'+cid
	   	}).then(function (response){  //should use then() instead of success() for latest angularjs 
	   		console.log("I got the Car list from server!");
	   		$scope.user = {};
	   		refresh();
	   	},function (error){	
	   		console.log("Error from login");	
	   	});
   };


//function to remove a car
    $scope.remove = function(id){
    console.log(id);
    $http.delete('/vehiclelist/'+id).then(function(response){
    	refresh();
    });
    };

//function to update a car
    $scope.edit = function(id){
	console.log(id);
	$http({
	      method: 'get' , 
	      url: '/editcarlist/'+id
	   	}).then(function (response){
	   		$scope.car = response.data; 
	   	},function (error){	
	   		console.log("Error from edit");	
	   	});
    };

//finction to update carlist
	$scope.update = function (){
	console.log($scope.car._id); 
	$http({
	      method: 'put' ,
	      data: $scope.car, 
	      url: '/updatecarlist/'+$scope.car._id
	   	}).then(function (response){
	   		$scope.car = response.data; 
	   		refresh();
	   	},function (error){	
	   		console.log("Error from update");	
	   	});
    };

}]);