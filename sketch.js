let midiAccess;
let shapes = [];

function setup() {
  createCanvas(400, 400);

  // Check for MIDI support in the browser
  if (navigator.requestMIDIAccess) {
    // Request MIDI access
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API is not supported in this browser.");
  }
}

function onMIDISuccess(midi) {
  midiAccess = midi;

  // Get the inputs
  const inputs = midiAccess.inputs.values();

  // Set up a listener for each MIDI input
  for (let input of inputs) {
    input.onmidimessage = onMIDIMessage;
  }

  console.log("MIDI devices detected:");
  for (let input of inputs) {
    console.log("Device Name:", input.name);
    console.log("Device ID:", input.id);
  }
}

function onMIDIFailure(error) {
  console.log("Failed to access MIDI devices:", error);
}

function onMIDIMessage(event) {
  // Log the MIDI data received
  console.log("MIDI Data Received:");
  console.log("Timestamp:", event.timestamp);
  console.log("Status:", event.data[0]);
  console.log("Data 1:", event.data[1]);
  console.log("Data 2:", event.data[2]);

  // Check if Data 2 is greater than 0 and Data 1 is also greater than 0
  if (event.data[2] > 0 && event.data[1] > 0) {
    // Create a shape based on MIDI data
    const shape = {
      x: random(width),
      y: random(height),
      size: event.data[1], // Use Data 1 for size
      fillColor: color(event.data[2], event.data[1], 255), // Use Data 2 and Data 1 for color
    };

    shapes.push(shape);
  }
}


function draw() {
  background(255);

  // Iterate through the shapes array
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    
    // Reduce the alpha (opacity) of the fill color
    shape.fillColor.setAlpha(shape.fillColor.levels[3] - 2); // You can adjust the decrement value (2) to control the fade rate

    // Draw the shape with the updated fill color
    fill(shape.fillColor);
    noStroke();
    ellipse(shape.x, shape.y, shape.size, shape.size);

    // Remove shapes with zero alpha (completely faded out)
    if (shape.fillColor.levels[3] <= 0) {
      shapes.splice(i, 1);
    }
  }
}

console.log("testing");

