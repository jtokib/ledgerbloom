import Image from 'next/image';
import { SignUpForm } from '@/components/auth/signup-form';
import { Logo } from '@/components/icons/logo';

export default function SignUpPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Sign Up</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://picsum.photos/1200/1600"
          alt="Warehouse with plants"
          data-ai-hint="warehouse plants"
          width={1200}
          height={1600}
          className="h-full w-full object-cover dark:brightness-[0.3]"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-primary/50 to-primary/80"></div>
        <div className="absolute top-8 left-8 text-primary-foreground flex items-center gap-4">
            <Logo className="h-10 w-10" />
            <h1 className="font-headline text-3xl font-bold">LedgerBloom</h1>
        </div>
        <div className="absolute bottom-8 left-8 right-8">
            <blockquote className="text-primary-foreground/80 text-lg font-body">
            “The art of inventory is to have what you need, where you need it, when you need it. The science is doing it with the lowest possible cost.”
            </blockquote>
        </div>
      </div>
    </div>
  );
}
