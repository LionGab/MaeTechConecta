import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Matches() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-background">
      <StyledText className="text-xl font-headline text-foreground">Tela de Conexões (Matches)</StyledText>
    