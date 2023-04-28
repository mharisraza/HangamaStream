import Link from 'next/link'

const Navbar = () => {
    return (<>
    <nav className="navbar navbar-expand-lg navbar-dark shadow">
  <Link href="/" className="navbar-brand font-weight-bold">HangamaStream</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarText">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item active">
        <Link className="nav-link btn btn-primary mb-2 p-2" href="/login">Sign In <i className="fas fa-sign-in"></i></Link>
      </li>
    </ul>
  </div>
</nav>
    </>);
}

export default Navbar;