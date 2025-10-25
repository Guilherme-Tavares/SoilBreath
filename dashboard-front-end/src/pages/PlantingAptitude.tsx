import { RadialProgress } from "@/components/RadialProgress";

interface Crop {
  name: string;
  aptitude: number;
  icon: string;
}

const PlantingAptitude = () => {
  const crops: Crop[] = [
    { name: "Trigo", aptitude: 86, icon: "🌾" },
    { name: "Milho", aptitude: 78, icon: "🌽" },
    { name: "Soja", aptitude: 72, icon: "🫘" },
    { name: "Arroz", aptitude: 65, icon: "🌾" },
    { name: "Feijão", aptitude: 58, icon: "🫘" },
    { name: "Algodão", aptitude: 45, icon: "☁️" },
  ];

  const getColorClass = (value: number) => {
    if (value >= 75) return "text-[hsl(var(--success))]";
    if (value >= 50) return "text-[hsl(var(--warning))]";
    return "text-[hsl(var(--destructive))]";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Aptidão dos Plantios</h1>
        <p className="text-sm opacity-90 mt-1">Compatibilidade do solo com diferentes cultivos</p>
      </div>

      {/* Crops List */}
      <div className="px-6 mt-6 space-y-4">
        {crops.map((crop) => (
          <div 
            key={crop.name}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                {crop.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{crop.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Aptidão do solo para este cultivo
                </p>
              </div>

              {/* Mini Progress */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg width="64" height="64" className="transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="6"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke={
                        crop.aptitude >= 75 
                          ? "hsl(var(--success))" 
                          : crop.aptitude >= 50 
                          ? "hsl(var(--warning))" 
                          : "hsl(var(--destructive))"
                      }
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - crop.aptitude / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm font-bold ${getColorClass(crop.aptitude)}`}>
                      {crop.aptitude}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantingAptitude;
