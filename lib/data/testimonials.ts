import { media } from "@/lib/data/media"
import type { Testimonial } from "@/types"

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Elif Y.", avatar: media.testimonial1, rating: 5, quoteKey: "quote1" },
  { id: "t2", name: "Melis A.", avatar: media.testimonial2, rating: 5, quoteKey: "quote2" },
  { id: "t3", name: "Deniz K.", avatar: media.testimonial3, rating: 5, quoteKey: "quote3" },
]
