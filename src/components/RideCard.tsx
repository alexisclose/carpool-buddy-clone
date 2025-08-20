import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Clock, 
  User, 
  Star, 
  Car,
  CigaretteOff,
  Heart,
  Users
} from "lucide-react";
import { format } from "date-fns";

interface RideCardProps {
  ride: {
    id: string;
    departure_city: string;
    arrival_city: string;
    departure_date: string;
    departure_time: string;
    price_per_seat: number;
    available_seats: number;
    car_model?: string;
    car_color?: string;
    smoking_allowed: boolean;
    instant_booking: boolean;
    driver: {
      first_name: string;
      last_name: string;
      rating: number;
      total_trips: number;
      profile_image_url?: string;
    };
  };
  onBook?: (rideId: string) => void;
  onViewDetails?: (rideId: string) => void;
}

export const RideCard = ({ ride, onBook, onViewDetails }: RideCardProps) => {
  const departureDate = new Date(`${ride.departure_date}T${ride.departure_time}`);
  
  return (
    <Card className="p-6 hover:shadow-card transition-all duration-300 cursor-pointer">
      <div className="space-y-4">
        {/* Route and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {format(departureDate, "HH:mm")}
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{ride.departure_city}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{ride.arrival_city}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              €{ride.price_per_seat}
            </div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={ride.driver.profile_image_url} />
              <AvatarFallback>
                {ride.driver.first_name[0]}{ride.driver.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {ride.driver.first_name} {ride.driver.last_name[0]}.
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span>{ride.driver.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{ride.driver.total_trips} trips</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {ride.available_seats} seats left
            </Badge>
            {ride.instant_booking && (
              <Badge variant="default" className="bg-success text-success-foreground">
                Instant Book
              </Badge>
            )}
          </div>
        </div>

        {/* Car Info & Preferences */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {ride.car_model && (
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4" />
                <span>{ride.car_model}</span>
                {ride.car_color && <span className="text-xs">({ride.car_color})</span>}
              </div>
            )}
            {!ride.smoking_allowed && (
              <div className="flex items-center gap-1">
                <CigaretteOff className="w-4 h-4" />
                <span>Non-smoking</span>
              </div>
            )}
          </div>
          
          <div className="text-xs">
            {format(new Date(ride.departure_date), "MMM d, yyyy")}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => onViewDetails?.(ride.id)}
          >
            View details
          </Button>
          
          <Button
            variant={ride.instant_booking ? "cta" : "default"}
            onClick={() => onBook?.(ride.id)}
          >
            {ride.instant_booking ? "Book instantly" : "Send request"}
          </Button>
        </div>
      </div>
    </Card>
  );
};