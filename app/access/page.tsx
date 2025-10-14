'use client';

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, ShieldBan, Calendar, ExternalLink, Download } from "lucide-react";
import { useFetchAccesBloques } from "@/hooks/useFetchAccesBloques";
import { AccessDetailsDialog } from "@/components/access-details-dialog";
import { AccesBloque } from "@/type";

export default function AccessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AccesBloque | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const { accesBlockes, loading, error, refetch } = useFetchAccesBloques();

  // Filtrage des accès bloqués
  const filteredLogs = accesBlockes.filter((acces) =>
    acces.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouper par URL pour avoir des statistiques
  const groupedByUrl = filteredLogs.reduce((acc, acces) => {
    if (!acc[acces.url]) {
      acc[acces.url] = [];
    }
    acc[acces.url].push(acces);
    return acc;
  }, {} as Record<string, AccesBloque[]>);

  const handleDetailsClick = (log: AccesBloque) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'URL', 'Date'],
      ...accesBlockes.map(acces => [
        acces.id,
        acces.url,
        new Date(acces.date).toLocaleString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acces-bloques-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Accès Bloqués
          </h1>
          <p className="text-muted-foreground">
            Historique des tentatives d'accès aux sites bloqués
          </p>
        </div>

        {/* Statistiques rapides
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldBan className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-muted-foreground">
                Total d'accès bloqués
              </p>
            </div>
            <p className="text-3xl font-bold">{accesBlockes.length}</p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-medium text-muted-foreground">
                Sites uniques
              </p>
            </div>
            <p className="text-3xl font-bold">
              {Object.keys(groupedByUrl).length}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <p className="text-sm font-medium text-muted-foreground">
                Dernier blocage
              </p>
            </div>
            <p className="text-sm font-medium">
              {accesBlockes.length > 0
                ? new Date(accesBlockes[0].date).toLocaleDateString('fr-FR')
                : 'Aucun'}
            </p>
          </div>
        </div> */}

        {/* Barre de recherche */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par URL..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleExport} disabled={accesBlockes.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Gestion du loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Chargement des accès bloqués...</p>
            </div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
            <p className="text-red-800">Erreur: {error}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="mt-2">
              Réessayer
            </Button>
          </div>
        )}

        {/* Tableau des accès bloqués */}
        {!loading && !error && (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      URL Bloquée
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      Date & Heure
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      Occurrences
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        {searchQuery ? "Aucun résultat trouvé" : "Aucun accès bloqué"}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((acces) => (
                      <tr
                        key={acces.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                          #{acces.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ShieldBan className="h-4 w-4 text-red-500" />
                            <span className="font-mono font-medium">{acces.url}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(acces.date).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary">
                            {groupedByUrl[acces.url]?.length || 1} fois
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDetailsClick(acces)}>
                            Détails
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AccessDetailsDialog log={selectedLog} open={detailsOpen} onOpenChange={setDetailsOpen} />

        {/* Vue groupée par site - Optionnel, peut être masqué */}
        {!loading && !error && filteredLogs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Vue groupée par site</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedByUrl).map(([url, accesses]) => (
                <div key={url} className="rounded-lg border bg-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldBan className="h-5 w-5 text-red-500" />
                      <h3 className="font-mono font-medium text-sm">{url}</h3>
                    </div>
                    <Badge variant="destructive">{accesses.length}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dernier blocage:{' '}
                    {new Date(accesses[0].date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}