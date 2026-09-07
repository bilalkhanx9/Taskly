import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowRight, Layers, Palette, Zap, CheckCircle2, Code2, Shield, Laptop } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Next<span className="text-primary font-black">.js</span> + shadcn</span>
            <Badge variant="secondary" className="ml-2 font-mono text-xs">v16 + Tailwind v4</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://ui.shadcn.com" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              shadcn/ui
            </Link>
            <Link href="https://nextjs.org/docs" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Next.js Docs
            </Link>
            <Link href="https://github.com/bilalkhanx9/LMS" target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", className: "gap-2 shadow-sm" })}>
              <Code2 className="h-4 w-4" /> GitHub
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col items-center gap-16">
        <div className="flex flex-col items-center text-center max-w-3xl gap-6 pt-8">
          <Badge variant="outline" className="px-3.5 py-1 text-sm rounded-full gap-2 border-primary/20 bg-primary/5 text-primary">
            <Zap className="h-3.5 w-3.5 fill-primary" /> Ready to Build Modern Web Apps
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Supercharged with <span className="bg-gradient-to-r from-primary via-zinc-700 to-zinc-400 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">Next.js</span> & <span className="underline decoration-primary underline-offset-8">shadcn/ui</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Your Next.js project is fully set up with Tailwind CSS v4, TypeScript, App Router, and accessible shadcn/ui components.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="lg" className="gap-2 shadow-md">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Layers className="h-4 w-4" /> Explore Components
            </Button>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/60 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle>Next.js 16 App Router</CardTitle>
              <CardDescription>Server components, high-speed routing, and optimized React 19 architecture.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> React 19 & React Server Components</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Turbopack enabled dev workflow</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> TypeScript by default</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Palette className="h-5 w-5" />
              </div>
              <CardTitle>Tailwind CSS v4</CardTitle>
              <CardDescription>Modern utility-first styling with high performance CSS variables theming.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> First-class OKLCH color palettes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Dark mode support built-in</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Lightning fast build times</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle>shadcn/ui Components</CardTitle>
              <CardDescription>Accessible, customizable, and beautifully designed copy-paste components.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Radix / Base UI primitive engines</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Fully responsive & accessible</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Lucide icons integrated</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Component Preview Tabs */}
        <div className="w-full max-w-4xl">
          <Tabs defaultValue="preview" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">Interactive Preview</h2>
              <TabsList>
                <TabsTrigger value="preview">Interactive UI</TabsTrigger>
                <TabsTrigger value="quickstart">Quick Commands</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Try Out UI Controls</CardTitle>
                  <CardDescription>Test out pre-installed shadcn/ui components below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quick Search / Input</label>
                      <div className="flex gap-2">
                        <Input placeholder="Type something..." />
                        <Button>Search</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Badges & Status</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/40 border-t border-border/40 py-3 flex justify-between text-xs text-muted-foreground">
                  <span>Components located at: <code className="font-mono text-foreground font-semibold">src/components/ui/</code></span>
                  <span>Add more with <code className="font-mono text-foreground font-semibold">npx shadcn add [name]</code></span>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="quickstart">
              <Card>
                <CardHeader>
                  <CardTitle>Useful Commands</CardTitle>
                  <CardDescription>Run these commands to add more components or run your project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 font-mono text-sm">
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <code>npm run dev</code>
                    <span className="text-xs text-muted-foreground font-sans">Start development server (http://localhost:3000)</span>
                  </div>
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <code>npx shadcn add [component-name]</code>
                    <span className="text-xs text-muted-foreground font-sans">Add any shadcn component</span>
                  </div>
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <code>npm run build</code>
                    <span className="text-xs text-muted-foreground font-sans">Build production app</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-background text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Next.js + Tailwind CSS + shadcn/ui Project.</p>
          <div className="flex gap-6">
            <Link href="https://nextjs.org" className="hover:text-foreground transition-colors">Next.js</Link>
            <Link href="https://tailwindcss.com" className="hover:text-foreground transition-colors">Tailwind CSS</Link>
            <Link href="https://ui.shadcn.com" className="hover:text-foreground transition-colors">shadcn/ui</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

