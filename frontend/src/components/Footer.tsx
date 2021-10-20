import { LogoutLink } from './Link'
import User from '../types/Users'
import './footer.css'

interface FooterProps {
    name: string;
}

const Footer = ({ name }: FooterProps) => {
    return (
        <footer className="container">
            <div className="row justify-content-end">
                <div className="col">
                    <LogoutLink name={name}/>
                </div>
            </div>
        </footer>
    )
}

export default Footer;