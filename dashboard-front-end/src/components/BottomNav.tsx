import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, Sprout, Clock } from "lucide-react";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/planting-aptitude", icon: Sprout, label: "Aptidão" },
    { path: "/", icon: BarChart3, label: "Dashboard" },
    { path: "/history", icon: Clock, label: "Histórico" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isCenter = item.path === "/";

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center transition-all ${
                  isCenter ? "relative -top-2" : ""
                }`}
              >
                <div
                  className={`rounded-2xl p-3 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : "bg-transparent text-muted-foreground hover:bg-secondary"
                  } ${isCenter ? "p-4" : ""}`}
                >
                  <Icon className={`${isCenter ? "w-7 h-7" : "w-6 h-6"}`} />
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
