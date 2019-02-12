/* global firebase 
 */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding trains - then update the html + update the database
// 3. When adding a train, submit the following:
// 3.1. Train Name
// 3.2. Destination 
// 3.3. First Train Time -- in military time
// 3.4. Frequency -- in minutes
// 3.5. Code this app to calculate when the next train will arrive; this should be relative to the current time.
// 3.6. Users from many different machines must be able to view same train times.
// 4. Uploads train schedules data to the database


// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAL34LG4hxBv47g4EmULevnbunMA5s-n1A",
    authDomain: "inclassdemo-a6738.firebaseapp.com",
    databaseURL: "https://inclassdemo-a6738.firebaseio.com",
    projectId: "inclassdemo-a6738",
    storageBucket: "inclassdemo-a6738.appspot.com",
    messagingSenderId: "267036910488"
  };

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
// 3. When adding a train, submit the following
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // vars for user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var firstTrainTime = $("#first-train-input").val().trim();

    console.log("1) First Train Arrival = " + firstTrainTime);

    // First Time (pushed back 1 year to make sure it comes before current time) grabbed from in class
    var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log("First Train Time converted: " + firstTrainTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("2) CURRENT TIME = " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    console.log("3) DIFFERENCE IN TIME = " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("4) REMAINDER = " + tRemainder);

    // Minute Until Train
    var minutesTillTrain = frequency - tRemainder;
    console.log("5) *MINUTES TILL TRAIN* = " + minutesTillTrain);

    // Next Train
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    console.log("6) *ARRIVAL TIME* = " + moment(nextTrain).format("HH:mm"));

    // Creates object to store info locally
    var trainSchedule = {
        name: trainName,
        role: destination,
        start: firstTrainTime,
        rate: frequency,
        next: moment(nextTrain).format("HH:mm"),
        min: minutesTillTrain
    };

    // 4. Uploads train schedules data to the database
    database.ref().push(trainSchedule);

    // Logs everything to console
    console.log(trainSchedule.name);
    console.log(trainSchedule.role);
    console.log(trainSchedule.start);
    console.log(trainSchedule.rate);
    console.log(trainSchedule.next);
    console.log(trainSchedule.min);

    // Alert of SUCCESS
    alert("Fat Controller has upated the schedule");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// Create Firebase event for "adding trains to the database" and a "row in the html" when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot);
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().role;
    var firstTrainTime = childSnapshot.val().start;
    var frequency = childSnapshot.val().rate;
    var nextTrain = childSnapshot.val().next;
    var minutesTillTrain = childSnapshot.val().min;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(frequency);
    console.log(firstTrainTime);
    console.log(nextTrain);
    console.log(minutesTillTrain);


    // Add each train's data into the table
    $("#train-table").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + minutesTillTrain);

});