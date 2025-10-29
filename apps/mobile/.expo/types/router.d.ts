/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/forum` | `/(tabs)/home` | `/(tabs)/jornada` | `/(tabs)/loja` | `/(tabs)/matches` | `/_sitemap` | `/forum` | `/home` | `/jornada` | `/loja` | `/matches`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
