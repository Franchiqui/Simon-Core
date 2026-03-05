'use client';

import { type AuthStatusPaths } from '@/components/auth/auth-status';

export interface AuthConfig {
  /** Rutas de autenticación utilizadas en toda la aplicación */
  paths: AuthStatusPaths;
  /** Configuración de sesión */
  session: {
    /** Tiempo máximo de sesión en segundos (por defecto 7 días) */
    maxAge: number;
    /** Actualizar sesión automáticamente */
    updateAge: number;
  };
  /** Configuración de proveedores OAuth */
  providers: {
    google?: {
      clientId: string;
      clientSecret: string;
    };
    github?: {
      clientId: string;
      clientSecret: string;
    };
  };
  /** Configuración de seguridad */
  security: {
    /** Requerir verificación de email */
    requireEmailVerification: boolean;
    /** Permitir registro sin invitación */
    allowPublicRegistration: boolean;
  };
}

/**
 * Rutas de autenticación por defecto
 * Estas rutas son utilizadas por el componente AuthStatus y otros componentes de autenticación
 */
export const authPaths: AuthStatusPaths = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
  logout: '/api/auth/logout',
  callback: '/api/auth/callback',
};

/**
 * Configuración de autenticación por defecto
 * Puede ser extendida o sobrescrita según las necesidades del proyecto
 */
export const defaultAuthConfig: AuthConfig = {
  paths: authPaths,
  session: {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // Actualizar cada 24 horas
  },
  providers: {
    google: process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? {
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }
      : undefined,
    github: process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? {
          clientId: process.env.AUTH_GITHUB_ID,
          clientSecret: process.env.AUTH_GITHUB_SECRET,
        }
      : undefined,
  },
  security: {
    requireEmailVerification: process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === 'true',
    allowPublicRegistration: process.env.NEXT_PUBLIC_ALLOW_PUBLIC_REGISTRATION !== 'false',
  },
};

/**
 * Hook para obtener la configuración de autenticación
 * Útil para componentes que necesitan acceder a la configuración
 */
export function useAuthConfig(): AuthConfig {
  return defaultAuthConfig;
}

/**
 * Verifica si una ruta es una ruta de autenticación
 * @param pathname - Ruta a verificar
 * @returns true si es una ruta de autenticación
 */
export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth') || 
         pathname === authPaths.login || 
         pathname === authPaths.register;
}

/**
 * Verifica si una ruta requiere autenticación
 * @param pathname - Ruta a verificar
 * @returns true si la ruta requiere autenticación
 */
export function requiresAuth(pathname: string): boolean {
  const publicRoutes = [
    authPaths.home,
    authPaths.login,
    authPaths.register,
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];
  
  return !publicRoutes.includes(pathname) && 
         !pathname.startsWith('/api/') && 
         !pathname.startsWith('/_next/');
}

/**
 * Obtiene la URL de redirección después del login
 * @param redirectTo - URL a la que redirigir (opcional)
 * @returns URL de redirección
 */
export function getLoginRedirectUrl(redirectTo?: string): string {
  if (redirectTo && !redirectTo.startsWith('/auth')) {
    return `${authPaths.login}?callbackUrl=${encodeURIComponent(redirectTo)}`;
  }
  return authPaths.login;
}

/**
 * Obtiene la URL de redirección después del logout
 * @returns URL de redirección
 */
export function getLogoutRedirectUrl(): string {
  return `${authPaths.logout}?callbackUrl=${encodeURIComponent(authPaths.home)}`;
}

/**
 * Verifica si un proveedor OAuth está configurado
 * @param provider - Nombre del proveedor ('google' | 'github')
 * @returns true si el proveedor está configurado
 */
export function isProviderEnabled(provider: 'google' | 'github'): boolean {
  return !!defaultAuthConfig.providers[provider]?.clientId && 
         !!defaultAuthConfig.providers[provider]?.clientSecret;
}

/**
 * Obtiene la lista de proveedores OAuth habilitados
 * @returns Array con los nombres de los proveedores habilitados
 */
export function getEnabledProviders(): Array<'google' | 'github'> {
  const providers: Array<'google' | 'github'> = [];
  if (isProviderEnabled('google')) providers.push('google');
  if (isProviderEnabled('github')) providers.push('github');
  return providers;
}

export default defaultAuthConfig;
