async function loadSpots() {
    try {
        const typeFilter = document.getElementById('typeFilter').value;
        let url = '/api/tourism/spots/nearby';
        if (typeFilter) url += `?type=${typeFilter}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            displaySpots(data.data);
        }
    } catch (error) {
        console.error('خطا:', error);
    }
}

function displaySpots(spots) {
    const container = document.getElementById('spotsList');
    container.innerHTML = spots.map(spot => `
        <div class="spot-card">
            <h3>${spot.name}</h3>
            <p>${spot.description}</p>
            <div>⭐ ${spot.rating} | 🎫 ${spot.entranceFee ? spot.entranceFee.toLocaleString() + ' تومان' : 'رایگان'}</div>
            <button class="book-btn" onclick="bookTour(${spot.id})">رزرو بازدید</button>
        </div>
    `).join('');
}

async function loadTours() {
    try {
        const response = await fetch('/api/tourism/tours');
        const data = await response.json();

        if (data.success) {
            displayTours(data.data);
        }
    } catch (error) {
        console.error('خطا:', error);
    }
}

function displayTours(tours) {
    const container = document.getElementById('toursList');
    container.innerHTML = tours.map(tour => `
        <div class="tour-card">
            <h3>${tour.name}</h3>
            <p>${tour.description}</p>
            <div>⏱️ ${tour.duration} | 💰 ${tour.price.toLocaleString()} تومان</div>
            <button class="book-btn" onclick="bookTour(${tour.id})">رزرو تور</button>
        </div>
    `).join('');
}

async function bookTour(tourId) {
    const bookingData = {
        tourId: tourId,
        participants: 1,
        date: new Date().toISOString().split('T')[0]
    };

    try {
        const response = await fetch('/api/tourism/tours/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        if (result.success) {
            alert('تور با موفقیت رزرو شد!');
        }
    } catch (error) {
        alert('خطا در رزرو تور');
    }
}

// بارگذاری اولیه
loadSpots();
loadTours();
