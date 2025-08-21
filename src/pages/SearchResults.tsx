import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { RideCard } from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search } from "lucide-react";

interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

const SearchResults = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState<SearchParams>({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
    passengers: parseInt(searchParams.get('passengers') || '1')
  });

  useEffect(() => {
    if (searchCriteria.from && searchCriteria.to) {
      searchRides();
    }
  }, [searchCriteria]);

  const searchRides = async () => {
    setIsLoading(true);
    try {
      let query = supabase
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
        .gte('available_seats', searchCriteria.passengers);

      // Filter by cities (case-insensitive partial match)
      if (searchCriteria.from) {
        query = query.ilike('departure_city', `%${searchCriteria.from}%`);
      }
      
      if (searchCriteria.to) {
        query = query.ilike('arrival_city', `%${searchCriteria.to}%`);
      }
      
      // Filter by date
      if (searchCriteria.date) {
        query = query.eq('departure_date', searchCriteria.date);
      } else {
        // If no date specified, show rides from today onwards
        query = query.gte('departure_date', new Date().toISOString().split('T')[0]);
      }

      const { data, error } = await query.order('departure_date', { ascending: true });

      if (error) throw error;
      setRides(data || []);
    } catch (error: any) {
      console.error('Error searching rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = (params: SearchParams) => {
    setSearchCriteria(params);
    const newSearchParams = new URLSearchParams({
      from: params.from,
      to: params.to,
      date: params.date,
      passengers: params.passengers.toString(),
    });
    navigate(`/search?${newSearchParams.toString()}`, { replace: true });
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
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <SearchForm 
            onSearch={handleNewSearch}
            initialValues={searchCriteria}
            variant="compact"
          />
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (future enhancement) */}
          <div className="lg:col-span-1">
            {/* Filters will be added here in future */}
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-bold">
                  {searchCriteria.from} → {searchCriteria.to}
                </h1>
              </div>
              {!isLoading && (
                <p className="text-muted-foreground">
                  {rides.length} ride{rides.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : rides.length > 0 ? (
              <div className="space-y-4">
                {rides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No rides found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or check back later for new rides.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/publish')}
                  >
                    Publish a ride instead
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;