import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useCheckPermissions = (allowedRoles = []) => {
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData || !userData.role) {
      router.push('/'); // Redirige al login si no hay datos
      return;
    }

    if (!allowedRoles.includes(userData.role)) {
      switch (userData.role) {
        case 'admin':
          router.push('/admin/dashboard'); // Solo revisa si esta es la ruta bien, ese es el cambio
          break;
        case 'profesor':
          router.push('/profesor/dashboard');
          break;
        default:
          router.push('/');
          break;
      }
    }
  }, [router, allowedRoles]);
};

export default useCheckPermissions;