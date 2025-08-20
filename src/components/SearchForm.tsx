import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CalendarIcon, MapPin, Users, Search } from "lucide-react";
import { format } from "date-fns";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  variant?: "hero" | "compact";
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export const SearchForm = ({ onSearch, variant = "hero" }: SearchFormProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: "",
    to: "",
    date: format(new Date(), "yyyy-MM-dd"),
    passengers: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const heroVariant = variant === "hero";

  return (
    <Card className={`p-6 ${heroVariant ? "shadow-card bg-white/95 backdrop-blur-sm" : ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`grid gap-4 ${heroVariant ? "md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              From
            </label>
            <Input
              placeholder="Departure city"
              value={searchParams.from}
              onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              To
            </label>
            <Input
              placeholder="Destination city"
              value={searchParams.to}
              onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              Date
            </label>
            <Input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Passengers
            </label>
            <select
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ ...searchParams, passengers: Number(e.target.value) })}
              className="h-12 w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} passenger{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Button 
          type="submit" 
          variant={heroVariant ? "hero" : "cta"} 
          size="lg" 
          className={`w-full ${heroVariant ? "h-14 text-lg" : "h-12"}`}
        >
          <Search className="w-5 h-5 mr-2" />
          Search rides
        </Button>
      </form>
    </Card>
  );
};