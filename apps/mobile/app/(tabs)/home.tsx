import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Home() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-background p-4">
      <StyledText className="text-2xl font-headline text-primary text-center">Bem-vinda à Nossa Maternidade</StyledText>
      <StyledText className="mt-4 text-lg text-muted-foreground text-center">Este é o início da sua jornada no novo aplicativo nativo!</StyledText>
    </StyledView>
  );
}