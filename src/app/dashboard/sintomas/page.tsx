'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Activity, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Sparkles,
  Save,
  BarChart3
} from 'lucide-react';
import { analyzePregnancySymptoms } from '@/ai/flows/analyze-pregnancy-symptoms';

const symptomCategories = [
  { id: 'nausea', label: 'Náusea', icon: '🤢', color: 'bg-green-100' },
  { id: 'fatigue', label: 'Fadiga', icon: '😴', color: 'bg-blue-100' },
  { id: 'headache', label: 'Dor de Cabeça', icon: '🤕', color: 'bg-purple-100' },
  { id: 'backPain', label: 'Dor nas Costas', icon: '🔙', color: 'bg-orange-100' },
  { id: 'moodSwings', label: 'Oscilações de Humor', icon: '😢', color: 'bg-pink-100' },
  { id: 'cramping', label: 'Cólicas', icon: '😣', color: 'bg-red-100' },
  { id: 'swelling', label: 'Inchaço', icon: '🦶', color: 'bg-indigo-100' },
];

export default function SintomasPage() {
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const currentWeek = 7; // Mock data - would come from user profile

  const handleSymptomChange = (symptomId: string, value: number[]) => {
    setSymptoms(prev => ({
      ...prev,
      [symptomId]: value[0],
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePregnancySymptoms({
        week: currentWeek,
        symptoms: symptoms,
        notes: notes || undefined,
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    }
    setIsAnalyzing(false);
  };

  const handleSave = () => {
    // In production, save to Firebase
    console.log('Saving symptoms:', { symptoms, notes, date: new Date().toISOString() });
    alert('Sintomas salvos com sucesso!');
  };

  const urgencyColors: Record<string, string> = {
    normal: 'bg-green-100 text-green-800',
    monitor: 'bg-yellow-100 text-yellow-800',
    'consult-doctor': 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const urgencyLabels: Record<string, string> = {
    normal: 'Normal',
    monitor: 'Monitorar',
    'consult-doctor': 'Consultar médico',
    urgent: 'Urgente',
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Registro de Sintomas
        </h1>
        <p className="text-muted-foreground">
          Acompanhe como você está se sentindo - Semana {currentWeek}
        </p>
      </div>

      {/* Symptom Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Como você está se sentindo hoje?
          </CardTitle>
          <CardDescription>
            Deslize para avaliar cada sintoma de 1 (leve) a 5 (intenso)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {symptomCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center text-lg`}>
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.label}</span>
                </div>
                {symptoms[category.id] && (
                  <Badge variant="secondary">{symptoms[category.id]}/5</Badge>
                )}
              </div>
              <Slider
                value={[symptoms[category.id] || 0]}
                onValueChange={(value) => handleSymptomChange(category.id, value)}
                max={5}
                step={1}
                className="w-full"
              />
            </div>
          ))}

          <div className="space-y-2 pt-4 border-t">
            <label className="font-medium text-sm">Observações adicionais</label>
            <Textarea
              placeholder="Descreva outros sintomas ou detalhes importantes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={handleSave}
          className="w-full"
          variant="outline"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Registro
        </Button>
        <Button 
          onClick={handleAnalyze}
          className="w-full"
          disabled={isAnalyzing || Object.keys(symptoms).length === 0}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
        </Button>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Análise da NathIA
              </CardTitle>
              <Badge className={urgencyColors[analysis.urgencyLevel]}>
                {urgencyLabels[analysis.urgencyLevel]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Análise</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {analysis.analysis}
              </p>
            </div>

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Recomendações</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">✓</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-accent p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Mensagem de apoio</h3>
                  <p className="text-sm text-muted-foreground">{analysis.reassurance}</p>
                </div>
              </div>
            </div>

            {analysis.relatedTips && analysis.relatedTips.length > 0 && (
              <div className="bg-white/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Dicas relacionadas</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.relatedTips.map((tip: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tip}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Histórico de Sintomas
          </CardTitle>
          <CardDescription>
            Acompanhe a evolução dos seus sintomas ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Comece registrando seus sintomas para ver o histórico</p>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <TrendingUp className="mr-2 h-4 w-4" />
            Ver Relatório Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
