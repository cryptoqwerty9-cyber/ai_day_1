// COUNTDOWN TIMER LOGIC
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const targetDateStr = countdownEl.getAttribute('data-target');
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

// MOBILE NAVBAR TOGGLE
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('mobile-active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking nav link
        document.querySelectorAll('.nav-link, .nav-btn-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }
}

// SCROLL ACTIVE NAV HIGH-LIGHTING
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

// SCROLL REVEAL ANIMATIONS
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.timeline-item, .requirement-item, .hadiah-card, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        // Initial setup for reveal
        el.style.opacity = '0';
        if (el.classList.contains('left')) {
            el.style.transform = 'translateX(-30px)';
        } else if (el.classList.contains('right')) {
            el.style.transform = 'translateX(30px)';
        } else {
            el.style.transform = 'translateY(30px)';
        }
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        observer.observe(el);
    });
}

// LIVE ROSTER VALIDATOR & SQUAD MANAGEMENT
// Pre-populated roster (18 players) to make simulation easier and faster for testing.
// 7 Players under 30 (Target: 8)
// 11 Players 30 or over (Target: 12)
let roster = [
    { id: 1, name: "Sertu Ahmad Fauzi", age: 25 },
    { id: 2, name: "Serda Bagus Prasetyo", age: 23 },
    { id: 3, name: "Kopda Dian Cahyono", age: 28 },
    { id: 4, name: "Prada Eko Wahyudi", age: 21 },
    { id: 5, name: "Serda Fajar Ramadhan", age: 24 },
    { id: 6, name: "Sertu Guntur Wibowo", age: 27 },
    { id: 7, name: "Prada Hendra Wijaya", age: 22 },

    { id: 8, name: "Serma Indra Lesmana", age: 34 },
    { id: 9, name: "Pelda Joko Susilo", age: 39 },
    { id: 10, name: "Sertu Kusnan", age: 32 },
    { id: 11, name: "Serma Lukman Hakim", age: 35 },
    { id: 12, name: "Kopda Mulyono", age: 31 },
    { id: 13, name: "Koptu Nanang", age: 33 },
    { id: 14, name: "Sertu Oki Rahmat", age: 32 },
    { id: 15, name: "Serda Pujianto", age: 30 },
    { id: 16, name: "Koptu Qomarudin", age: 31 },
    { id: 17, name: "Serma Rudi Hermawan", age: 36 },
    { id: 18, name: "Pelda Sugeng", age: 38 }
];

let nextPlayerId = 19;

