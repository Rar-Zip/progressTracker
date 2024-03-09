let myChart;
let data = [0, 0, 0];
const url = 'http://192.168.1.113:3000';

// A function to read the file from the server
function readFile(url) {
  console.log("ENTERED readFile");
  // Make a GET request to the server
  fetch(`${url}/read`)
    .then((response) => {
      //console.log(response);
      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        return response.json();
      } else {
        // Throw an error with the status text
        throw new Error(response.statusText);
      }
    })
    .then((data1) => {
      // Log the file content
      console.log(typeof (data1.numbers));
      data = data1.numbers;
      drawChart(data);
      console.log(data);
    })
    .catch((error) => {
      // Log the error
      console.error(error);
    });
}
readFile(url);
// A function to write the file to the server
function writeFile(data, url) {
  // Make a POST request to the server with the data as the body
  fetch(`${url}/write`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        numbers: data
      }
    }),
  })
    .then((response) => {
      // Check if the response is ok
      if (response.ok) {
        // Parse the response as text
        return response.text();
      } else {
        // Throw an error with the status text
        throw new Error(response.statusText);
      }
    })
    .then((message) => {
      // Log the success message
      console.log(message);
    })
    .catch((error) => {
      // Log the error
      console.log("Can't ACCESS!");
      console.error(error);
    });
}

// Create a function to generate the x values as time in minutes
function generateXValues(data) {
  let xValues = [];
  let step = 50; // x step
  for (let i = 0; i < data.length; i++) {
    xValues.push(i * step);
  }
  return xValues;
}

// Create a function to draw the chart using Chart.js library
function drawChart(data) {
  // Get the canvas element from the HTML document
  let ctx = document.getElementById("myChart").getContext("2d");
  console.log(data);

  // Check if the chart object already exists
  if (myChart) {
    // If yes, update the data and labels of the chart object
    myChart.data.datasets[0].data = data;
    myChart.data.labels = generateXValues(data);
    // Redraw the chart with the updated data and labels
    myChart.update();
  } else {
    // If not, create a new chart object
    myChart = new Chart(ctx, {
      type: "line", // The type of chart is line
      data: {
        labels: generateXValues(data), // The x values are generated from the data array
        datasets: [
          {
            label: ["Steps"], // The label of the dataset is Data
            data: data, // The y values are the data array
            fill: false, // The area under the curve is not filled
            borderColor: "rgb(185, 64, 64)", // The color of the line is light blue
            tension: 0.1, // The line has some curvature
          },
        ],
      },
      options: {
        scales: {
          y: {
            grid: {
              color: "rgb(100, 100, 100"
            },
            beginAtZero: true, // The y axis starts at zero
          },
          x: {
            grid: {
              color: "rgb(100, 100, 100)"
            }
          }
        },
      },
    });
  }
}

// Create a function to push a new value to the data array and redraw the chart
function pushValue() {
  // Get the input element from the HTML document
  let input = document.getElementById("input");

  // Get the value from the input element and parse it as a number
  let value = Number(input.value);

  // Check if the value is a valid number
  if (isNaN(value)) {
    // If not, alert the user and return
    alert("Please enter a valid number");
    return;
  }

  // Push the value to the data array
  data.push(value);

  // Clear the input element
  input.value = "";

  writeFile(data, url); //using node.js writeData function
  drawChart(data);
}

// Create a function to pop the last value from the data array and redraw the chart
function popValue() {
  // Check if the data array is not empty
  if (data.length > 0) {
    // Pop the last value from the data array
    data.pop();

    writeFile(data, url); //using node.js writeData function
    drawChart(data);
  } else {
    // If the data array is empty, alert the user and return
    alert("The data array is empty");
    return;
  }
}

let stop = 1;
let audio = new Audio("Windows_Notify_Calendar.wav")
let notification;
let popup = document.getElementById('tiu').style.display;

function stopNotification() {
  console.log("STOPPPPPED!");
  audio.pause();
  audio.currentTime = 0;
  clearInterval(notification);
}

function hidePopup() {
  document.getElementById('tiu').style.display = 'none';
  document.getElementById('timers').style.pointerEvents = 'all';
  stopNotification();
}

function timer(totalSecs, id, stopCode) {
  const init = totalSecs;
  let mins = 0, secs = 0;
  let secsString = ``, minsString = ``;
  stopNotification();

  stop = 1;
  let startTime = parseInt(new Date().getTime() / 1000);

  function updateTimer() {
    let currentTime = parseInt(new Date().getTime() / 1000);

    let countDown = totalSecs - (currentTime - startTime)

    if (stop === stopCode) {
      countDown = init;
      clearInterval(timer);
    }
    if (countDown <= 0) {
      notification = setInterval(() => {
        clearInterval();
        audio.play();
      }, 1000);
      document.getElementById('tiu').style.display = 'flex';
      document.getElementById('timers').style.pointerEvents = 'none';
      countDown = init;
      clearInterval(timer);
    }
    secs = countDown % 60;
    secsString = secs.toString();
    if (secs < 10) {
      secsString = "0" + secsString;
    }
    mins = (countDown - (countDown % 60)) / 60;
    minsString = mins.toString();
    if (mins < 10) {
      minsString = "0" + minsString;
    }

    document.getElementById(id).innerText = minsString + ":" + secsString;
  }

  const timer = setInterval(updateTimer, 1000);
}

function reset(res) {
  stopNotification();
  stop = res;
}