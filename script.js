// Seminar Hall Data
const halls = [
    {
        id: 1,
        name: "Grand Conference Hall",
        capacity: 500,
        price: 5000,
        amenities: ["projector", "audio", "wifi"],
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Executive Meeting Room",
        capacity: 50,
        price: 1500,
        amenities: ["projector", "wifi"],
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Training Hall",
        capacity: 100,
        price: 2500,
        amenities: ["projector", "audio", "wifi"],
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Seminar Room A",
        capacity: 200,
        price: 3500,
        amenities: ["projector", "audio"],
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

// Store bookings in localStorage
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// DOM Elements
const hallsGrid = document.getElementById('halls-grid');
const capacityFilter = document.getElementById('capacity-filter');
const amenitiesFilter = document.getElementById('amenities-filter');
const bookingModal = document.getElementById('booking-modal');
const myBookingsModal = document.getElementById('my-bookings-modal');
const bookingForm = document.getElementById('booking-form');
const bookingsList = document.getElementById('bookings-list');

// Initialize date pickers
flatpickr("#search-date", {
    minDate: "today",
    dateFormat: "Y-m-d"
});

flatpickr("#booking-date", {
    minDate: "today",
    dateFormat: "Y-m-d"
});

// Event Listeners
document.getElementById('my-bookings-btn').addEventListener('click', showMyBookings);
capacityFilter.addEventListener('change', filterHalls);
amenitiesFilter.addEventListener('change', filterHalls);
bookingForm.addEventListener('submit', handleBooking);

// Close modals when clicking on close button or outside
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        bookingModal.style.display = 'none';
        myBookingsModal.style.display = 'none';
    });
});

window.onclick = function(event) {
    if (event.target === bookingModal) {
        bookingModal.style.display = 'none';
    }
    if (event.target === myBookingsModal) {
        myBookingsModal.style.display = 'none';
    }
};

// Initialize the page
displayHalls(halls);

// Functions
function displayHalls(hallsToShow) {
    hallsGrid.innerHTML = '';
    hallsToShow.forEach(hall => {
        const hallCard = `
            <div class="hall-card">
                <img src="${hall.image}" alt="${hall.name}" class="hall-image">
                <div class="hall-info">
                    <h3 class="hall-title">${hall.name}</h3>
                    <p class="hall-capacity">Capacity: ${hall.capacity} people</p>
                    <div class="hall-amenities">
                        ${hall.amenities.map(amenity => 
                            `<span class="amenity">${amenity}</span>`
                        ).join('')}
                    </div>
                    <p class="hall-price">₹${hall.price} per session</p>
                    <button class="book-btn" onclick="openBookingModal(${hall.id})">
                        Book Now
                    </button>
                </div>
            </div>
        `;
        hallsGrid.innerHTML += hallCard;
    });
}

function filterHalls() {
    const capacityValue = capacityFilter.value;
    const amenityValue = amenitiesFilter.value;

    let filteredHalls = halls;

    // Filter by capacity
    if (capacityValue !== 'all') {
        const maxCapacity = parseInt(capacityValue);
        filteredHalls = filteredHalls.filter(hall => hall.capacity <= maxCapacity);
    }

    // Filter by amenity
    if (amenityValue !== 'all') {
        filteredHalls = filteredHalls.filter(hall => 
            hall.amenities.includes(amenityValue)
        );
    }

    displayHalls(filteredHalls);
}

function openBookingModal(hallId) {
    const hall = halls.find(h => h.id === hallId);
    if (hall) {
        bookingForm.dataset.hallId = hallId;
        document.querySelector('.modal-content h2').textContent = `Book ${hall.name}`;
        bookingModal.style.display = 'block';
    }
}

function handleBooking(e) {
    e.preventDefault();
    
    const hallId = parseInt(bookingForm.dataset.hallId);
    const hall = halls.find(h => h.id === hallId);
    
    const booking = {
        id: Date.now(),
        hallId: hallId,
        hallName: hall.name,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        date: document.getElementById('booking-date').value,
        timeSlot: document.getElementById('time-slot').value,
        attendees: document.getElementById('attendees').value
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    bookingForm.reset();
    bookingModal.style.display = 'none';
    
    alert('Booking confirmed! Check your email for details.');
}

function showMyBookings() {
    bookingsList.innerHTML = '';
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p>No bookings found.</p>';
    } else {
        bookings.forEach(booking => {
            bookingsList.innerHTML += `
                <div class="booking-item">
                    <h3>${booking.hallName}</h3>
                    <p>Date: ${booking.date}</p>
                    <p>Time: ${booking.timeSlot}</p>
                    <p>Attendees: ${booking.attendees}</p>
                    <button onclick="cancelBooking(${booking.id})">Cancel Booking</button>
                </div>
            `;
        });
    }
    
    myBookingsModal.style.display = 'block';
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        bookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        showMyBookings();
    }
}

// Search functionality
document.getElementById('search-btn').addEventListener('click', () => {
    const capacity = document.getElementById('search-capacity').value;
    const date = document.getElementById('search-date').value;
    
    let filteredHalls = halls;
    
    if (capacity) {
        filteredHalls = filteredHalls.filter(hall => 
            hall.capacity >= parseInt(capacity)
        );
    }
    
    // In a real application, we would check availability for the selected date
    // For now, we'll just filter by capacity
    
    displayHalls(filteredHalls);
});