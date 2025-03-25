// VibeJam Game Jam - Main JavaScript

// DOM Elements
const navElement = document.getElementById('game-nav');
const mobileMenuBtn = document.querySelector('.nav-mobile');
const navLinks = document.querySelector('.nav-links');
const countdownElement = document.getElementById('countdown');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const hashtagElement = document.getElementById('vibejam-hashtag');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    startCountdown();
    initScrollEffects();
    createGlitchEffects();
    addFloatingElements();
    createTypewriterEffect();
    addCardInteractivity();
    initSponsorEffects();
});

window.addEventListener('scroll', function() {
    handleScrollEffects();
});

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
}

// Initialize Page
function initPage() {
    // Add fade-in animation to elements
    const fadeElements = document.querySelectorAll('.title-container > *, .competition-card, .jury-card');
    
    fadeElements.forEach((element, index) => {
        element.classList.add('fadeIn');
        element.style.animationDelay = `${index * 0.1}s`;
        element.style.opacity = '0';
    });
    
    // Set data-text for glitch effects
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });
}

// Countdown Timer
function startCountdown() {
    // Set the deadline - April 1, 2025
    const deadline = new Date("April 1, 2025 23:59:59").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = deadline - now;
        
        if (timeLeft <= 0) {
            // Countdown finished
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            
            // Optional: Add a message
            const countdownParent = countdownElement.parentElement;
            if (!document.querySelector('.countdown-finished')) {
                const finishedMessage = document.createElement('p');
                finishedMessage.className = 'countdown-finished';
                finishedMessage.textContent = "The jam has started! Submit your game now!";
                countdownParent.appendChild(finishedMessage);
            }
            
            return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        // Update the countdown display
        daysElement.textContent = days < 10 ? `0${days}` : days;
        hoursElement.textContent = hours < 10 ? `0${hours}` : hours;
        minutesElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
    }
    
    // Initial call
    updateCountdown();
    
    // Update every minute
    setInterval(updateCountdown, 60000);
}

// Scroll Effects
function initScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
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
    if (window.scrollY > 50) {
        navElement.classList.add('scrolled');
    } else {
        navElement.classList.remove('scrolled');
    }
    
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.competition-card, .jury-card');
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('fadeIn');
        }
    });
    
    // Reveal jury section on scroll
    const jurySection = document.querySelector('.jury-section');
    if (jurySection) {
        const jurySectionTop = jurySection.getBoundingClientRect().top;
        const jurySectionBottom = jurySection.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        // Show section when it enters viewport (with some offset)
        if (jurySectionTop < windowHeight - 100 && jurySectionBottom > 0) {
            jurySection.classList.add('jury-section-visible');
        } else {
            jurySection.classList.remove('jury-section-visible');
        }
    }
    
    // Reveal sponsors section on scroll
    const sponsorsSection = document.querySelector('.sponsors-section');
    if (sponsorsSection) {
        const sponsorsSectionTop = sponsorsSection.getBoundingClientRect().top;
        const sponsorsSectionBottom = sponsorsSection.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        // Show section when it enters viewport (with some offset)
        if (sponsorsSectionTop < windowHeight - 100 && sponsorsSectionBottom > 0) {
            sponsorsSection.classList.add('sponsors-section-visible');
        } else {
            sponsorsSection.classList.remove('sponsors-section-visible');
        }
    }
}

// Glitch Effects for Text
function createGlitchEffects() {
    // Add glitch effect to hashtag
    if (hashtagElement) {
        hashtagElement.classList.add('glitch');
        hashtagElement.setAttribute('data-text', hashtagElement.textContent);
        
        // Random glitch effect
        setInterval(() => {
            if (Math.random() > 0.95) {
                hashtagElement.style.animation = 'none';
                setTimeout(() => {
                    hashtagElement.style.animation = '';
                }, 50);
            }
        }, 2000);
    }
}

// Add Floating Background Elements
function addFloatingElements() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    // Add dynamic neon 
    createMatrixEffect(header);
}

