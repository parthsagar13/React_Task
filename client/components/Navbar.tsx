import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition"
          >
            <img
              src="https://cdn.builder.io/o/assets%2Faaf2fc6ee0af440db01ff41c78de501a%2F3bb902667cd94dfbb61f18770919f280?alt=media&token=611af89f-e41d-4ffa-b9f6-3b2573f8bd24&apiKey=aaf2fc6ee0af440db01ff41c78de501a"
              alt="Logo"
              className="h-10 w-auto"
            />
            <span className="hidden sm:inline text-gray-900">CoffeeHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-4 border-l pl-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Welcome</span>
                    <span className="font-semibold text-gray-900">
                      {user?.username}
                    </span>
                  </div>
                  <Link to="/products">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Products
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <div className="px-2 py-2 border-b">
                  <p className="text-sm text-gray-600">Welcome back</p>
                  <p className="font-semibold text-gray-900">{user?.username}</p>
                </div>
                <Link to="/products">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Products
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
