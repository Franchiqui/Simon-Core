'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { authPaths } from '@/lib/auth-config';
import { LogOut, User, Settings, Home } from 'lucide-react';

export interface AuthStatusPaths {
  login: string;
  register: string;
  home: string;
  profile: string;
  settings: string;
}

export interface AuthStatusProps {
  /** Rutas personalizadas para los enlaces de autenticación */
  paths?: Partial<AuthStatusPaths>;
}

export default function AuthStatus({ paths }: AuthStatusProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  // Combinar rutas personalizadas con las predeterminadas
  const resolvedPaths: AuthStatusPaths = {
    ...authPaths,
    ...paths,
  };

  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!session) {
    const isLoginPage = pathname === resolvedPaths.login;
    const isRegisterPage = pathname === resolvedPaths.register;

    return (
      <div className="flex items-center gap-2">
        {!isLoginPage && (
          <Button asChild variant="ghost" size="sm">
            <Link href={resolvedPaths.login}>
              Iniciar sesión
            </Link>
          </Button>
        )}
        {!isRegisterPage && (
          <Button asChild size="sm">
            <Link href={resolvedPaths.register}>
              Registrarse
            </Link>
          </Button>
        )}
      </div>
    );
  }

  // Usuario autenticado
  const user = session.user;
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || ''} alt={user?.name || 'Usuario'} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={resolvedPaths.home} className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              <span>Inicio</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={resolvedPaths.profile} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={resolvedPaths.settings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
            onClick={() => signOut({ callbackUrl: resolvedPaths.home })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