// Create Matrix-style digital rain effect
function createMatrixEffect(parent) {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-rain-container';
    matrixContainer.style.position = 'absolute';
    matrixContainer.style.top = '0';
    matrixContainer.style.left = '0';
    matrixContainer.style.width = '100%';
    matrixContainer.style.height = '100%';
    matrixContainer.style.pointerEvents = 'none';
    matrixContainer.style.zIndex = '-1';
    matrixContainer.style.overflow = 'hidden';
    
    parent.appendChild(matrixContainer);
    
    // Colors for the matrix rain
    const colors = [
        'rgba(0, 255, 170, 0.8)',   // Primary cyan
        'rgba(255, 0, 170, 0.8)',   // Secondary pink
        'rgba(77, 0, 255, 0.8)',    // Accent purple
        'rgba(0, 170, 255, 0.8)',   // Blue
        'rgba(255, 230, 0, 0.8)'    // Yellow
    ];
    
    // Number of columns based on screen width
    const columnCount = Math.floor(parent.offsetWidth / 20);
    
    // Create matrix columns
    for (let i = 0; i < columnCount; i++) {
        createMatrixColumn(matrixContainer, i, columnCount, colors);
    }
    
    // Create additional columns periodically
    setInterval(() => {
        if (matrixContainer.children.length < columnCount) {
            const columnIndex = Math.floor(Math.random() * columnCount);
            createMatrixColumn(matrixContainer, columnIndex, columnCount, colors);
        }
    }, 1000);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update column count on resize
        const newColumnCount = Math.floor(parent.offsetWidth / 20);
        if (newColumnCount > columnCount && matrixContainer.children.length < newColumnCount) {
            // Add more columns if window got wider
            for (let i = 0; i < newColumnCount - columnCount; i++) {
                createMatrixColumn(matrixContainer, i, newColumnCount, colors);
            }
        }
    });
}

// Create a single matrix rain column
function createMatrixColumn(container, index, totalColumns, colors) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    
    // Set position
    column.style.position = 'absolute';
    column.style.top = `-${Math.random() * 100}%`;
    column.style.left = `${(index / totalColumns) * 100}%`;
    column.style.width = '20px';
    column.style.height = '100%';
    column.style.display = 'flex';
    column.style.flexDirection = 'column';
    column.style.textAlign = 'center';
    column.style.overflow = 'hidden';
    column.style.transform = 'translateY(0)';
    
    // Random animation duration between 5-15 seconds
    const duration = 5 + Math.random() * 10;
    column.style.animation = `matrix-fall ${duration}s linear infinite`;
    
    // Choose random color for this column
    const colorIndex = Math.floor(Math.random() * colors.length);
    const color = colors[colorIndex];
    
    // Create characters for this column
    const charCount = Math.floor(Math.random() * 15) + 10; // 10-25 characters
    
    for (let i = 0; i < charCount; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        
        // Choose random character (0, 1, or other symbols)
        const charType = Math.random();
        char.textContent = Math.random() > 0.5 ? '1' : '0';
        
        // Set character styles
        char.style.fontFamily = "'Orbitron', monospace";
        char.style.fontSize = '14px';
        char.style.height = '20px';
        char.style.fontWeight = 'bold';
        char.style.color = color;
        char.style.textShadow = `0 0 5px ${color}`;
        
        // First character is brighter
        if (i === 0) {
            char.style.color = '#fff';
            char.style.textShadow = `0 0 8px ${color}, 0 0 15px ${color}`;
            char.style.opacity = '1';
        } else {
            // Fade out as they go down
            const opacity = 1 - (i / charCount);
            char.style.opacity = opacity.toFixed(2);
        }
        
        // Randomize character change
        setInterval(() => {
            if (Math.random() > 0.9) {
                if (charType < 0.6) {
                    char.textContent = Math.random() > 0.5 ? '1' : '0';
                }
            }
        }, 300 + Math.random() * 700);
        
        column.appendChild(char);
    }
    
    container.appendChild(column);
    
    // Remove column after random time
    const lifetime = 10000 + Math.random() * 20000; // 10-30 seconds
    setTimeout(() => {
        column.style.opacity = '0';
        setTimeout(() => column.remove(), 1000);
    }, lifetime);
}

// Create typewriter effects for subtitle and all section titles
function createTypewriterEffect() {
    // Handle subtitle typewriter effect
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
    
    // Apply typewriter effect to all section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    
    // Initialize a map to store original text content
    const titleTextMap = new Map();
    
    // Store original text and set up observers for each title
    sectionTitles.forEach((title) => {
        const originalText = title.textContent;
        titleTextMap.set(title, originalText);
        
        // Create observer to trigger when section is visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Only animate if it hasn't been animated before
                if (!title.hasAttribute('data-animated')) {
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
                }
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        
        observer.observe(title);
    });
}

// Add interactive hover effects to cards
function addCardInteractivity() {
    const cards = document.querySelectorAll('.competition-card, .jury-card, .sponsor-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateZ(0)';
            setTimeout(() => {
                this.style.transform = '';
            }, 500);
        });
    });
}

// Add special effects to sponsor items (without creating new elements)
function initSponsorEffects() {
    const sponsorItems = document.querySelectorAll('.sponsor-item');
    
    // Add animation delays for each sponsor
    sponsorItems.forEach((item, index) => {
        item.classList.add('fadeIn');
        item.style.animationDelay = `${0.3 + index * 0.2}s`;
        item.style.opacity = '0';
    });
}