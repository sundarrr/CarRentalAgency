var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('mongodb://Sundar:sundar24@cluster0-shard-00-00-tiikr.mongodb.net/Car_Rental_Agency?authSource=admin&ssl=true',['car']);
var dbc = mongojs('mongodb://Sundar:sundar24@cluster0-shard-00-00-tiikr.mongodb.net/Car_Rental_Agency?authSource=admin&ssl=true',['customer']);
var dbr = mongojs('mongodb://Sundar:sundar24@cluster0-shard-00-00-tiikr.mongodb.net/Car_Rental_Agency?authSource=admin&ssl=true',['Reservation']);
//cluster0-shard-00-00-tiikr.mongodb.net
//mongodb://Sundar:sundar24@cluster0-tiikr.mongodb.net/test?authSource=admin&ssl=true
//mongodb://Balaganesh:B%40la1998@backendtaskcluster-shard-00-00-rcsar.mongodb.net/test?authSource=admin&ssl=true


var bodyparser = require('body-parser');

app.use(express.static(__dirname + "/view"));
app.use(bodyparser.json());	

app.get('/carlist', function(req , res){
	console.log("i received a get request!");

   db.car.find(function(err, docs){  
	if(err)
	{	
		console.log("Error from /server/vehiclelist");
		res.json(null);
	}	
	else if(docs != null)
	{
		console.log("Data retreived from Mongodb!");
		console.log(docs);
		res.end(JSON.stringify(docs));
	}
	else
	{	
		console.log("else from /server/vehiclelist");
		res.json(null);
	}		
	
	});

});



app.get('/cuslist', function(req , res){
	console.log("i received a get request!");

   dbc.customer.find(function(err, docs){  
	if(err)
	{	
		console.log("Error from /server/vehiclelist");
		res.json(null);
	}	
	else if(docs != null)
	{
		console.log("Data retreived from Mongodb!");
		console.log(docs);
		res.end(JSON.stringify(docs));
	}
	else
	{	
		console.log("else from /server/vehiclelist");
		res.json(null);
	}		
	
	});

});








app.get('/checkavail/:from/:to/:cap/:mod', function(req , res){
	var fromdate=req.params.from;
	var todate=req.params.to;
	var capacity=req.params.cap;
	var amodel=req.params.mod;
	console.log("i received a get request!");
    console.log("fromdate "+fromdate);
    console.log("todate "+todate);
   dbr.Reservation.find({ 
			/*"$or": [
	        { "issue_date": { "$gt": new Date(todate)}}, 
	        { "return_date": { "$lt": new Date(fromdate)}}
	    	]*/
	    	"$or" : [
        { "$and" : [ { "issue_date": { "$gte": new Date(fromdate)}}, { "issue_date": { "$lte": new Date(todate)} }] },
        { "$and" : [ { "return_date": { "$gte": new Date(fromdate)}}, { "return_date": { "$lte": new Date(todate)} }] }
    ] 
	}
,function(err, docs){  //,{car_id:1,_id:0}
	if(err)
	{	
		console.log("Error from /server/Reservation");
		res.json(null);
	}	
	else if(docs != null)
	{
		console.log("Data retreived!!!!!!");
		console.log(docs);
		var i;
		arr=[];
		for(i=0;i<docs.length;i++){
			arr.push(docs[i].car_id.toString());
		}
		console.log("array printing"+arr);
	    if(capacity=='undefined'&& amodel!='undefined'){
			db.car.find({
				"$and": [
		        {"id":{"$nin":arr}}, 
		        //{ "seating_capacity": capacity},
		        { "model":amodel}
		    	] },function(err,doc){
				res.end(JSON.stringify(doc));			
			});
	    }
	    else if(capacity!='undefined' && amodel=='undefined'){
	    	db.car.find({
				"$and": [
		        {"id":{"$nin":arr}}, 
		        {"seating_capacity": capacity}
		        //{ "model":amodel}
		    	] },function(err,doc){
				res.end(JSON.stringify(doc));			
			});
	    }
	    else if(capacity=='undefined' && amodel=='undefined'){
	        db.car.find({
				"$and": [
		        {"id":{"$nin":arr}} 
		        //{"seating_capacity": capacity}
		        //{ "model":amodel}
		    	] },function(err,doc){
				res.end(JSON.stringify(doc));			
			});	
	    }
	    else{
	     	db.car.find({
				"$and": [
		        {"id":{"$nin":arr}}, 
		        {"seating_capacity": capacity},
		        { "model":amodel}
		    	] },function(err,doc){
				res.end(JSON.stringify(doc));			
			});	
	    }

	}
	else
	{	
		console.log("else from /server/vehiclelist");
		res.json(null);
	}		
	
	});

});


app.post('/vehiclelist',function(req,res){
	console.log(req.body);
	//cardet-->cardetails.
	var cardet ={
		vehicle_number: req.body.vehicle_number,
		id: "",
		type: req.body.type,
		brand: req.body.brand,
		model: req.body.model,
		colour: req.body.colour,
		seating_capacity: req.body.seating_capacity, 
		rent: req.body.rent,
		city: req.body.city
	}
	db.car.insert(cardet,function(err,docs){
		db.car.update({ "_id": docs._id },{ "$set": { "id": docs._id.toString()}});

var booking = {car_id: docs._id.toString(), cus_id: "", issue_date: new Date("1850-10-02T00:00:00.000+05:30"),return_date: new Date("1851-10-02T00:00:00.000+05:30")};
		dbr.Reservation.insert(booking, function(err, doc){

		});
		res.end(JSON.stringify(docs));
	})
});


app.post('/confirmbook/:id',function(req,res){
	console.log(req.body);

	var userdata = {
    name: req.body.name,
    number: req.body.number,
    age: req.body.age,
    address: req.body.address
	};

    dbc.customer.insert(userdata,function(err,doc){
    	console.log("entered user data successfully!!");
    	var reservdata = {
    	car_id: req.params.id,
        cus_id:doc._id,
        issue_date: new Date(req.body.from),
        return_date: new Date(req.body.to)  
    };
    		dbr.Reservation.insert(reservdata,function(err,docs){
    			console.log("entered reserv data successfully!!");
    			res.json(docs);
    		});
    });
});




app.delete('/vehiclelist/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	db.car.remove({_id:mongojs.ObjectId(id)},function(err,doc){
		res.json(doc);
	});
});

app.get('/editcarlist/:id',function(req,res){
	var id=req.params.id;
	console.log(id);
	db.car.findOne({_id:mongojs.ObjectId(id)},function(err,doc){
	res.json(doc);
	}) ;
});

app.put('/updatecarlist/:id',function(req,res){
	var id=req.params.id;
	console.log(req.body.vehicle_number);
	db.car.findAndModify({
		 query: {_id: mongojs.ObjectId(id)},
         update: {$set: {type: req.body.type,brand: req.body.brand,model: req.body.model,colour:req.body.colour,seating_capacity: req.body.seating_capacity,rent:req.body.rent,city:req.body.city}},
         new: true}, function (err, doc) {
             res.json(doc);
	});
});
// listening 
app.listen(process.env.PORT || 3000);
console.log("running");
