import React from 'react';

import { Button } from './Button';
import './header.css';
import { PathwaySelector } from './PathwaySelector';

interface HeaderProps {
	user?: {};
}

export const Header = ({user}: HeaderProps) => (
	<nav className="navbar navbar-expand-lg navbar-light bg-light">
	<div className="container-fluid">
		<form className="d-flex">
			<input className="form-control me-2" type="search" placeholder="Hospital number" aria-label="Hospital number"/>
		</form>
		<div className="collapse navbar-collapse" id="navbarSupportedContent">
			<ul className="navbar-nav mb-2">
				<li className="nav-item">
					<a className="nav-link active" aria-current="page" href="#">Home</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">Triage</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">Clinic</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">MDT</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">Refer</a>
				</li>
			</ul>
		</div>
		<PathwaySelector options={["Lung cancer", "Bronchieactasis"]} onItemSelect={(data:string)=>console.log(data)}/>
	</div>
</nav>
);