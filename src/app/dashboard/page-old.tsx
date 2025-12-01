'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { relatorioService } from '@/services/relatorio.service'
import { Package, Trash2, AlertTriangle, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKPIs()
  }, [])

  const loadKPIs = async () => {
    try {
      const data = await relatorioService.getDashboardKPIs()
      setKpis(data)
    } catch (error) {
      console.error('Erro ao carregar KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema</p>
      </div>

      {/* KPIs de Bombonas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Bombonas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bombonas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.bombonas?.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Bombonas ativas no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Necessitam Coleta</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {kpis?.bombonas?.necessitam_coleta || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis?.bombonas?.cheias || 0} cheias • {kpis?.bombonas?.quase_cheias || 0} quase cheias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Armazenado</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpis?.bombonas?.peso_total_armazenado?.toFixed(2) || 0} kg
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total em todas as bombonas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Abertos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {kpis?.alertas?.abertos || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis?.alertas?.criticos || 0} críticos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPIs de Coletas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Coletas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.coletas?.pendentes || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Coletas aguardando realização</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas este Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {kpis?.coletas?.concluidas_mes || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mês atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Coletado no Mês</CardTitle>
              <Trash2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {kpis?.coletas?.peso_coletado_mes?.toFixed(2) || 0} kg
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total coletado</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Sistema IoWaste</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Sistema de Gestão Inteligente de Resíduos com simulação IoT. Monitore bombonas em tempo real,
            receba alertas automáticos e gerencie coletas de forma eficiente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
