export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] text-center px-6">
      <div>
        <h1 className="serif text-3xl font-light mb-3">Not authorized</h1>
        <p className="text-[#1E1E1E]/60">Your account isn't set up as an admin for Noble Furniture Gallery. Contact the site owner if this is a mistake.</p>
      </div>
    </div>
  );
}