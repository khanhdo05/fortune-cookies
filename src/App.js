import React, { useState } from 'react';
import './App.css';
import fortunes from './fortunes.json';
import cookie1 from './img/1.png';
import cookie2 from './img/2.png';
import cookie3 from './img/3.png';
import cookie41 from './img/4.1.png';
import cookie42 from './img/4.2.png';
import crumbsImage from './img/crumbs-1.png';
import crunchSound from './crunch.mp3';

function App() {
    // Initial state
    const [isCracked, setIsCracked] = useState(false);
    const [fortune, setFortune] = useState('');
    const [crackCount, setCrackCount] = useState(0);
    const [crumbs, setCrumbs] = useState([]); // Keep track of crumbs positions
    const [alert, setAlert] = useState(false);

    // Array of images to cycle through on each tap
    const cookieImages = [
        cookie1,   // Closed cookie
        cookie2,  // First crack
        cookie3,  // Second crack
    ];

    // Two images for the fully cracked cookie (left and right halves)
    const crackedCookieImages = {
        left: cookie41,  // Left side of the cracked cookie
        right: cookie42, // Right side of the cracked cookie
    };

    const createCrumbs = () => {
        const sound = new Audio(crunchSound);
        sound.play().then(r => r).catch(e => e);  // Play the crunch sound

        // Create two crumbs with different start positions and directions
        const newCrumbs = [
            { id: Date.now(), x: 200, y: 200, direction: 'left' }, // Crumb 1 (to bottom left)
            { id: Date.now() + 1, x: 200, y: 200, direction: 'right' }, // Crumb 2 (to bottom right)
        ];

        setCrumbs((prevCrumbs) => [...prevCrumbs, ...newCrumbs]);

        // Remove crumbs after 3 seconds
        setTimeout(() => {
            setCrumbs((prevCrumbs) =>
                prevCrumbs.filter((crumb) => !newCrumbs.includes(crumb))
            );
        }, 1000);
    };

    const copyToClipboard = () => {
        if (!navigator.clipboard) {
            console.error('Clipboard API not supported.');
            return;
        }

        navigator.clipboard.writeText(fortune).then(() => {
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 2000);
        }).catch(e => {
            console.error('Failed to copy fortune to clipboard:', e);
        });
    }

    // Function to handle cracking the cookie
    const handleCrackCookie = () => {
        if (isCracked) {
            return;  // Do nothing if the cookie is already cracked
        }
        if (crackCount < cookieImages.length - 1) {
            setCrackCount(crackCount + 1);  // Progress through the cracks
        } else {
            setIsCracked(true);  // Fully cracked
            const randomFortune = fortunes.valentine[Math.floor(Math.random() * fortunes.valentine.length)];
            setFortune(randomFortune);  // Set a random fortune
        }
        createCrumbs();  // Create crumbs animation
    };

    const resetCookie = () => {
        setCrackCount(0);
        setIsCracked(false);
        setFortune('');
        setCrumbs([]); // Reset crumbs when clicking on the fortune
    }

    return (
        <div className="App" onClick={() => {
            handleCrackCookie();
            if (isCracked) {
                copyToClipboard();
                resetCookie();
            }
        }}>
            <header className="App-header">
                {/** Display alert if fortune is copied */}
                {alert && (
                    <div className="alert">
                        <p>Fortune copied!</p>
                    </div>
                )}

                {/* Display the current image based on crack count */}
                {isCracked ? (
                    <div className="cracked-cookie" >
                        <img
                            src={crackedCookieImages.left}
                            alt="Left Cracked Cookie"
                            className="cookie-image"
                        />
                        <img
                            src={crackedCookieImages.right}
                            alt="Right Cracked Cookie"
                            className="cookie-image"
                        />
                    </div>
                ) : (
                    <img
                        src={cookieImages[crackCount]}
                        alt="Fortune Cookie"
                        className="cookie-image"
                    />
                )}

                {/* Display fortune if the cookie is fully cracked */}
                {isCracked && (
                    <div className="message">
                        <p>{fortune}</p>
                    </div>
                )}

                {crumbs.map((crumb) => {
                    // Determine the final position based on direction
                    const xPos = crumb.direction === 'left' ? '-50vw' : '50vw';  // X position (left or right)
                    const yPos = '50vh';  // Y position (always falls to the bottom)

                    return (
                        <div
                            key={crumb.id}
                            className="crumb"
                            style={{
                                left: '45%', // Start at the center of the screen
                                top: '50%',  // Start at the center of the screen
                                transform: 'translate(-50%, -50%)',
                                '--x': xPos,  // Use custom property for X position
                                '--y': yPos,  // Use custom property for Y position
                            }}
                        >
                            <img src={crumbsImage} alt="Crumb" />
                        </div>
                    );
                })}
            </header>
        </div>
    );
}

export default App;