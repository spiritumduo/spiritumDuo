import { useState } from 'react';
import { Link, Redirect } from "react-router-dom";

import './header.css';
import { PathwaySelector } from './PathwaySelector';
import { useHistory } from 'react-router';

interface HeaderProps {
	user?: {};
}

export const Header = ({user}: HeaderProps) => {
	const history=useHistory();
	return(
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<form className="d-flex" onSubmit={e=>{e.preventDefault(); history.push("/patient/"+(e.target as any)[0].value);}}> {/* TODO: replace this with a more robust solution */}
					<input className="form-control me-2" type="search" name="hospitalNumberSearch" placeholder="Hospital number" aria-label="Hospital number" />
				</form>
				
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mb-2">
						<li className="nav-item">
							<Link className="nav-link active" to={"/page/Home"}>Home</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link active" to={"/page/Triage"}>Triage</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link active" to={"/page/Clinic"}>Clinic</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link active" to={"/page/MDT"}>MDT</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link active" to={"/page/Refer"}>Refer</Link>
						</li>
					</ul>
				</div>
				<PathwaySelector options={["Lung cancer", "Bronchieactasis"]} currentOption="Lung cancer" onItemSelect={(data:string)=>console.log(data)}/>
			</div>
		</nav>
	);
};