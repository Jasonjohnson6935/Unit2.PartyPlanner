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
        fetch('YOUR_API_ENDPOINT', {
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
        .catch(error => console.error('Error:', error));
    });

    function fetchParties() {
        // Fetch parties from the API
        fetch('YOUR_API_ENDPOINT')
        .then(response => response.json())
        .then(data => {
            // console.log('API Response:', data);
            // Display parties in the list
            data.forEach(party => {
                addPartyToList(party);
            });
        })
        .catch(error => console.error('Error:', error));
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
        fetch(`YOUR_API_ENDPOINT/${partyId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            // Remove the party from the list
            const listItem = document.querySelector(`li:has(button[onclick="deleteParty(${partyId})"])`);
            listItem.remove();
        })
        .catch(error => console.error('Error:', error));
    }
});
