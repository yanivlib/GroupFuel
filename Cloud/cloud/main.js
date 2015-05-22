var common = require('cloud/common.js');

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

/*
 * returns a list of all car makers in the database.
 */
Parse.Cloud.define("getCarMakes",function(req, res) {
    // Initialize a query object for table CarModel
    var query = new Parse.Query("CarModel");
    query.select(["Make"]);
    query.find({
            success: function (results) {
                var distinctResults = distinct(results,'Make');
                res.success(distinctResults);
            },
            error: function () {
                res.error("Failed to retrieve car makers.");
            }
        });
});

/*
 * gets a name of a car maker, returns an array of all car models from that maker in the database.
 * if no maker matches the given name, it returns an empty list.
 * if no maker id provided, returns an error.
 * returns an array of ParseObjects. 
 */
Parse.Cloud.define("getCarModels", function(req, res) {
    var make = req.params.Make;
    if (make === undefined) {
        res.error("Car Maker is a required field.");
    }
    else {
        var query = new Parse.Query("CarModel");
        query.equalTo("Make", make);
        query.find({
            success: function (results) {
                results = distinct(results, "Model");
                console.log(results);
                res.success(results);
            },
            error: function () {
                res.error("Failed to retrieve car models for maker " + make);
            }
        });
    }
});

/*
 * gets an Owner, and returns a list of all the cars owned by the Owner.
 * if no Owner is provided, the current user is used. if no user is provided with the request, returns an error.
 * returns an array of ParseObjects. 
 */
Parse.Cloud.define("getOwnedCars", function(req, res) {
    var user = req.params.Owner || req.user;
    if (user === undefined) {
        res.error("You must be logged in");
    }
    else {
        console.log(" --- getOwnedCars user: " + user);
        var query = new Parse.Query("Car");
        query.equalTo("Owner", user);
        query.include("Model");
        query.find({
            success: function (results) {
                console.log(results);
                res.success(results);
            },
            error: function () {
                res.error("Failed to retrieve owned cars");
            }
        });
    }
});

Parse.Cloud.define("removeCar", function (req, res) {
    // TODO change find to first
    var user = req.user;
    if (user === undefined) {
        res.error("You must be logged in");
    }
    else {
        var carNumber = req.params.carNumber;
        var query = new Parse.Query("Car");
        query.equalTo("Owner", user);
        query.equalTo("CarNumber", carNumber);
        query.find({
            success: function (results) {
                if (!results[0] === undefined) {
                    results[0].destroy({
                        success: function (object) {
                            res.success("Object was deleted");
                        },
                        error: function () {
                            res.error("Deletedion was failed" + Parse.Error);
                        }
                    });
                }
            },
            error: function () {
                res.error("Are you sure this is your car?");
            }
        });
    }
});


function distinct (objectList,field) {
    var distinctArray = [];
    var tempDict = {};
    for (var i = 0; i < objectList.length; i++){
        var tmp = objectList[i].get(field);
        if (tempDict[tmp] === undefined){
            tempDict[tmp] = 1;
            distinctArray.push(tmp);
        }
    }
    return distinctArray;
}

/*
 Parse.Cloud.define("AddCar" , function(req, res) {
 var user = req.user;
 if (user == undefined) {
 res.error("Please log in in order to add a car");
 }
 else{
 console.log("--- AddCar --- User is : " + user);

 }
 });
 */
/*
Parse.Cloud.define("AddCar" , function(req, res) {
    var user = req.user;
    if (user == undefined) {
        res.error("Please log in in order to add a car");
    }
    else{
        console.log("--- AddCar --- User is : " + user);

    }
});
*/