const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left section */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="text-2xl font-bold">InvoiceFlow</div>

          <p className="mt-2 text-slate-400">
            Simple invoicing for freelancers and small businesses.
          </p>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Get paid faster.
            <br />
            Manage your business better.
          </h1>

          <p className="mt-6 text-slate-400 max-w-md">
            Create professional invoices, track payments, and manage your
            clients from one simple dashboard.
          </p>
        </div>

        <p className="text-sm text-slate-500">© 2026 InvoiceFlow</p>
      </div>

      {/* Right section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
