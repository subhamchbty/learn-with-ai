'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TokenUsage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Card className="mt-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
                <CardDescription className="text-xs">AI API consumption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today:</span>
                    <span className="font-medium">{user.dailyTokensUsed?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{user.totalTokensUsed?.toLocaleString() || 0}</span>
                </div>
            </CardContent>
        </Card>
    );
}
