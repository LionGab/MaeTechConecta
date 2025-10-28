import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Index() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-background">
      <StyledText className="text-2xl font-headline text-primary">Nossa Maternidade</StyledText>
      <StyledText className="mt-2 text-muted-foreground">Monorepo com Expo + Turborepo</StyledText>
      <Link href="/(tabs)/home" className="mt-8 text-primary font-bold">Ir para Home</Link>
    </StyledView