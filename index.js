// Global variable to store fetched party data
let partiesData = [];

document.addEventListener('DOMContentLoaded', function () {
    const partyForm = document.getElementById('partyForm');
    const partyList = document.getElementById('partyList');

    // Fetch parties from the API on page load
    fetchParties();

    partyForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get party information from the form
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;

        // Send a POST request to add the new party
        fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                date,
                time,
                location,
                description,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Add the new party to the list
            addPartyToList(data);
        })
        .catch(error => console.error('Error adding party:', error));
    });

    function fetchParties() {
        // Fetch parties from the API
        fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B/events')
            .then(response => response.json())
            .then(responseData => {
                console.log('API Response:', responseData);

                if (Array.isArray(responseData.data)) {
                    partiesData = responseData.data; // Update the global variable
                    responseData.data.forEach(party => {
                        addPartyToList(party);
                    });
                } else {
                    console.error('Unexpected API response:', responseData);
                }
            })
            .catch(error => console.error('Error fetching parties:', error));
    }

    function addPartyToList(party) {
        // Create list item for the party
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${party.name}</strong><br>
            Date: ${new Date(party.date).toLocaleDateString()}<br>
            Time: ${party.time}<br>
            Location: ${party.location}<br>
            Description: ${party.description}<br>
            <button onclick="deleteParty(${party.id})">Delete</button>
        `;

        // Add the list item to the party list
        partyList.appendChild(listItem);
        
    }

    function deleteParty(partyId) {
        // Send a DELETE request to remove the party
        fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B/events/${partyId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Delete API Response:', data);
            
            // Remove the party from the list
            const listItem = document.querySelector(`li:has(button[onclick="deleteParty(${partyId})"])`);
            listItem.remove();
        })
        .catch(error => console.error('Error deleting party:', error));
    }
});
