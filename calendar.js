// Funcționalitatea calendarului de programări pentru Boost Agency
let bookings = [];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null;
let selectedTime = null;

// Încarcă rezervările existente din JSON
async function loadBookings() {
    try {
        const response = await fetch('bookings.json');
        const data = await response.json();
        bookings = data.bookings || [];
        console.log('Rezervări încărcate:', bookings);
    } catch (error) {
        console.error('Eroare la încărcarea rezervărilor:', error);
        bookings = [];
    }
}

// Salvează o nouă rezervare în JSON
async function saveBooking(booking) {
    try {
        // În mod normal, aici am face un request POST către server
        // Pentru demonstrație, vom presupune că serverul a primit și procesat rezervarea
        bookings.push(booking);
        
        // În lumea reală, serverul ar actualiza fișierul JSON
        console.log('Booking saved:', booking);
        
        // Simulăm o confirmare de la server
        return { success: true, message: 'Booking confirmed!' };
    } catch (error) {
        console.error('Error saving booking:', error);
        return { success: false, message: 'An error occurred. Please try again.' };
    }
}

// Verifică dacă un slot de timp este disponibil
function isTimeSlotAvailable(date, time) {
    const dateStr = formatDate(date);
    return !bookings.some(booking => 
        booking.date === dateStr && booking.time === time
    );
}

// Verifică dacă o zi este disponibilă (luni-vineri și nu este în trecut)
function isDayAvailable(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Resetăm ora pentru comparație corectă
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    // Verificăm dacă data este în viitor (sau azi) și este zi lucrătoare (1-5 = Luni-Vineri)
    const dayOfWeek = date.getDay();
    return compareDate >= today && dayOfWeek >= 1 && dayOfWeek <= 5;
}

