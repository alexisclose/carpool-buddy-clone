import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle, Menu, X, Car, MessageCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user?: any;
  onAuthClick: () => void;
}

export const Header = ({ user, onAuthClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">CarpoolBuddy</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => navigate("/search")}
            >
              Search rides
            </button>
            <button 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => navigate("/publish")}
            >
              Publish a ride
            </button>
            {user && (
              <>
                <button 
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  onClick={() => navigate("/trips")}
                >
                  <Calendar className="w-4 h-4" />
                  My trips
                </button>
                <button 
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  onClick={() => navigate("/messages")}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </button>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2"
                >
                  <UserCircle className="w-5 h-5" />
                  {user.email?.split('@')[0]}
                </Button>
              </div>
            ) : (
              <Button onClick={onAuthClick} variant="cta">
                Sign in
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <button 
                className="text-left text-foreground hover:text-primary transition-colors"
                onClick={() => {
                  navigate("/search");
                  setIsMenuOpen(false);
                }}
              >
                Search rides
              </button>
              <button 
                className="text-left text-foreground hover:text-primary transition-colors"
                onClick={() => {
                  navigate("/publish");
                  setIsMenuOpen(false);
                }}
              >
                Publish a ride
              </button>
              {user ? (
                <>
                  <button 
                    className="text-left text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      navigate("/trips");
                      setIsMenuOpen(false);
                    }}
                  >
                    My trips
                  </button>
                  <button 
                    className="text-left text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      navigate("/messages");
                      setIsMenuOpen(false);
                    }}
                  >
                    Messages
                  </button>
                  <button 
                    className="text-left text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    onAuthClick();
                    setIsMenuOpen(false);
                  }} 
                  variant="cta" 
                  className="w-full"
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};