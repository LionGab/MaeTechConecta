'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Activity, Save, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SymptomLevel {
  name: string;
  value: number;
  label: string;
  icon: string;
}

const symptoms = [
  { key: 'nausea', label: 'Náuseas', icon: '🤢' },
  { key: 'fatigue', label: 'Cansaço', icon: '😴' },
  { key: 'backPain', label: 'Dor nas costas', icon: '🔙' },
  { key: 'headache', label: 'Dor de cabeça', icon: '🤕' },
  { key: 'moodSwings', label: 'Oscilação de humor', icon: '😢' },
  { key: 'swelling', label: 'Inchaço', icon: '🫧' },
] as const;

const intensityLabels = ['Nenhum', 'Leve', 'Moderado', 'Forte', 'Intenso'];

export function SymptomTracker() {
  const { toast } = useToast();
  const [symptomLevels, setSymptomLevels] = useState<Record<string, number>>(
    symptoms.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {})
  );
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSymptomChange = (key: string, value: number[]) => {
    setSymptomLevels(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save - in real app, this would save to Firestore
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Sintomas registrados!',
      description: 'Seus sintomas foram salvos com sucesso.',
    });
    
    // Reset form
    setSymptomLevels(symptoms.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {}));
    setNotes('');
    setIsSaving(false);
  };

  const hasAnySymptom = Object.values(symptomLevels).some(v => v > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Tracker de Sintomas
            </CardTitle>
            <CardDescription className="mt-1">
              Registre como você está se sentindo hoje
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Ver histórico
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {symptoms.map((symptom) => (
            <div key={symptom.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base">
                  <span className="text-xl">{symptom.icon}</span>
                  {symptom.label}
                </Label>
                <span className="text-sm font-medium text-primary">
                  {intensityLabels[symptomLevels[symptom.key]]}
                </span>
              </div>
              <Slider
                value={[symptomLevels[symptom.key]]}
                onValueChange={(value) => handleSymptomChange(symptom.key, value)}
                max={4}
                step={1}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Adicione qualquer observação sobre como você está se sentindo..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={!hasAnySymptom || isSaving}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar sintomas'}
          </Button>
          {hasAnySymptom && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSymptomLevels(symptoms.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {}));
                setNotes('');
              }}
            >
              Limpar
            </Button>
          )}
        </div>

        {hasAnySymptom && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Dica:</strong> Registrar seus sintomas regularmente ajuda você e seu médico a acompanhar sua gestação.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