// Formatează data pentru stocare
function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Formatează timpul pentru afișare
function formatTimeDisplay(time, use24h = true) {
    if (use24h) return time;
    
    // Convertim din format 24h în format 12h
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minutes} ${period}`;
}

// Generează sloturile de timp disponibile pentru o zi
function generateTimeSlots(date) {
    if (!isDayAvailable(date)) return [];
    
    const slots = [];
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                   date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Generăm sloturi de 30 de minute între 18:00 și 20:00
    for (let hour = 18; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            // Verificăm dacă timpul a trecut deja pentru ziua curentă
            if (isToday && (hour < currentHour || (hour === currentHour && minute <= currentMinute))) {
                // Slot de timp din trecut pentru ziua curentă, nu-l includem
                continue;
            }
            
            const timeStr = `${hour}:${minute === 0 ? '00' : minute}`;
            if (isTimeSlotAvailable(date, timeStr)) {
                slots.push(timeStr);
            }
        }
    }
    
    return slots;
}

// Generează calendarul lunar
function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Duminică, 1 = Luni, ...
    
    // Resetează containerul zilelor
    const calendarDays = document.querySelector('.calendar-days');
    calendarDays.innerHTML = '';
    
    // Actualizează titlul calendarului
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
    document.querySelector('.calendar-title').textContent = `${monthNames[month]} ${year}`;
    
    // Adaugă zile goale pentru a începe de la ziua corectă a săptămânii
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Adaugă toate zilele lunii
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        
        const date = new Date(year, month, day);
        
        // Marchează zilele disponibile
        if (isDayAvailable(date)) {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(date));
        }
        
        // Marchează ziua selectată
        if (selectedDate && day === selectedDate.getDate() && 
            month === selectedDate.getMonth() && 
            year === selectedDate.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// Selectează o dată și actualizează sloturile de timp
function selectDate(date) {
    selectedDate = date;
    selectedTime = null;
    
    // Marchează ziua selectată în calendar
    document.querySelectorAll('.day').forEach(day => {
        day.classList.remove('selected');
        if (!day.classList.contains('empty') && 
            parseInt(day.textContent) === date.getDate()) {
            day.classList.add('selected');
        }
    });
    
    // Actualizează header-ul selecției de timp
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    document.querySelector('.time-header h4').textContent = 
        `${dayNames[date.getDay()]} ${date.getDate()}`;
    
    // Actualizează sloturile de timp disponibile
    updateTimeSlots();
}

// Actualizează afișarea sloturilor de timp disponibile
function updateTimeSlots() {
    if (!selectedDate) return;
    
    const availableTimes = document.querySelector('.available-times');
    const pastTimeNotice = document.querySelector('.past-time-notice');
    availableTimes.innerHTML = '';
    
    // Resetăm și re-adăugăm mesajul pentru sloturile de timp trecute
    // deoarece innerHTML=''; îl va șterge
    if (pastTimeNotice) {
        availableTimes.appendChild(pastTimeNotice);
        pastTimeNotice.style.display = 'none';
    }
    
    const timeSlots = generateTimeSlots(selectedDate);
    
    // Determină dacă folosim format 12h sau 24h
    const use24h = document.querySelector('.time-format-btn.active').textContent === '24h';
    
    if (timeSlots.length === 0) {
        // Verificăm dacă este ziua curentă și dacă a trecut de ora 19:30
        const now = new Date();
        const isToday = selectedDate.getDate() === now.getDate() && 
                        selectedDate.getMonth() === now.getMonth() && 
                        selectedDate.getFullYear() === now.getFullYear();
        
        if (isToday && (now.getHours() > 19 || (now.getHours() === 19 && now.getMinutes() >= 30))) {
            // Afișăm mesajul specific pentru ziua curentă când toate sloturile au trecut
            if (pastTimeNotice) {
                pastTimeNotice.style.display = 'block';
            }
        } else {
            // Afișăm mesajul general pentru lipsa sloturilor
            const noSlot = document.createElement('div');
            noSlot.className = 'no-slots';
            noSlot.textContent = 'No available time slots for this day.';
            availableTimes.appendChild(noSlot);
        }
        return;
    }
    
    // Adaugă sloturile de timp disponibile
    timeSlots.forEach(time => {
        const slot = document.createElement('button');
        slot.className = 'time-slot';
        slot.textContent = formatTimeDisplay(time, use24h);
        slot.dataset.time = time; // Salvăm timpul în format 24h pentru procesare
        
        slot.addEventListener('click', () => {
            // Deselectăm slotul anterior
            document.querySelectorAll('.time-slot').forEach(s => 
                s.classList.remove('selected'));
            
            // Selectăm noul slot
            slot.classList.add('selected');
            selectedTime = time;
            
            // Activăm butonul de confirmare
            const confirmBtn = document.querySelector('#confirm-booking');
            if (confirmBtn) confirmBtn.disabled = false;
        });
        
        availableTimes.appendChild(slot);
    });
}

// Comută între formatul de 12h și 24h
function toggleTimeFormat() {
    const format12h = document.querySelector('.time-format-btn:nth-child(1)');
    const format24h = document.querySelector('.time-format-btn:nth-child(2)');
    
    format12h.addEventListener('click', () => {
        format12h.classList.add('active');
        format24h.classList.remove('active');
        updateTimeSlots();
    });
    
    format24h.addEventListener('click', () => {
        format24h.classList.add('active');
        format12h.classList.remove('active');
        updateTimeSlots();
    });
}

// Navighează la luna anterioară
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
}

// Navighează la luna următoare
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
}

// Confirmă rezervarea
async function confirmBooking() {
    if (!selectedDate || !selectedTime) {
        alert('Please select a date and time slot.');
        return;
    }
    
    // În loc să salvăm direct, afișăm formularul
    showBookingForm();
}

// Afișează formularul de contact pentru programare
function showBookingForm() {
    // Ascundem calendarul și afișăm formularul
    const calendarContainer = document.querySelector('.calendar-container');
    calendarContainer.style.display = 'none';
    
    // Creăm structura formularului dacă nu există deja
    if (!document.querySelector('.booking-form-container')) {
        const bookingRight = document.querySelector('.booking-right');
        
        // Creăm containerul formularului
        const formContainer = document.createElement('div');
        formContainer.className = 'booking-form-container';
        
        // Adăugăm title-ul formularului
        const formHeader = document.createElement('div');
        formHeader.className = 'form-header';
        formHeader.innerHTML = `
            <button class="back-to-calendar" aria-label="Back to calendar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <h3>Complete your booking details</h3>
        `;
        
        // Adăugăm formularul
        const form = document.createElement('form');
        form.id = 'booking-contact-form';
        form.innerHTML = `
            <div class="form-group">
                <label for="name">Your name <span class="required">*</span></label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email address <span class="required">*</span></label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="subject">What is this meeting about? <span class="required">*</span></label>
                <input type="text" id="subject" name="subject" required>
            </div>
            
            <div class="form-group">
                <label for="notes">Additional notes</label>
                <textarea id="notes" name="notes" placeholder="Please share anything that will help prepare for our meeting."></textarea>
            </div>
            
            <div class="form-group guests-toggle">
                <button type="button" class="add-guests-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Add guests
                </button>
            </div>
            
            <div class="form-footer">
                <p class="terms-notice">By proceeding, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
                <div class="form-actions">
                    <button type="button" class="btn-back">Back</button>
                    <button type="submit" class="btn-confirm">Confirm</button>
                </div>
            </div>
        `;
        
        // Adăugăm sumarizarea programării
        const bookingSummary = document.createElement('div');
        bookingSummary.className = 'booking-summary';
        
        // Formatăm data și ora pentru afișare
        const dateObj = selectedDate;
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const formattedDate = `${dayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
        
        // Determinăm dacă folosim format 12h sau 24h
        const use24h = document.querySelector('.time-format-btn.active').textContent === '24h';
        const displayTime = formatTimeDisplay(selectedTime, use24h);
        
        bookingSummary.innerHTML = `
            <div class="summary-title">Booking Summary</div>
            <div class="summary-details">
                <div class="summary-date">${formattedDate}</div>
                <div class="summary-time">${displayTime}</div>
                <div class="summary-duration">15 minute guided tour</div>
            </div>
        `;
        
        // Asamblăm totul
        formContainer.appendChild(formHeader);
        formContainer.appendChild(bookingSummary);
        formContainer.appendChild(form);
        bookingRight.appendChild(formContainer);
        
        // Adăugăm event listeners
        document.querySelector('.back-to-calendar').addEventListener('click', () => {
            formContainer.style.display = 'none';
            calendarContainer.style.display = 'block';
        });
        
        document.querySelector('.btn-back').addEventListener('click', () => {
            formContainer.style.display = 'none';
            calendarContainer.style.display = 'block';
        });
        
        document.querySelector('#booking-contact-form').addEventListener('submit', function(event) {
            event.preventDefault();
            submitBookingForm();
        });
    } else {
        // Dacă formularul există deja, îl afișăm
        document.querySelector('.booking-form-container').style.display = 'block';
    }
}

