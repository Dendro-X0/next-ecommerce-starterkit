"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, ChevronLeft, ChevronRight, Github, Star } from "lucide-react"
import { animate, motion, useMotionValue } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const heroSlides = [
  {
    id: 1,
    title: "Next.js Ecommerce Starterkit",
    subtitle: "Ship faster with best practices",
    description:
      "Production-ready starterkit powered by Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui. Accessible UI, modern DX, and batteries‑included auth, payments, and admin.",
    image: "/shop1.png",
    cta: {
      primary: { text: "Star on GitHub", href: "https://github.com/your-repo", icon: Github },
      secondary: { text: "Explore the demo", href: "/shop" },
    },
    stats: [
      { label: "Components", value: "100+" },
      { label: "Pages", value: "25+" },
      { label: "TypeScript", value: "100%" },
    ],
    badge: "Open Source",
  },
  {
    id: 2,
    title: "Modern stack, real features",
    subtitle: "Performance, a11y, and DX",
    description:
      "SSR/ISR, routing, forms, state, and UI primitives that scale. Payments, auth, and an admin dashboard included so you can focus on your product.",
    image: "/admin_dashboard1.png",
    cta: {
      primary: { text: "See features", href: "/features" },
      secondary: { text: "Read docs", href: "/docs" },
    },
    stats: [
      { label: "Core Patterns", value: "20+" },
      { label: "Charts & Tables", value: "10+" },
      { label: "Tested Flows", value: "Stripe & PayPal" },
    ],
    badge: "Production Ready",
  },
  {
    id: 3,
    title: "Learn or launch today",
    subtitle: "Educational & commercial use",
    description:
      "Great for learning modern web fundamentals or shipping a v1. Clean code, clear structure, and practical examples throughout.",
    image: "/user_dashboard1.png",
    cta: {
      primary: { text: "Get started", href: "/getting-started" },
      secondary: { text: "View examples", href: "/examples" },
    },
    stats: [
      { label: "Learning Hours", value: "40+" },
      { label: "Tutorials", value: "15+" },
      { label: "Use Cases", value: "10+" },
    ],
    badge: "Educational",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const DRAG_THRESHOLD_PX: number = 80
  const x = useMotionValue(0)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative w-full h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image || "/placeholder.svg"}
          alt={currentSlideData.title}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Content (draggable) */}
      <motion.div
        className="relative z-10 container mx-auto px-4 h-full flex items-center"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        onDragEnd={(_, info): void => {
          const offset: number = info.offset.x
          if (offset < -DRAG_THRESHOLD_PX) {
            nextSlide()
          } else if (offset > DRAG_THRESHOLD_PX) {
            prevSlide()
          }
          animate(x, 0, { type: "spring", bounce: 0, duration: 0.35 })
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <Badge variant="outline" className="text-sm">
                {currentSlideData.badge}
              </Badge>

              <div className="space-y-2">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-xl lg:text-2xl text-primary font-semibold">
                  {currentSlideData.subtitle}
                </h2>
              </div>

              <p className="text-lg text-muted-foreground max-w-2xl">
                {currentSlideData.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href={currentSlideData.cta.primary.href}>
                  {currentSlideData.cta.primary.icon && (
                    <currentSlideData.cta.primary.icon className="mr-2 h-5 w-5" />
                  )}
                  {currentSlideData.cta.primary.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={currentSlideData.cta.secondary.href}>
                  {currentSlideData.cta.secondary.text}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 pt-8">
              {currentSlideData.stats.map((stat) => (
                <div key={`${stat.label}-${stat.value}`} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl bg-muted border flex items-center justify-center">
              <Image
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card border rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <div className="text-sm font-medium">Open Source</div>
              </div>
              <div className="text-xs text-muted-foreground">MIT License</div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-card border rounded-lg p-4 shadow-lg">
              <div className="text-sm font-medium">Production Ready</div>
              <div className="text-xs text-muted-foreground">Deploy anywhere</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentSlide === index
                ? "bg-primary scale-125"
                : "bg-background/50 hover:bg-background/70",
            )}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs bg-background/80 backdrop-blur"
        >
          {isAutoPlaying ? "Pause" : "Play"}
        </Button>
      </div>
    </section>
  )
}
