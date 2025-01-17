// src/app/(main)/match/detail/page.tsx
"use client";

import { useCurrentMatch } from "@/hooks/use-match";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user";
import MatchDetail from "@/components/match/match-detail";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Timer } from "lucide-react";

export default function MatchDetailPage() {
  const router = useRouter();
  const { profile, isLoading: isLoadingProfile } = useUserProfile();
  const { currentMatchId } = useCurrentMatch();

  // Add debugging logs
  console.log('Detail page rendered', { currentMatchId, profile });

  if (isLoadingProfile) {
    return (
      <div className="container py-8 text-center">
        <Timer className="animate-spin h-8 w-8 mx-auto mb-2" />
        <p>加载中...</p>
      </div>
    );
  }

  // if (!profile) {
  //   return (
  //     <div className="container py-8">
  //       <Alert variant="destructive">
  //         <AlertDescription>请先登录后再访问此页面</AlertDescription>
  //       </Alert>
  //     </div>
  //   );
  // }

  if (!currentMatchId) {
    router.push('/match');
    return null;
  }

  return (
    <div className="container py-8">
      <MatchDetail matchId={currentMatchId} />
    </div>
  );
}