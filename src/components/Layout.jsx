export default function Layout(props) {
  const { children } = props;
  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFIENDICT</h1>
        <p>For coffee Insatiates</p>
      </div>
      <button>
        <p>Sign up free</p>
        <i class="fa-solid fa-mug-hot"></i>
      </button>
    </header>
  );
  const footer = <footer>
    <p><span className="text-gradient">CAFFIENDICT</span> was made by <a href="#">Arshal Rejith S</a></p>
  </footer>;
  
  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
