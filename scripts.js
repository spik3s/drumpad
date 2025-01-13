// scripts.js
const normalStates = ['off', 'on', 'roll', 'flare'];
const lightStates = ['light', 'light-roll', 'light-flare'];
const allStates = ['off', 'on', 'roll', 'flare', 'light', 'light-roll', 'light-flare'];
const rows = ['row-oh', 'row-ch', 'row-hc', 'row-lt', 'row-sd', 'row-bd', 'row-acc'];
const totalPages = 8;
let currentPage = 0;
let lightMode = false;
let isPlaying = false;
let currentStep = 0;
let intervalId;
let currentBPM = parseFloat(localStorage.getItem('sequencerBPM')) || 60;

const calculateStepTime = (bpm) => {
    return (60000 / bpm) / 4; // Convert BPM to milliseconds per step
};

document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Function to create a kick drum sound using a sinewave and an envelope
    const playKickSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime); // Start frequency
        oscillator.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // End frequency

        gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start gain
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // End gain

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Function to create a noise buffer
    const createNoiseBuffer = () => {
        const bufferSize = audioContext.sampleRate * 1; // 1 second buffer
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }

        return buffer;
    };

    // Function to create an open hi-hat sound
    const playOpenHiHatSound = () => {
        const bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = createNoiseBuffer();

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.7, audioContext.currentTime); // Start gain
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2); // End gain

        bufferSource.connect(gainNode);
        gainNode.connect(audioContext.destination);

        bufferSource.start(audioContext.currentTime);
        bufferSource.stop(audioContext.currentTime + 0.2);
    };

    // Function to create a closed hi-hat sound
    const playClosedHiHatSound = () => {
        const bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = createNoiseBuffer();

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.7, audioContext.currentTime); // Start gain
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1); // End gain

        bufferSource.connect(gainNode);
        gainNode.connect(audioContext.destination);

        bufferSource.start(audioContext.currentTime);
        bufferSource.stop(audioContext.currentTime + 0.1);
    };

    // Function to create a hand clap sound
    const playHandClapSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime); // Frequency

        gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start gain
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1); // End gain

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };

    // Function to create a low tom sound
    const playLowTomSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime); // Start frequency
        oscillator.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // End frequency

        gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start gain
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // End gain

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Function to create a snare drum sound
    const playSnareDrumSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Frequency

        gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Start gain
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2); // End gain

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    };

    // Function to update button states based on mode
    const updateButtonState = (button, isCmdClick) => {
        const rowId = button.closest('.row').id;
        const states = rowId === 'row-acc' ? ['off', 'on'] : (lightMode || isCmdClick ? lightStates : normalStates);
        const currentState = allStates.find(state => button.classList.contains(state));

        const currentIndex = states.indexOf(currentState);
        const nextIndex = (currentIndex + 1) % states.length;

        button.classList.remove(currentState);
        button.classList.add(states[nextIndex]);

        if (rowId === 'row-acc' && states[nextIndex] === 'on') {
            button.classList.add('on-acc');
        } else {
            button.classList.remove('on-acc');
        }

        saveButtonStates();
    };

    // Function to save button states to localStorage
    const saveButtonStates = () => {
        const buttonStates = {};
        rows.forEach(rowId => {
            const row = document.getElementById(rowId);
            const buttons = row.querySelectorAll('.button');
            buttonStates[rowId] = Array.from(buttons).map(button => {
                return allStates.find(state => button.classList.contains(state));
            });
        });
        const allPagesStates = JSON.parse(localStorage.getItem('allPagesStates')) || {};
        allPagesStates[currentPage] = buttonStates;
        localStorage.setItem('allPagesStates', JSON.stringify(allPagesStates));
    };

    // Function to load button states from localStorage
    const loadButtonStates = (page) => {
        const allPagesStates = JSON.parse(localStorage.getItem('allPagesStates'));
        if (allPagesStates && allPagesStates[page]) {
            const buttonStates = allPagesStates[page];
            rows.forEach(rowId => {
                const row = document.getElementById(rowId);
                const buttons = row.querySelectorAll('.button');
                buttonStates[rowId].forEach((state, index) => {
                    const button = buttons[index];
                    allStates.forEach(s => button.classList.remove(s));
                    button.classList.add(state);
                    if (rowId === 'row-acc' && state === 'on') {
                        button.classList.add('on-acc');
                    }
                });
            });
        } else {
            rows.forEach(rowId => {
                const row = document.getElementById(rowId);
                const buttons = row.querySelectorAll('.button');
                buttons.forEach(button => {
                    allStates.forEach(state => button.classList.remove(state));
                    button.classList.add('off');
                });
            });
        }
    };

    // Function to switch pages
    const switchPage = (page) => {
        saveButtonStates();
        currentPage = page;
        loadButtonStates(page);
        document.querySelectorAll('.page-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`.page-button[data-page="${page}"]`).classList.add('active');
    };

    // Function to step through the sequence
    const stepSequence = () => {
        rows.forEach(rowId => {
            const row = document.getElementById(rowId);
            const buttons = row.querySelectorAll('.button');
            const button = buttons[currentStep];
            if (!button.classList.contains('off')) {
                switch (rowId) {
                    case 'row-oh':
                        playOpenHiHatSound();
                        break;
                    case 'row-ch':
                        playClosedHiHatSound();
                        break;
                    case 'row-hc':
                        playHandClapSound();
                        break;
                    case 'row-lt':
                        playLowTomSound();
                        break;
                    case 'row-sd':
                        playSnareDrumSound();
                        break;
                    case 'row-bd':
                        playKickSound();
                        break;
                }
            }
            button.classList.add('active-step');
        });

        // Remove the active-step class from the previous step
        const previousStep = (currentStep - 1 + 16) % 16;
        rows.forEach(rowId => {
            const row = document.getElementById(rowId);
            const buttons = row.querySelectorAll('.button');
            const button = buttons[previousStep];
            button.classList.remove('active-step');
        });

        currentStep = (currentStep + 1) % 16;
    };

    const playStep = (step) => {
        // Remove previous step indicator
        rows.forEach(rowId => {
            const row = document.getElementById(rowId);
            const buttons = row.querySelectorAll('.button');
            buttons.forEach(button => button.classList.remove('active-step'));
            
            // Add indicator to current step
            buttons[step].classList.add('active-step');
            
            // Check button state and play sound if active
            const buttonState = buttons[step].dataset.state;
            if (buttonState !== 'off' && buttonState !== undefined) {
                switch(rowId) {
                    case 'row-oh':
                        playOpenHatSound();
                        break;
                    case 'row-ch':
                        playClosedHatSound();
                        break;
                    case 'row-hc':
                        playHandClapSound();
                        break;
                    case 'row-lt':
                        playLowTomSound();
                        break;
                    case 'row-sd':
                        playSnareSound();
                        break;
                    case 'row-bd':
                        playKickSound();
                        break;
                    case 'row-acc':
                        playAccentSound();
                        break;
                }
            }
        });
    };

    // Function to start the sequencer
    const startSequencer = () => {
        isPlaying = true;
        const stepTime = calculateStepTime(currentBPM);
        currentStep = 0; // Reset step counter
        intervalId = setInterval(() => {
            playStep(currentStep);
            currentStep = (currentStep + 1) % 16;
        }, stepTime);
    };

    // Function to stop the sequencer
    const stopSequencer = () => {
        isPlaying = false;
        clearInterval(intervalId);
        currentStep = 0;
        // Clear active step indicators
        rows.forEach(rowId => {
            const row = document.getElementById(rowId);
            const buttons = row.querySelectorAll('.button');
            buttons.forEach(button => button.classList.remove('active-step'));
        });
    };

    // Add BPM handling
    const bpmInput = document.getElementById('bpmInput');
    if (bpmInput) {
        bpmInput.value = currentBPM;

        bpmInput.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            // Validate and constrain BPM
            if (isNaN(value) || value < 20) value = 20;
            if (value > 300) value = 300;
            value = Math.round(value * 100) / 100; // Round to 2 decimal places

            currentBPM = value;
            localStorage.setItem('sequencerBPM', value);

            // If sequencer is playing, restart it with new tempo
            if (isPlaying) {
                stopSequencer();
                startSequencer();
            }
        });
    }

    // Initialize buttons and add event listeners
    rows.forEach((rowId) => {
        const row = document.getElementById(rowId);
        const buttonsContainer = row.querySelector('.buttons');

        for (let i = 0; i < 16; i++) {
            const button = document.createElement('div');
            button.classList.add('button', 'off');
            button.dataset.column = i; // Add a data attribute to identify the column
            button.addEventListener('click', (event) => {
                updateButtonState(button, event.metaKey || event.ctrlKey);
            });
            buttonsContainer.appendChild(button);

            // Add a divider after every 4 buttons
            if ((i + 1) % 4 === 0 && i !== 15) {
                const divider = document.createElement('div');
                divider.classList.add('divider');
                buttonsContainer.appendChild(divider);
            }
        }

        // Add event listener for row reset button
        const resetRowButton = row.querySelector('.reset-row');
        resetRowButton.addEventListener('click', () => {
            const buttons = buttonsContainer.querySelectorAll('.button');
            buttons.forEach(button => {
                allStates.forEach(state => button.classList.remove(state));
                button.classList.add('off');
            });
            saveButtonStates();
        });
    });

    // Add event listeners for column reset buttons
    const resetColumnButtons = document.querySelectorAll('.reset-column');
    resetColumnButtons.forEach(resetColumnButton => {
        resetColumnButton.addEventListener('click', () => {
            const columnIndex = resetColumnButton.dataset.column;
            rows.forEach(rowId => {
                const row = document.getElementById(rowId);
                const button = row.querySelector(`.buttons .button[data-column="${columnIndex}"]`);
                if (button) {
                    allStates.forEach(state => button.classList.remove(state));
                    button.classList.add('off');
                }
            });
            saveButtonStates();
        });
    });

    // Reset pattern button functionality
    const resetButton = document.getElementById('reset-pattern');
    resetButton.addEventListener('click', () => {
        const buttons = document.querySelectorAll('.button');
        buttons.forEach(button => {
            allStates.forEach(state => button.classList.remove(state));
            button.classList.add('off');
        });
        saveButtonStates();
    });

    // Light mode toggle functionality
    const lightModeToggle = document.getElementById('light-mode-toggle');
    lightModeToggle.addEventListener('change', (event) => {
        lightMode = event.target.checked;
    });

    // Page buttons functionality
    const pageButtons = document.querySelectorAll('.page-button');
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchPage(parseInt(button.dataset.page));
        });
    });

    // Play/Pause button functionality
    const playPauseButton = document.getElementById('play-pause');
    if (playPauseButton) {
        playPauseButton.addEventListener('click', () => {
            if (isPlaying) {
                stopSequencer();
                playPauseButton.textContent = 'Play';
            } else {
                startSequencer();
                playPauseButton.textContent = 'Pause';
            }
        });
    }

    // Load button states on page load
    loadButtonStates(currentPage);
    document.querySelector(`.page-button[data-page="${currentPage}"]`).classList.add('active');
});