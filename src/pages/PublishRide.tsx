import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Car, MapPin, Clock, Users } from "lucide-react";

const PublishRide = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    departure_city: '',
    arrival_city: '',
    departure_address: '',
    arrival_address: '',
    departure_date: '',
    departure_time: '',
    total_seats: 1,
    price_per_seat: '',
    car_model: '',
    car_color: '',
    description: '',
    instant_booking: false,
    smoking_allowed: false,
    pets_allowed: false,
    max_two_back: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('rides')
        .insert({
          ...formData,
          driver_id: user.id,
          available_seats: formData.total_seats,
          price_per_seat: parseFloat(formData.price_per_seat)
        });

      if (error) throw error;

      toast({
        title: "Ride published successfully!",
        description: "Your ride is now available for booking.",
      });
      
      navigate('/trips');
    } catch (error: any) {
      toast({
        title: "Error publishing ride",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthClick={() => navigate('/auth')} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to homepage
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Publish a ride</h1>
          <p className="text-muted-foreground">
            Share your journey and help fellow travelers reach their destination.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Route Details */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Route details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="departure_city">Departure city *</Label>
                <Input
                  id="departure_city"
                  placeholder="e.g., Paris"
                  value={formData.departure_city}
                  onChange={(e) => handleInputChange('departure_city', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="arrival_city">Arrival city *</Label>
                <Input
                  id="arrival_city"
                  placeholder="e.g., Lyon"
                  value={formData.arrival_city}
                  onChange={(e) => handleInputChange('arrival_city', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="departure_address">Departure address</Label>
                <Input
                  id="departure_address"
                  placeholder="Specific pickup location"
                  value={formData.departure_address}
                  onChange={(e) => handleInputChange('departure_address', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="arrival_address">Arrival address</Label>
                <Input
                  id="arrival_address"
                  placeholder="Specific drop-off location"
                  value={formData.arrival_address}
                  onChange={(e) => handleInputChange('arrival_address', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Date & Time */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Date & time</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="departure_date">Departure date *</Label>
                <Input
                  id="departure_date"
                  type="date"
                  value={formData.departure_date}
                  onChange={(e) => handleInputChange('departure_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="departure_time">Departure time *</Label>
                <Input
                  id="departure_time"
                  type="time"
                  value={formData.departure_time}
                  onChange={(e) => handleInputChange('departure_time', e.target.value)}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Passengers & Price */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Passengers & price</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="total_seats">Total seats available *</Label>
                <Select 
                  value={formData.total_seats.toString()} 
                  onValueChange={(value) => handleInputChange('total_seats', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price_per_seat">Price per seat (€) *</Label>
                <Input
                  id="price_per_seat"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.price_per_seat}
                  onChange={(e) => handleInputChange('price_per_seat', e.target.value)}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Vehicle Details */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Vehicle details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="car_model">Car model</Label>
                <Input
                  id="car_model"
                  placeholder="e.g., Peugeot 308"
                  value={formData.car_model}
                  onChange={(e) => handleInputChange('car_model', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="car_color">Car color</Label>
                <Input
                  id="car_color"
                  placeholder="e.g., White"
                  value={formData.car_color}
                  onChange={(e) => handleInputChange('car_color', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description">Trip description</Label>
              <Textarea
                id="description"
                placeholder="Add any additional details about your trip..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Travel preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instant_booking"
                  checked={formData.instant_booking}
                  onCheckedChange={(checked) => handleInputChange('instant_booking', checked)}
                />
                <Label htmlFor="instant_booking" className="text-sm font-normal">
                  Instant booking (passengers can book instantly)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smoking_allowed"
                  checked={formData.smoking_allowed}
                  onCheckedChange={(checked) => handleInputChange('smoking_allowed', checked)}
                />
                <Label htmlFor="smoking_allowed" className="text-sm font-normal">
                  Smoking allowed
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets_allowed"
                  checked={formData.pets_allowed}
                  onCheckedChange={(checked) => handleInputChange('pets_allowed', checked)}
                />
                <Label htmlFor="pets_allowed" className="text-sm font-normal">
                  Pets allowed
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="max_two_back"
                  checked={formData.max_two_back}
                  onCheckedChange={(checked) => handleInputChange('max_two_back', checked)}
                />
                <Label htmlFor="max_two_back" className="text-sm font-normal">
                  Maximum 2 people in the back
                </Label>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="cta" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Publishing..." : "Publish ride"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishRide;