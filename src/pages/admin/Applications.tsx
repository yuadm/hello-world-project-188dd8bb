import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Users, Clock, CheckCircle, XCircle, Filter, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
  service_type: string;
}

const AdminApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('childminder_applications' as any)
        .select('id, first_name, last_name, email, status, created_at, service_type')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications((data || []) as unknown as Application[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApps(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      pending: { 
        label: "Pending Review", 
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        icon: Clock
      },
      approved: { 
        label: "Approved", 
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        icon: CheckCircle
      },
      rejected: { 
        label: "Rejected", 
        className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        icon: XCircle
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`rounded-full px-3 py-1.5 text-xs font-medium border ${config.className} flex items-center gap-1.5 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="h-9 w-64 bg-muted/50 rounded-lg animate-shimmer" />
            <div className="h-5 w-96 bg-muted/30 rounded-lg animate-shimmer" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 w-20 bg-muted/50 rounded animate-shimmer" />
                    <div className="h-10 w-10 bg-muted/30 rounded-xl animate-shimmer" />
                  </div>
                  <div className="h-8 w-16 bg-muted/50 rounded animate-shimmer" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Applications List Skeleton */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-muted/30 rounded-lg animate-shimmer" />
                <div className="w-40 h-10 bg-muted/30 rounded-lg animate-shimmer" />
              </div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted/20 rounded-lg animate-shimmer" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const stats = getStats();

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Applications
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and manage childminder applications
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-gradient-to-br from-amber-500/5 to-card hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => setStatusFilter('pending')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-gradient-to-br from-emerald-500/5 to-card hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => setStatusFilter('approved')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Approved</span>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-emerald-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-gradient-to-br from-rose-500/5 to-card hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => setStatusFilter('rejected')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Rejected</span>
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <XCircle className="h-5 w-5 text-rose-600" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-rose-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/40 focus:bg-background transition-colors"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Grid */}
            <div className="space-y-3">
              {filteredApps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No applications found</p>
                </div>
              ) : (
                filteredApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/admin/applications/${app.id}`)}
                    className="group p-4 rounded-lg border border-border/40 bg-gradient-to-r from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {app.first_name} {app.last_name}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="font-medium">Email:</span>
                            <span className="truncate">{app.email}</span>
                          </span>
                          <span className="hidden sm:inline text-border">•</span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(app.created_at), "MMM dd, yyyy")}
                          </span>
                          {app.service_type && (
                            <>
                              <span className="hidden sm:inline text-border">•</span>
                              <span>{app.service_type}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/applications/${app.id}`);
                        }}
                        className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
