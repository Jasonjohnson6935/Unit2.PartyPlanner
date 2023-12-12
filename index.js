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
        const date = new Date(document.getElementById('date').value).toISOString();
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

            // Update the global variable with the new data
            partiesData.push(data);
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
                    // Update the global variable with the fetched data
                    partiesData = responseData.data;

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

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteParty(party.id));

        // Append elements to list item
        listItem.appendChild(document.createElement('strong')).textContent = party.name;
        listItem.appendChild(document.createElement('br')).textContent = `Date: ${new Date(party.date).toLocaleDateString()}`;
        listItem.appendChild(document.createElement('br')).textContent = `Time: ${party.time}`;
        listItem.appendChild(document.createElement('br')).textContent = `Location: ${party.location}`;
        listItem.appendChild(document.createElement('br')).textContent = `Description: ${party.description}`;
        listItem.appendChild(document.createElement('br'));
        listItem.appendChild(deleteButton);

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
    
            if (data.success) {
                // Remove the party from the list
                const listItem = document.querySelector(`li:has(button[onclick="deleteParty(${partyId})"])`);
                listItem.remove();
    
                // Update the global variable by removing the deleted party
                partiesData = partiesData.filter(party => party.id !== partyId);
            } else {
                console.error('Error deleting party:', data.error);
            }
        })
        .catch(error => console.error('Error deleting party:', error));
    }
});


