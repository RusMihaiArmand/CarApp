import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="Navbar">

            <h1>MENU</h1>

            <br></br>

            <div>

                <Link to="/" className="navLink">Home</Link>
                <br></br>
                <Link to="/command" className="navLink">Command</Link>
                
            </div>
    

        </nav>
    );
}

export default Navbar;