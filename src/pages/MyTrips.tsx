import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Car, MapPin, Clock, Users, Calendar, Plus } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

const MyTrips = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [myRides, setMyRides] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      // Fetch rides I'm driving
      const { data: rides, error: ridesError } = await supabase
        .from('rides')
        .select(`
          *,
          bookings(
            id,
            seats_booked,
            status,
            passenger:profiles!passenger_id(
              first_name,
              last_name,
              rating,
              profile_image_url
            )
          )
        `)
        .eq('driver_id', user?.id)
        .order('departure_date', { ascending: false });

      if (ridesError) throw ridesError;

      // Fetch bookings I've made
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          ride:rides(
            *,
            driver:profiles!driver_id(
              first_name,
              last_name,
              rating,
              total_trips,
              profile_image_url
            )
          )
        `)
        .eq('passenger_id', user?.id)
        .order('booking_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      setMyRides(rides || []);
      setMyBookings(bookings || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to homepage
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My trips</h1>
              <p className="text-muted-foreground">
                Manage your rides and bookings.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/publish')}
              variant="cta"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Publish a ride
            </Button>
          </div>
        </div>

        <Tabs defaultValue="driving" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="driving" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Driving ({myRides.length})
            </TabsTrigger>
            <TabsTrigger value="passenger" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Passenger ({myBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="driving" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : myRides.length > 0 ? (
              <div className="space-y-4">
                {myRides.map((ride) => (
                  <Card key={ride.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{ride.departure_city}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium">{ride.arrival_city}</span>
                          </div>
                          <Badge className={getStatusColor(ride.status)}>
                            {ride.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(ride.departure_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(ride.departure_time)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {ride.available_seats}/{ride.total_seats} seats available
                          </div>
                          <div className="font-medium text-primary">
                            €{ride.price_per_seat}/seat
                          </div>
                        </div>
                      </div>
                    </div>

                    {ride.bookings && ride.bookings.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Passengers ({ride.bookings.length})</h4>
                        <div className="space-y-2">
                          {ride.bookings.map((booking: any) => (
                            <div key={booking.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <span className="font-medium">
                                    {booking.passenger?.first_name} {booking.passenger?.last_name}
                                  </span>
                                  <span className="text-muted-foreground ml-2">
                                    • {booking.seats_booked} seat{booking.seats_booked !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No rides published</h3>
                <p className="text-muted-foreground mb-6">
                  Start sharing your journey and help fellow travelers.
                </p>
                <Button onClick={() => navigate('/publish')} variant="cta">
                  Publish your first ride
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="passenger" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : myBookings.length > 0 ? (
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{booking.ride.departure_city}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium">{booking.ride.arrival_city}</span>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(booking.ride.departure_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(booking.ride.departure_time)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {booking.seats_booked} seat{booking.seats_booked !== 1 ? 's' : ''}
                          </div>
                          <div className="font-medium text-primary">
                            €{booking.total_price} total
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Info */}
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Driver</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Car className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium">
                            {booking.ride.driver?.first_name} {booking.ride.driver?.last_name}
                          </span>
                          {booking.ride.driver?.rating && (
                            <span className="text-muted-foreground ml-2">
                              ⭐ {booking.ride.driver.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Search for rides and start your journey.
                </p>
                <Button onClick={() => navigate('/search')} variant="cta">
                  Search rides
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyTrips;