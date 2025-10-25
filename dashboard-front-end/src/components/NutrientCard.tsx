interface Nutrient {
  symbol: string;
  name: string;
  description: string;
  current: number;
  min: number;
  max: number;
  unit: string;
}

interface NutrientCardProps {
  nutrient: Nutrient;
}

export const NutrientCard = ({ nutrient }: NutrientCardProps) => {
  const percentage = ((nutrient.current - nutrient.min) / (nutrient.max - nutrient.min)) * 100;
  const isOptimal = nutrient.current >= nutrient.min && nutrient.current <= nutrient.max;

  const getStatusColor = () => {
    if (isOptimal) return "bg-[hsl(var(--success))]";
    return "bg-[hsl(var(--warning))]";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Symbol Circle */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{nutrient.symbol}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{nutrient.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{nutrient.description}</p>
          
          {/* Value and Range */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {nutrient.current}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {nutrient.unit}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Faixa adequada: {nutrient.min}–{nutrient.max}
              </p>
            </div>
            
            {/* Status Indicator */}
            <div className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
              <span className="text-xs font-medium text-white">
                {isOptimal ? "Ideal" : "Atenção"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getStatusColor()}`}
              style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
