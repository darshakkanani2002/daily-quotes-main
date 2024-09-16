import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Button } from 'react-bootstrap';
import './Sidebar.css';

export default function Sidebar() {
    const [show, setShow] = useState(false);
    const [activeMenu, setActiveMenu] = useState(() => {
        return sessionStorage.getItem('activeMenu') || 'language';
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        sessionStorage.setItem('activeMenu', menu); // Save the active menu to localStorage
        handleClose(); // Close the offcanvas when an item is selected
    };

    return (
        <div>
            <>
                <Button variant="primary" onClick={handleShow} className="mb-3 d-md-none sidebar-toggel-button">
                    <i className="fa-solid fa-bars"></i>
                </Button>

                <div className="sidebar d-none sidebar-menu-display">
                    <h2><img src="/images/fav-icon.png" alt="fav-icon" className='img-fluid' /><span className='h5 fw-bold'>Daily Quates</span></h2>
                    <ul className="side-menu">
                        <li className={`my-2 ${activeMenu === 'language' ? 'active' : ''}`}>
                            <Link to="/" className='nav-link active' onClick={() => handleMenuClick('language')}>
                                <i className="fa-solid fa-language me-3 sidebar-icon"></i>Language
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'category' ? 'active' : ''}`}>
                            <Link to="/category" className='nav-link' onClick={() => handleMenuClick('category')}>
                                {/* <i className="fa-solid fa-signs-post me-3 sidebar-icon"></i> */}
                                <i className="fa-solid fa-layer-group me-3 sidebar-icon"></i>Category
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'post' ? 'active' : ''}`}>
                            <Link to="/post" className='nav-link' onClick={() => handleMenuClick('post')}>
                                <i className="fa-solid fa-signs-post me-3 sidebar-icon"></i>
                                Post
                            </Link>
                        </li>
                    </ul>
                </div>

                <Offcanvas show={show} onHide={handleClose} className="d-md-none">
                    <Offcanvas.Header closeButton>
                        <h2>Daily Quates</h2>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ul className="side-menu">
                            <li className={`my-3 ${activeMenu === 'language' ? 'active' : ''}`}>
                                <Link to="/" className='nav-link' onClick={() => handleMenuClick('language')}>
                                    Language
                                </Link>
                            </li>
                            <li className={`my-3 ${activeMenu === 'category' ? 'active' : ''}`}>
                                <Link to="/category" className='nav-link' onClick={() => handleMenuClick('category')}>
                                    Category
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'post' ? 'active' : ''}`}>
                                <Link to="/post" className='nav-link' onClick={() => handleMenuClick('post')}>
                                    Post
                                </Link>
                            </li>
                        </ul>
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        </div>
    )
}
