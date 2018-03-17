import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = ({match}) => (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
        <span className="navbar-brand"><Link to="/"></Link></span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarSupportedContent" className="collapse navbar-collapse flex-row-reverse">
            <ul className="navbar-nav">
                <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
            </ul>
        </div>
    </nav>
)

export default Navbar
