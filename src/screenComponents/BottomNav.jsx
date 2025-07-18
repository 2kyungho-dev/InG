import React from 'react';
import { Navbar, Nav } from "react-bootstrap";
import { HouseFill, Search, PlusCircle, PersonFill, GearFill } from "react-bootstrap-icons";
import { Link } from 'react-router-dom';

export default function BottomNav({onExploreClick}) {
    return (
    <Navbar
      fixed="bottom"
      className="bg-ing-bg-dark border-t border-ing-border-muted py-2 px-3"
    >
      <Nav className="w-100 d-flex justify-content-between">
        
        <Nav.Link
          as={Link}
          to="/"
          className="text-ing-text-muted hover:text-ing-primary text-center flex-fill"
        >
          <HouseFill size={24} className="d-block mx-auto" />
          <div style={{ fontSize: "0.75rem" }}>Home</div>
        </Nav.Link>

        <Nav.Link
          onClick={onExploreClick}
          className="text-ing-text-muted hover:text-ing-primary text-center flex-fill"
        >
          <Search size={24} className="d-block mx-auto" />
          <div style={{ fontSize: "0.75rem" }}>Explore</div>
        </Nav.Link>

        {/* <Nav.Link href="#make" className="text-center flex-fill">
          <PlusCircle size={24} className="d-block mx-auto" />
          <div style={{ fontSize: "0.75rem" }}>Make</div>
        </Nav.Link>

        <Nav.Link href="#profile" className="text-center flex-fill">
          <PersonFill size={24} className="d-block mx-auto" />
          <div style={{ fontSize: "0.75rem" }}>Profile</div>
        </Nav.Link> */}

        <Nav.Link
          as={Link}
          to="/settings"
          className="text-ing-text-muted hover:text-ing-primary text-center flex-fill"
        >
          <GearFill size={24} className="d-block mx-auto" />
          <div style={{ fontSize: "0.75rem" }}>Settings</div>
        </Nav.Link>

      </Nav>
    </Navbar>
    )
}