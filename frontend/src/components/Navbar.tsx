import jwtDecode from 'jwt-decode';
import Image from 'next/image';
import Link from 'next/link'
import { Component, ReactNode } from 'react';
import logo from "../assets/images/logo.png";

class Navbar extends Component {

  state = {
    user: {},
    isLoggedIn: false
  }

  componentDidMount(): void {
    
      const user = localStorage.getItem("user");
      if(user) {
        this.setState({ user: JSON.parse(user) });
        this.setState({ isLoggedIn: true });
      }
  }

  render(): ReactNode {
    return (<>
      <nav className="navbar navbar-expand-lg navbar-dark shadow">
     <div className="container">
       <Link className="navbar-brand fw-bold" href="/">
         <Image height={40} width={200} src={logo} alt="Hangama Logo" />
       </Link>
   
       <div className="d-block d-sm-none d-flex justify-content-between align-items-center">
         <Link href="/login" className="btn btn-primary me-2" type="button">
           Sign in <i className="fas fa-sign-in"></i>
         </Link>
   
         <button
           className="navbar-toggler"
           type="button"
           data-bs-toggle="collapse"
           data-bs-target="#navbarSupportedContent"
           aria-controls="navbarSupportedContent"
           aria-expanded="false"
           aria-label="Toggle navigation"
         >
           <span className="navbar-toggler-icon"></span>
         </button>
       </div>
   
       <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav me-auto mb-2 mb-lg-0">
           <li className="nav-item">
             <Link className="nav-link"  href="/movies">
             <i className="fa-solid fa-film"></i> Movies
             </Link>
           </li>
   
           <li className="nav-item">
             <a className="nav-link" href="/series">
             <i className="fa-solid fa-tv"></i> TV Series
             </a>
           </li>
   
           <li className="nav-item">
             <a className="nav-link" href="/request">
             <i className="fas fa-plus-circle"></i> Requests
             </a>
           </li>
         </ul>
       </div>
   
       <div className="d-none d-sm-block d-flex justify-content-end">
         <Link href="/login" className="btn btn-primary me-2" type="button">
           Sign in <i className="fas fa-sign-in"></i>
         </Link>
         </div>
     </div>
   </nav>
     </>);
  }
}

export default Navbar;