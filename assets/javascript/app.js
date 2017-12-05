  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBGITf59xY8WI-GeBnlZiLlFEPUTwXPXrg",
    authDomain: "train-schedule-a97c5.firebaseapp.com",
    databaseURL: "https://train-schedule-a97c5.firebaseio.com",
    projectId: "train-schedule-a97c5",
    storageBucket: "",
    messagingSenderId: "730078465463"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var train = {
    name: "",
    destination: "",
    firstTime: "",
    frequency: 0
  };

  var submitOK = false;
  var submitName = false;
  var submitDestination = false;
  var submitTime = false;
  var submitFrequency = false;

  $('#add-train').on('click', function(event){

    event.preventDefault();

    //Check to make sure valid data is entered
    if ($('#train-name').val() !== ''){
      train.name = $('#train-name').val().trim();
      submitName = true;
    } else {
      alert('Please enter a name for your train.');
    }
    if ($('#destination').val() !== ''){
      train.destination = $('#destination').val().trim();
      submitDestination = true;
    } else {
      alert('Please enter a destination');
    }
    if ($('#first-time').val() !== ''){
      train.firstTime = $('#first-time').val().trim();
      submitTime = true;
    } else {
      alert('Please enter the departure time of the first train of the day.');
    }
    if ($('#frequency').val() !== ''){
      train.frequency = $('#frequency').val().trim();
      submitFrequency = true;
    } else {
      alert('Please enter the time between departures in minutes.');
    }
    if (submitName && submitDestination && submitTime && submitFrequency){
      submitOK = true;
    } else {
      submitOK = false;
    };
    
    if (submitOK){

      console.log(train);

      //Log data to firebase on submitOK
      database.ref().push({
        name: train.name,
        destination: train.destination,
        firstTime: train.firstTime,
        frequency: train.frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      //Empty input forms
      $('#train-name').val('');
      $('#destination').val('');
      $('#first-time').val('');
      $('#frequency').val('');

      //Reset booleans
      submitOK = false;
      submitName = false;
      submitDestination = false;
      submitTime = false;
      submitFrequency = false;
    }

  })

  database.ref().on("child_added", function(childSnapshot) {

    var csv = childSnapshot.val();
    console.log(csv);
    console.log(csv.frequency);

    // console.log(formattedTime);
    var formattedTime = moment(csv.firstTime, 'HH:mm');
    
    var diffTime = moment().diff(formattedTime, 'minutes') % csv.frequency;

    //if first train hasn't departed yet diffTime will be negative
    if (diffTime >= 0){
      var nextDeparture = csv.frequency - diffTime;
    } else {
      var nextDeparture = formattedTime.diff(moment(), 'minutes') + 1;
    }
    console.log(nextDeparture);

    $('#train-table').append('<tr><td>' + csv.name + '</td><td>' + csv.destination + '</td><td>' +
      csv.firstTime + '</td><td>' + csv.frequency + '</td><td>' + nextDeparture + '</td></tr>');

  });

  // console.log(train);
