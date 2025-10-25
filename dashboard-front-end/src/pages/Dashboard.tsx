import { Droplets, ThermometerSun } from "lucide-react";
import { RadialProgress } from "@/components/RadialProgress";
import { NutrientCard } from "@/components/NutrientCard";

const Dashboard = () => {
  // Mock data
  const soilAptitude = 86;
  const cropType = "Trigo";
  const humidity = 65;
  const temperature = 24;
  
  const nutrients = [
    {
      symbol: "N",
      name: "Nitrogênio",
      description: "Essencial para crescimento vegetativo",
      current: 45,
      min: 40,
      max: 60,
      unit: "mg/kg"
    },
    {
      symbol: "P",
      name: "Fósforo",
      description: "Importante para raízes e floração",
      current: 28,
      min: 25,
      max: 45,
      unit: "mg/kg"
    },
    {
      symbol: "K",
      name: "Potássio",
      description: "Fortalece resistência da planta",
      current: 180,
      min: 150,
      max: 250,
      unit: "mg/kg"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-12 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Análise de Solo</h1>
        <p className="text-sm opacity-90">Cultivo: {cropType}</p>
      </div>

      {/* Radial Progress Card */}
      <div className="px-6 -mt-8">
        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <div className="flex flex-col items-center">
            <RadialProgress value={soilAptitude} size={180} strokeWidth={12} />
            <h2 className="text-lg font-semibold mt-4 text-card-foreground">Aptidão do Solo</h2>
            <p className="text-sm text-muted-foreground">Para cultivo de {cropType}</p>
          </div>

          {/* Environmental Data */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 bg-secondary rounded-xl p-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Umidade</p>
                <p className="text-lg font-semibold text-foreground">{humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-secondary rounded-xl p-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ThermometerSun className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temperatura</p>
                <p className="text-lg font-semibold text-foreground">{temperature}°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrients Section */}
      <div className="px-6 mt-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">Nutrientes</h2>
        <div className="space-y-4">
          {nutrients.map((nutrient) => (
            <NutrientCard key={nutrient.symbol} nutrient={nutrient} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
