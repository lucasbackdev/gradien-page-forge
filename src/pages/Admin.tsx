import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Users, Crown, LogOut, ArrowLeft, Calendar, Shield } from "lucide-react";
import { format, addDays, addMonths, addYears } from "date-fns";
import { ptBR } from "date-fns/locale";

type SubscriptionType = "free_trial" | "monthly" | "annual" | "lifetime";
type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

interface UserWithSubscription {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  subscription: {
    id: string;
    subscription_type: SubscriptionType;
    status: SubscriptionStatus;
    starts_at: string | null;
    expires_at: string | null;
    notes: string | null;
  } | null;
}

const subscriptionLabels: Record<SubscriptionType, string> = {
  free_trial: "Teste Grátis",
  monthly: "Mensal",
  annual: "Anual",
  lifetime: "Vitalício",
};

const statusLabels: Record<SubscriptionStatus, string> = {
  active: "Ativo",
  expired: "Expirado",
  cancelled: "Cancelado",
  pending: "Pendente",
};

const statusColors: Record<SubscriptionStatus, string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  expired: "bg-red-500/20 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Verificar se é admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    await loadUsers();
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("*");

    const usersWithSubs = profiles.map((profile) => ({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      created_at: profile.created_at,
      subscription: subscriptions?.find((s) => s.user_id === profile.id) || null,
    }));

    setUsers(usersWithSubs);
  };

  const updateSubscription = async (
    userId: string,
    type: SubscriptionType,
    status: SubscriptionStatus
  ) => {
    setUpdating(userId);

    let expiresAt: string | null = null;
    const startsAt = new Date().toISOString();

    if (status === "active") {
      switch (type) {
        case "free_trial":
          expiresAt = addDays(new Date(), 7).toISOString();
          break;
        case "monthly":
          expiresAt = addMonths(new Date(), 1).toISOString();
          break;
        case "annual":
          expiresAt = addYears(new Date(), 1).toISOString();
          break;
        case "lifetime":
          expiresAt = null;
          break;
      }
    }

    const { error } = await supabase
      .from("subscriptions")
      .update({
        subscription_type: type,
        status,
        starts_at: startsAt,
        expires_at: expiresAt,
      })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Erro ao atualizar assinatura",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Assinatura atualizada!",
        description: `Plano alterado para ${subscriptionLabels[type]}`,
      });
      await loadUsers();
    }

    setUpdating(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Painel Admin</h1>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Usuários</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {users.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ativos</CardDescription>
              <CardTitle className="text-3xl text-green-400">
                {users.filter((u) => u.subscription?.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Vitalícios</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-400" />
                {users.filter((u) => u.subscription?.subscription_type === "lifetime").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Expirados</CardDescription>
              <CardTitle className="text-3xl text-red-400">
                {users.filter((u) => u.subscription?.status === "expired").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>
              Gerencie as assinaturas e acessos dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.full_name || "Sem nome"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.subscription?.subscription_type || "free_trial"}
                        onValueChange={(value) =>
                          updateSubscription(
                            user.id,
                            value as SubscriptionType,
                            user.subscription?.status || "active"
                          )
                        }
                        disabled={updating === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free_trial">Teste Grátis</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="annual">Anual</SelectItem>
                          <SelectItem value="lifetime">Vitalício</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.subscription?.status || "pending"}
                        onValueChange={(value) =>
                          updateSubscription(
                            user.id,
                            user.subscription?.subscription_type || "free_trial",
                            value as SubscriptionStatus
                          )
                        }
                        disabled={updating === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="expired">Expirado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.subscription?.expires_at ? (
                        <span className="text-sm">
                          {format(new Date(user.subscription.expires_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      ) : user.subscription?.subscription_type === "lifetime" ? (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Crown className="h-3 w-3 mr-1" />
                          Nunca
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {updating === user.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
