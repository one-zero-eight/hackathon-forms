import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users, Lock, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block text-primary">Form Builder</span>
                <span className="block">for Modern Teams</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg lg:mx-0">
                Create, share, and analyze forms with ease. Perfect for surveys,
                questionnaires, and data collection.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg lg:mx-0">
                <div className="space-x-4">
                  <Link href="/forms">
                    <Button size="lg" className="gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/forms/demo">
                    <Button variant="outline" size="lg">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:col-span-6 lg:mt-0">
              <div className="relative">
                <Image
                  src="/form-builder-preview.png"
                  alt="Form Builder Preview"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to create powerful forms
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4">
                Our form builder comes with all the features you need to create
                professional forms and surveys.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={FileText}
                title="Drag & Drop Builder"
                description="Intuitive drag and drop interface to create forms in minutes"
              />
              <Feature
                icon={Users}
                title="Collaboration"
                description="Share forms with your team and work together seamlessly"
              />
              <Feature
                icon={Lock}
                title="Privacy Controls"
                description="Control who can view and submit responses to your forms"
              />
              <Feature
                icon={BarChart}
                title="Analytics"
                description="Get insights from responses with powerful analytics tools"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                  Ready to get started?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                  Join thousands of teams already using our form builder to collect
                  and analyze data.
                </p>
                <div className="mt-8">
                  <Link href="/forms">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 text-primary"
                    >
                      Create Your First Form
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Form Builder. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-lg border bg-background p-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
