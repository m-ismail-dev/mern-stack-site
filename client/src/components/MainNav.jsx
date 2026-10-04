function MainNav() {
  return (
    <nav className="flex justify-between items-center gap-5 w-full max-w-7xl mx-auto px-3 py-3 text-xl font-semibold border-b border-emerald-950">
      <div>Logo</div>
      <div className="flex gap-16">
        <p>About</p>
        <p>Services</p>
        <div>User</div>
      </div>
    </nav>
  );
}

export default MainNav;
