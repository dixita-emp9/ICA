import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser, logoutUser } from './services/apiService';
import { startQrScanner } from './services/qrScanner';
import './Head.css';

const Head = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [scannerActive, setScannerActive] = useState(false); // State for scanner activity
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser()
            .then((response) => {
                setUserName(response.data.name);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handleScanClick = async () => {
        console.log('Scan QR Code clicked!'); // Log to confirm this is triggered
        try {
            // Start QR Scanner and pass necessary state functions
            await startQrScanner((decodedText) => {
                console.log('Scanned QR Code:', decodedText);
                window.location.href = decodedText; // Redirect to the scanned URL
            }, setScannerActive); // Pass setScannerActive function
        } catch (error) {
            console.error('Error starting QR scanner:', error);
        }
    };

    const handleMenuItemClick = (path) => {
        if (path === '/scan-qr') {
            // Close the menu first
            setIsMenuOpen(false);
            // Call the scan function
            handleScanClick();
        } else {
            navigate(path);
            setIsMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logoutUser()
            .then(() => {
                localStorage.removeItem('authToken');
                navigate('/login');
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    return (
        <header>
            <nav className="curve">
                <i 
                    className="bi bi-list" 
                    style={{ fontSize: "2rem", cursor: "pointer" }} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                ></i>
                <img 
                    src="/logo.png" 
                    alt="ICA Logo" 
                    className="img-fluid mainlogo" 
                    onClick={() => navigate('/portfolios')}
                />
                <img 
                    src="/profile.png" 
                    alt="Profile Logo" 
                    className="img-fluid profilelogo" 
                    onClick={() => navigate('/profile')}
                />
            </nav>
            
            {isMenuOpen && (
                <div className="side-menu">
                    <div className="side-menu-content">
                        <i 
                            className="bi bi-x" 
                            style={{ fontSize: "2rem", cursor: "pointer" }} 
                            onClick={() => setIsMenuOpen(false)}
                        ></i>
                        <div className="menu-header">
                            <img 
                                src="/profile.png" 
                                alt="Profile" 
                                className="profile-picture"
                            />
                            <h4>{userName ? userName : 'Loading...'}</h4>
                        </div>
                        <ul className="menu-items">
                            <li className='btn' onClick={() => handleMenuItemClick('/profile')}><i className="fa fa-user"></i> Profile</li>
                            <li className='btn' onClick={() => handleMenuItemClick('/portfolios')}><i className="fa fa-home"></i> Home</li>
                            <li className='btn' onClick={() => handleMenuItemClick('/scan-qr')}><i className="fa fa-camera"></i> Scan QR Code</li>
                            <li className='btn' onClick={() => handleMenuItemClick('/createportfolio')}><i className="fa fa-briefcase"></i> Create New Portfolio</li>
                            <li className='btn' onClick={() => handleMenuItemClick('/logout')}><i className="fa fa-sign-out"></i> Sign Out</li>
                        </ul>
                        <div className="menu-footer">
                            <img 
                                src="/logo.png" 
                                alt="ICA Logo" 
                                className="img-fluid"
                            />
                            <p>ITALIAN WOOD FINISHES</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Head;
