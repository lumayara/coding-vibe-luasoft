// DOM Elements
const navElement = document.getElementById('game-nav');
const mobileMenuBtn = document.querySelector('.nav-mobile');
const navLinks = document.querySelector('.nav-links');
const countdownElement = document.getElementById('countdown');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');

// Initialize all page functionality
function initializePage() {
    initPage();
    startCountdown();
    initScrollEffects();
    addFloatingElements();
    createTypewriterEffect();
    addCardInteractivity();
    initSponsorEffects();

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Scroll event listener
    window.addEventListener('scroll', handleScrollEffects);
}

// Initialize page elements
function initPage() {
    const fadeElements = document.querySelectorAll('.title-container > *, .requirement-card, .jury-card');

    fadeElements.forEach((element, index) => {
        element.classList.add('fadeIn');
        element.style.animationDelay = `${index * 0.1}s`;
        element.style.opacity = '0';
    });

    // Set data-text for glitch effects
    document.querySelectorAll('.glitch').forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });
}

// Countdown Timer
function startCountdown() {
    const deadline = new Date("April 1, 2025 23:59:59").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = deadline - now;

        if (timeLeft <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";

            if (!document.querySelector('.countdown-finished')) {
                const finishedMessage = document.createElement('p');
                finishedMessage.className = 'countdown-finished';
                finishedMessage.textContent = "The jam has started! Submit your game now!";
                countdownElement.parentElement.appendChild(finishedMessage);
            }
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        daysElement.textContent = days < 10 ? `0${days}` : days;
        hoursElement.textContent = hours < 10 ? `0${hours}` : hours;
        minutesElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);
}

// Scroll Effects
function initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (navLinks.classList.contains('active')) {
                    toggleMobileMenu();
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function handleScrollEffects() {
    // Sticky Navigation
    navElement.classList.toggle('scrolled', window.scrollY > 50);

    // Reveal elements on scroll
    document.querySelectorAll('.requirement-card, .jury-card').forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) {
            element.classList.add('fadeIn');
        }
    });

    // Reveal sections on scroll
    ['jury-section', 'sponsors-section'].forEach(sectionClass => {
        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            const { top, bottom } = section.getBoundingClientRect();
            const isVisible = top < window.innerHeight - 100 && bottom > 0;
            section.classList.toggle(`${sectionClass}-visible`, isVisible);
        }
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
}

// Add Floating Background Elements
function addFloatingElements() {
    const header = document.querySelector('header');
    if (!header) return;

    // Store the cleanup function reference
    header.matrixCleanup = createMatrixEffect(header);

    // Optional: Clean up on page unload to prevent memory leaks
    window.addEventListener('beforeunload', () => {
        if (header.matrixCleanup) {
            header.matrixCleanup();
        }
    });
}

