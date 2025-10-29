import { Tabs } from 'expo-router';
import { Home, Heart, BookOpen, MessagesSquare, ShoppingBag } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F48FB1', // primary color
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Conexões',
          tabBarIcon: ({ color }) => <Heart color={color} />,
        }}
      />
      <Tabs.Screen
        name="jornada"
        options={{
          title: 'Jornada',
          tabBarIcon: ({ color }) => <BookOpen color={color} />,
        }}
      />
        <Tabs.Screen
        name="forum"
        options={{
          title: 'Comunidade',
          tabBarIcon: ({ color }) => <MessagesSquare color={color} />,
        }}
      />
       <Tabs.Screen
        name="loja"
        options={{
          title: 'Loja',
          tabBarIcon: ({ color }) => <ShoppingBag color={color} />,
        }}
      />
    </Tabs>
  );
}