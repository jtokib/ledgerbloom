import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold font-headline">Settings</h1>
            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Organization</CardTitle>
                        <CardDescription>Manage your organization settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="org-name">Organization Name</Label>
                            <Input id="org-name" defaultValue="Wildflower Co." />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Plan & Billing</CardTitle>
                        <CardDescription>You are currently on the Pro plan. Manage your subscription and view invoices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button>Manage Billing</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