// Matrix-style digital rain effect
function createMatrixEffect(parent) {
    // Create container for the matrix effect
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-rain-container';
    Object.assign(matrixContainer.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '-1',
        overflow: 'hidden'
    });

    parent.appendChild(matrixContainer);

    const colors = [
        'rgba(0, 255, 170, 0.8)',
        'rgba(255, 0, 170, 0.8)',
        'rgba(77, 0, 255, 0.8)',
        'rgba(0, 170, 255, 0.8)',
        'rgba(255, 230, 0, 0.8)'
    ];

    const columnCount = Math.floor(parent.offsetWidth / 20);

    // Track active columns and their associated cleanup functions
    const activeColumns = new Map();

    // Create initial columns
    for (let i = 0; i < columnCount; i++) {
        addMatrixColumn(i);
    }

    // Create a new matrix column
    function addMatrixColumn(index) {
        const column = document.createElement('div');
        column.className = 'matrix-column';

        const columnId = `column-${Date.now()}-${Math.random()}`;
        column.dataset.id = columnId;

        Object.assign(column.style, {
            position: 'absolute',
            top: `-${Math.random() * 100}%`,
            left: `${(index / columnCount) * 100}%`,
            width: '20px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            overflow: 'hidden',
            transform: 'translateY(0)',
            animation: `matrix-fall ${5 + Math.random() * 10}s linear infinite`
        });

        const color = colors[Math.floor(Math.random() * colors.length)];
        const charCount = Math.floor(Math.random() * 15) + 10;

        // Store intervals for this column
        const charIntervals = [];

        for (let i = 0; i < charCount; i++) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = Math.random() > 0.5 ? '1' : '0';

            Object.assign(char.style, {
                fontFamily: "'Orbitron', monospace",
                fontSize: '14px',
                height: '20px',
                fontWeight: 'bold',
                color: i === 0 ? '#fff' : color,
                textShadow: i === 0 ? `0 0 8px ${color}, 0 0 15px ${color}` : `0 0 5px ${color}`,
                opacity: i === 0 ? '1' : (1 - (i / charCount)).toFixed(2)
            });

            if (Math.random() > 0.6) {
                const charInterval = setInterval(() => {
                    if (Math.random() > 0.9) {
                        char.textContent = Math.random() > 0.5 ? '1' : '0';
                    }
                }, 300 + Math.random() * 700);

                charIntervals.push(charInterval);
            }

            column.appendChild(char);
        }

        matrixContainer.appendChild(column);

        // Create cleanup function for this column
        const cleanup = () => {
            charIntervals.forEach(interval => clearInterval(interval));
            if (matrixContainer.contains(column)) {
                matrixContainer.removeChild(column);
            }
            activeColumns.delete(columnId);
        };

        // Store reference to the cleanup function
        activeColumns.set(columnId, cleanup);

        // Set timeout to remove the column after animation
        const removeTimeout = setTimeout(() => {
            column.style.opacity = '0';

            // Give time for fade-out before removing
            setTimeout(() => {
                cleanup();

                // Create a new column to replace this one
                if (matrixContainer.isConnected) {
                    const newIndex = Math.floor(Math.random() * columnCount);
                    addMatrixColumn(newIndex);
                }
            }, 1000);
        }, 10000 + Math.random() * 20000);

        // Add removal timeout to the cleanup
        charIntervals.push(removeTimeout);
    }

    // Handle window resize
    const handleResize = () => {
        const newColumnCount = Math.floor(parent.offsetWidth / 20);
        if (newColumnCount > columnCount && matrixContainer.children.length < newColumnCount) {
            for (let i = 0; i < newColumnCount - columnCount; i++) {
                addMatrixColumn(Math.floor(Math.random() * newColumnCount));
            }
        }
    };

    window.addEventListener('resize', handleResize);

    // Master cleanup function for the entire effect
    const masterCleanup = () => {
        // Clear all column intervals and remove columns
        activeColumns.forEach(cleanup => cleanup());
        activeColumns.clear();

        // Remove resize listener
        window.removeEventListener('resize', handleResize);

        // Remove container if parent still exists
        if (parent.contains(matrixContainer)) {
            parent.removeChild(matrixContainer);
        }
    };

    // Attach cleanup to the container for external access
    matrixContainer.cleanup = masterCleanup;

    return masterCleanup;
}

// Typewriter effects
function createTypewriterEffect() {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const subtitleText = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--primary)';

        let i = 0;
        const typeWriter = () => {
            if (i < subtitleText.length) {
                subtitle.textContent += subtitleText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                subtitle.style.borderRight = 'none';
            }
        };

        setTimeout(typeWriter, 1000);
    }

    const sectionTitles = document.querySelectorAll('.section-title');
    const titleTextMap = new Map();

    sectionTitles.forEach((title) => {
        const originalText = title.textContent;
        titleTextMap.set(title, originalText);

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !title.hasAttribute('data-animated')) {
                title.setAttribute('data-animated', 'true');
                title.textContent = '';
                title.style.borderRight = '2px solid var(--primary)';

                let j = 0;
                const typeSectionTitle = () => {
                    const titleText = titleTextMap.get(title);
                    if (j < titleText.length) {
                        title.textContent += titleText.charAt(j);
                        j++;
                        setTimeout(typeSectionTitle, 70);
                    } else {
                        title.style.borderRight = 'none';
                    }
                };

                typeSectionTitle();
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(title);
    });
}

// Add interactive hover effects to cards
function addCardInteractivity() {
    document.querySelectorAll('.requirement-card, .jury-card, .sponsor-item').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateZ(0)';
            setTimeout(() => {
                this.style.transform = '';
            }, 500);
        });
    });
}

// Add special effects to sponsor items
function initSponsorEffects() {
    document.querySelectorAll('.sponsor-item').forEach((item, index) => {
        item.classList.add('fadeIn');
        item.style.animationDelay = `${0.3 + index * 0.2}s`;
        item.style.opacity = '0';
    });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);