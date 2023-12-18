// Grabbing elements from the dom
const inputNameElement = document.getElementById("inputName");
const inputDateElement = document.getElementById("inputDate");
const inputTimeElement = document.getElementById("inputTime");
const inputLocationElement = document.getElementById("inputLocation");
const inputDescriptionElement = document.getElementById("inputDescription");
const addEventElement = document.getElementById("addEvent");
const eventDisplayElement = document.getElementById("eventDisplay");

// tracking the value function
function trackInputValue(inputElement) {
  let currentInputValue = "";
  inputElement.addEventListener("input", (e) => {
    currentInputValue = e.target.value;
    console.log("current value:", currentInputValue);
  });
  return currentInputValue;
}

// Input Tracking Variables
let currentNameValue = trackInputValue(inputNameElement);
let currentDateValue = trackInputValue(inputDateElement);
let currentTimeValue = trackInputValue(inputTimeElement);
let currentLocationValue = trackInputValue(inputLocationElement);
let currentDescriptionValue = trackInputValue(inputDescriptionElement);

// API Configuration
const cohortName = "2310-FSA-ET-WEB-PT-SF-B-Jason/events";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohortName}`;
console.log(API_URL);

// State
const state = {
  events: [],
};

// Fetch Events Function
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.events = data.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Render Events Function
function renderEvents() {
  console.log(state);
  if (!state.events.length) {
    eventDisplayElement.innerHTML = "<li> No Events. </li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const ul = document.createElement("ul");
    const button = document.createElement("button");
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const eventId = event.id;
      try {
        deleteEvent(eventId);
      } catch (error) {
        console.error("Error", error.message);
      }
    });

    button.innerHTML = "Delete Event";
    ul.innerHTML = `
      <h2>${event.name}</h2>
      <ul>${event.date}</ul>
      <ul>${event.description}</ul>`;
    ul.appendChild(button);

    return ul;
  });

  eventDisplayElement.replaceChildren(...eventCards);
}

// Delete Event Function, for some reason you need to press it twice. 
async function deleteEvent(eventId) {
  const deleteAPI = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B-Jason/events/${eventId}`;
  try {
    const response = await fetch(deleteAPI, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Event deleted:', data);

    await getEvents();
    renderEvents();
  } catch (error) {
    console.error('Error', error.message);
  }
}

// Initial Fetch and Render
(async () => {
  await getEvents();
  renderEvents();
})();

addEventElement.addEventListener("click", async (e) => {
  e.preventDefault(); 
const newEvent = {
  name: inputNameElement.value,
  date : new Date(inputDateElement.value).toISOString(),
  location: inputLocationElement.value,
  description: inputDescriptionElement.value,
};
  await addEvent(newEvent);

});


async function addEvent(newObj){
try{
  console.log(newObj,API_URL)
  const response = await fetch(API_URL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newObj),
  });

  if (!response.ok) {
    throw new Error(`Failed to add event. Status: ${response.status}`);
  }
const newObjData = await response.json();
console.log(newObjData)
await getEvents();
  renderEvents();

return newObjData;

} catch (error){
  console.error('Error:', error.message);
}

}