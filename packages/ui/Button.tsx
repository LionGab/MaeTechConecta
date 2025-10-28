import { Text, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
  onPress: () => void;
  title: string;
}

export function Button({ onPress, title }: ButtonProps) {
  return (
    <StyledTouchableOpacity
      className="bg-primary p-3 rounded-lg items-center"
      onPress={onPress}
    >
      <StyledText className="text-primary-foreground font-bold">{title}</StyledText>
    </StyledTouchableOpacity>
  