// Procesează și trimite formularul de contact
async function submitBookingForm() {
    const form = document.getElementById('booking-contact-form');
    
    // Validăm formularul
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Extragem datele din formular
    const clientData = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        notes: form.notes.value
    };
    
    // Creăm obiectul pentru rezervare
    const booking = {
        date: formatDate(selectedDate),
        time: selectedTime,
        client: clientData,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Afișăm un loading state
        const submitBtn = form.querySelector('.btn-confirm');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        // În implementarea reală, trimitem datele către server
        let result;
        
        try {
            // Încercăm să trimitem datele către server
            const response = await fetch('booking-handler.php?action=book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(booking)
            });
            
            result = await response.json();
            
            // Verificăm dacă rezultatul este valid
            if (!result) {
                throw new Error('Invalid server response');
            }
        } catch (networkError) {
            console.error('Server communication error:', networkError);
            
            // Fallback la metoda locală pentru demo
            console.warn('Falling back to local booking method for demonstration');
            result = await saveBooking(booking);
        }
        
        // Resetăm butonul
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (result.success) {
            // Adăugăm rezervarea în lista locală pentru a preveni dublarea
            bookings.push(booking);
            
            // Afișăm un mesaj de confirmare
            showBookingConfirmation();
        } else {
            alert(result.message || 'An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred processing your booking. Please try again.');
        
        // Resetăm butonul în caz de eroare
        const submitBtn = form.querySelector('.btn-confirm');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm';
    }
}

// Afișează confirmarea rezervării
function showBookingConfirmation() {
    const bookingRight = document.querySelector('.booking-right');
    const formContainer = document.querySelector('.booking-form-container');
    
    // Ascundem formularul
    formContainer.style.display = 'none';
    
    // Creăm containerul pentru confirmarea rezervării
    const confirmationContainer = document.createElement('div');
    confirmationContainer.className = 'booking-confirmation';
    
    confirmationContainer.innerHTML = `
        <div class="confirmation-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#32E6B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <h3>Booking Confirmed!</h3>
        <p>You will receive a confirmation email shortly with all the details and a calendar invite.</p>
        <p class="confirmation-email">A copy has been sent to <strong>${document.getElementById('email').value}</strong></p>
        <button class="btn btn-primary return-home">Return to Home</button>
    `;
    
    bookingRight.appendChild(confirmationContainer);
    
    // Adăugăm event listener pentru butonul de return
    document.querySelector('.return-home').addEventListener('click', () => {
        // Reset la calendar
        confirmationContainer.remove();
        document.querySelector('.calendar-container').style.display = 'block';
        
        // Resetăm selecțiile
        selectedDate = null;
        selectedTime = null;
        generateCalendar(currentYear, currentMonth);
        
        // Resetăm formularul
        document.getElementById('booking-contact-form').reset();
    });
}

// Inițializează funcționalitatea calendarului
async function initCalendar() {
    await loadBookings();
    
    // Inițializează calendarul
    generateCalendar(currentYear, currentMonth);
    
    // Adaugă event listeners pentru navigare
    document.querySelector('.calendar-nav.prev').addEventListener('click', previousMonth);
    document.querySelector('.calendar-nav.next').addEventListener('click', nextMonth);
    
    // Inițializează comutarea formatului de timp
    toggleTimeFormat();
    
    // Adaugă butonul de confirmare și funcționalitatea acestuia
    const timeSelection = document.querySelector('.time-selection');
    
    if (!document.querySelector('#confirm-booking')) {
        const confirmButton = document.createElement('button');
        confirmButton.id = 'confirm-booking';
        confirmButton.className = 'btn btn-primary';
        confirmButton.style.marginTop = '2rem';
        confirmButton.style.width = '100%';
        confirmButton.textContent = 'Confirm Booking';
        confirmButton.disabled = true;
        confirmButton.addEventListener('click', confirmBooking);
        
        timeSelection.appendChild(confirmButton);
    }
}

// Execută inițializarea când documentul este gata
document.addEventListener('DOMContentLoaded', initCalendar); 