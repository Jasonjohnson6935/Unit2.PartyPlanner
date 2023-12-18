// Global variable to store fetched party data
let partiesData = [];

document.addEventListener('DOMContentLoaded', function () {
    const partyForm = document.getElementById('partyForm');
    const partyList = document.getElementById('partyList');

    // Fetch parties from the API on page load
    fetchParties();

    partyForm.addEventListener('submit', handlePartyFormSubmit);

    function handlePartyFormSubmit(event) {
        event.preventDefault();
        const partyData = getPartyFormData();
        addParty(partyData);
    }

    function fetchParties() {
        fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B/events')
            .then(response => response.json())
            .then(responseData => {
                if (Array.isArray(responseData.data)) {
                    updatePartiesData(responseData.data);
                    responseData.data.forEach(addPartyToList);
                } else {
                    console.error('Unexpected API response:', responseData);
                }
            })
            .catch(error => console.error('Error fetching parties:', error));
    }

    function addParty(partyData) {
        fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partyData),
        })
        .then(response => response.json())
        .then(data => {
            addPartyToList(data);
            updatePartiesData([...partiesData, data]);
        })
        .catch(error => console.error('Error adding party:', error));
    }

    function addPartyToList(party) {
        const listItem = createPartyListItem(party);
        partyList.appendChild(listItem);
    }

    function createPartyListItem(party) {
        const listItem = document.createElement('li');
        listItem.appendChild(createElementWithText('strong', party.name));
        listItem.appendChild(createElementWithText('br', `Date: ${new Date(party.date).toLocaleDateString()}`));
        listItem.appendChild(createElementWithText('br', `Time: ${party.time}`));
        listItem.appendChild(createElementWithText('br', `Location: ${party.location}`));
        listItem.appendChild(createElementWithText('br', `Description: ${party.description}`));
        listItem.appendChild(createElementWithText('br'));
        listItem.appendChild(createDeleteButton(party.id));
        return listItem;
    }

    function createElementWithText(tag, text) {
        const element = document.createElement(tag);
        element.textContent = text;
        return element;
    }

    function createDeleteButton(partyId) {
        const deleteButton = createElementWithText('button', 'Delete');
        deleteButton.addEventListener('click', () => deleteParty(partyId));
        return deleteButton;
    }

    function deleteParty(partyId) {
        fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF-B/events/${partyId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                removePartyFromList(partyId);
                updatePartiesData(partiesData.filter(party => party.id !== partyId));
            } else {
                console.error('Error deleting party:', response.error);
            }
        })
        .catch(error => console.error('Error deleting party:', error));
    }

    function removePartyFromList(partyId) {
        const listItem = Array.from(partyList.children).find(item => item.querySelector(`button[data-party-id="${partyId}"]`));
        if (listItem) {
            listItem.remove();
        }
    }

    function getPartyFormData() {
        return {
            name: document.getElementById('name').value,
            date: new Date(document.getElementById('date').value).toISOString(),
            time: document.getElementById('time').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
        };
    }

    function updatePartiesData(newData) {
        partiesData = newData;
    }
});