function updateRosterUI() {
    const rosterList = document.getElementById('roster-list');
    const totalCountEl = document.getElementById('player-list-count');
    const noPlayerMsg = document.querySelector('.no-player-msg');

    if (!rosterList) return;

    // Clear roster listing (except template/msg)
    rosterList.innerHTML = '';

    if (roster.length === 0) {
        rosterList.appendChild(noPlayerMsg);
        totalCountEl.innerText = "0";
    } else {
        totalCountEl.innerText = roster.length;
        
        roster.forEach(player => {
            const isYoung = player.age < 30;
            const playerRow = document.createElement('div');
            playerRow.className = `player-row ${isYoung ? 'young' : 'senior'}`;
            playerRow.innerHTML = `
                <span class="player-row-name"><i class="fa-solid fa-crosshairs"></i> ${player.name}</span>
                <span class="player-row-age">${player.age} th [${isYoung ? 'MUDA' : 'SENIOR'}]</span>
                <button type="button" class="btn-delete-player" onclick="deletePlayer(${player.id})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            rosterList.appendChild(playerRow);
        });
    }

    validateSquad();
}

function validateSquad() {
    const valTotal = document.getElementById('val-total');
    const valYoung = document.getElementById('val-young');
    const valSenior = document.getElementById('val-senior');
    const statusBadge = document.getElementById('validation-status-badge');
    const validatorMsg = document.getElementById('validator-msg');
    const submitBtn = document.getElementById('submit-btn');

    if (!valTotal) return;

    const total = roster.length;
    const youngCount = roster.filter(p => p.age < 30).length;
    const seniorCount = roster.filter(p => p.age >= 30).length;

    const youngPercent = total > 0 ? Math.round((youngCount / total) * 100) : 0;
    const seniorPercent = total > 0 ? Math.round((seniorCount / total) * 100) : 0;

    // Update Text Metrics
    valTotal.innerText = `${total} / 20`;
    valYoung.innerText = `${youngCount} (${youngPercent}%)`;
    valSenior.innerText = `${seniorCount} (${seniorPercent}%)`;

    // Rule Flags
    const isTotalValid = total === 20;
    const isYoungValid = youngCount === 8; // 8 of 20 is exactly 40%
    const isSeniorValid = seniorCount === 12; // 12 of 20 is exactly 60%
    
    const isValid = isTotalValid && isYoungValid && isSeniorValid;

    // Update Status Badge & Class
    if (isValid) {
        statusBadge.className = 'badge-status success';
        statusBadge.innerText = 'VALID';
        validatorMsg.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #2e6930; margin-right: 5px;"></i> Roster tim memenuhi semua persyaratan! Siap didaftarkan.';
        validatorMsg.style.color = '#729e7b';
        submitBtn.disabled = false;
    } else {
        statusBadge.className = 'badge-status error';
        statusBadge.innerText = 'TIDAK VALID';
        submitBtn.disabled = true;
        
        let errorMessages = [];
        if (total !== 20) {
            errorMessages.push(`Jumlah pemain terdaftar <strong>${total}</strong> (Harus tepat 20).`);
        }
        if (youngCount !== 8) {
            errorMessages.push(`Pemain Muda &lt;30 tahun berjumlah <strong>${youngCount}</strong> (Harus tepat 8).`);
        }
        if (seniorCount !== 12) {
            errorMessages.push(`Pemain Senior &ge;30 tahun berjumlah <strong>${seniorCount}</strong> (Harus tepat 12).`);
        }

        validatorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color: #c94040; margin-right: 5px;"></i> Masalah: <br>• ' + errorMessages.join('<br>• ');
        validatorMsg.style.color = '#a3b8a7';
    }
}

// Global functions exposed to inline events
window.addPlayer = function() {
    const nameInput = document.getElementById('new-player-name');
    const ageInput = document.getElementById('new-player-age');

    if (!nameInput || !ageInput) return;

    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value);

    if (!name) {
        alert("Harap masukkan nama prajurit!");
        nameInput.focus();
        return;
    }

    if (isNaN(age) || age < 18 || age > 55) {
        alert("Harap masukkan umur prajurit yang valid (18 - 55 tahun)!");
        ageInput.focus();
        return;
    }

    if (roster.length >= 20) {
        alert("Skuad sudah penuh! Maksimal 20 pemain.");
        return;
    }

    // Add to roster
    roster.push({
        id: nextPlayerId++,
        name: name,
        age: age
    });

    // Clear Inputs
    nameInput.value = '';
    ageInput.value = '';

    // Refresh UI
    updateRosterUI();
};

window.deletePlayer = function(id) {
    roster = roster.filter(player => player.id !== id);
    updateRosterUI();
};

// FORM SUBMISSION & MODAL
window.submitForm = function() {
    const kodamName = document.getElementById('kodam-name').value;
    const modal = document.getElementById('success-modal');
    const modalKodamText = document.getElementById('modal-kodam');

    if (modal && modalKodamText) {
        modalKodamText.innerText = kodamName;
        modal.style.display = 'flex';
    }
};

window.closeModal = function() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Optional: Reset form & roster to pre-populated state
    document.getElementById('registration-form').reset();
    // Restoring initial roster
    roster = [
        { id: 1, name: "Sertu Ahmad Fauzi", age: 25 },
        { id: 2, name: "Serda Bagus Prasetyo", age: 23 },
        { id: 3, name: "Kopda Dian Cahyono", age: 28 },
        { id: 4, name: "Prada Eko Wahyudi", age: 21 },
        { id: 5, name: "Serda Fajar Ramadhan", age: 24 },
        { id: 6, name: "Sertu Guntur Wibowo", age: 27 },
        { id: 7, name: "Prada Hendra Wijaya", age: 22 },
        { id: 8, name: "Serma Indra Lesmana", age: 34 },
        { id: 9, name: "Pelda Joko Susilo", age: 39 },
        { id: 10, name: "Sertu Kusnan", age: 32 },
        { id: 11, name: "Serma Lukman Hakim", age: 35 },
        { id: 12, name: "Kopda Mulyono", age: 31 },
        { id: 13, name: "Koptu Nanang", age: 33 },
        { id: 14, name: "Sertu Oki Rahmat", age: 32 },
        { id: 15, name: "Serda Pujianto", age: 30 },
        { id: 16, name: "Koptu Qomarudin", age: 31 },
        { id: 17, name: "Serma Rudi Hermawan", age: 36 },
        { id: 18, name: "Pelda Sugeng", age: 38 }
    ];
    nextPlayerId = 19;
    updateRosterUI();
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initMobileMenu();
    initNavHighlight();
    initScrollReveal();
    updateRosterUI(); // Load pre-populated roster
});
