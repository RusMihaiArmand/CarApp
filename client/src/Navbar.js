import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="Navbar">

            <h1>MENU</h1>

            <div>

                <Link to="/">Home</Link>
                <br></br>
                <Link to="/command">Command</Link>
                
            </div>
    

        </nav>
    );
}

export default Navbar;