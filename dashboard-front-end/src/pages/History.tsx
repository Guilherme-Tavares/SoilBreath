import { Clock } from "lucide-react";

const History = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-sm opacity-90 mt-1">Acompanhe as mudanças nos nutrientes</p>
      </div>

      {/* Content */}
      <div className="px-6 mt-12 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Em Desenvolvimento
        </h2>
        
        <p className="text-sm text-muted-foreground max-w-sm">
          O histórico de alterações dos nutrientes ainda não está disponível. 
          Em breve você poderá acompanhar a evolução da qualidade do solo ao longo do tempo.
        </p>
      </div>
    </div>
  );
};

export default History;
