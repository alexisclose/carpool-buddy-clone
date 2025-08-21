import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { RideCard } from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Zap, Heart, MapPin, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/carpooling-hero.jpg";

interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [recentRides, setRecentRides] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentRides();
  }, []);

  const fetchRecentRides = async () => {
    try {
      const { data: rides, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:profiles!driver_id(
            first_name,
            last_name,
            rating,
            total_trips,
            profile_image_url
          )
        `)
        .eq('status', 'active')
        .gte('departure_date', new Date().toISOString().split('T')[0])
        .order('departure_date', { ascending: true })
        .limit(6);

      if (error) throw error;
      setRecentRides(rides || []);
    } catch (error: any) {
      console.error('Error fetching rides:', error);
    }
  };

  const handleSearch = (params: SearchParams) => {
    const searchParams = new URLSearchParams({
      from: params.from,
      to: params.to,  
      date: params.date,
      passengers: params.passengers.toString(),
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleAuthClick = () => {
    navigate("/auth");
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

  return (
    <div className="min-h-screen bg-background">      
      {/* Hero Section */}
      <section 
        className="relative py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your pick of rides at
            <span className="text-primary-glow"> low prices</span>
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Share the journey, split the cost. Find rides or offer yours to travel together comfortably and affordably.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <SearchForm onSearch={handleSearch} variant="hero" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why choose CarpoolBuddy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join millions of people using the most trusted carpooling platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Trust & Safety</h3>
              <p className="text-muted-foreground">
                All members are verified with ratings and reviews to ensure safe, reliable rides every time.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book your ride instantly or send a request. Many drivers offer immediate confirmation.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Great Community</h3>
              <p className="text-muted-foreground">
                Meet fellow travelers, share stories, and build connections that go beyond the journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">CarpoolBuddy</span>
          </div>
          <p className="text-muted-foreground mb-8">
            Making travel more social, sustainable, and affordable for everyone.
          </p>
          <Separator className="my-8" />
          <p className="text-muted-foreground">
            © 2024 CarpoolBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
