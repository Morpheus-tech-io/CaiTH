// app/treasures/my-placements/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TreasureList } from '@/components/treasures/treasure_list';
import { useTreasures } from '@/hooks/use-treasure';
import { useToast } from '@/components/ui/toaster';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/hooks/use-user';

export default function MyPlacementsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { userPlacements, isLoading, error, deleteTreasure } = useTreasures();
  const { profile } = useUserProfile({ enabled: !!session?.user?.email });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
    }
  }, [session, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div>Error loading treasures</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTreasure.mutateAsync(id);
      toast({ title: 'Success', description: 'Treasure deleted successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete treasure',
        variant: 'destructive',
      });
    }
  };

  // 确保所有 treasures 都设置了正确的 creator_id
  const treasuresWithCreator = userPlacements?.map(treasure => ({
    ...treasure,
    creator_id: profile?.id // 确保 creator_id 与当前用户 ID 匹配
  })) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Created Treasures</h1>
        <Button onClick={() => router.push('create')}>
          Create New Treasure
        </Button>
      </div>

      <TreasureList
        treasures={treasuresWithCreator}
        onDelete={handleDelete}
        showActions={true}
      />
    </div>
  );
}