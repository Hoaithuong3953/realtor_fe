import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PropertyCard, PropertyCardSkeleton, type PropertyCardProps } from "./property-card"

type PropertyCarouselProps = {
  items?: PropertyCardProps[]
  isLoading?: boolean
}

export const PropertyCarousel = ({ items = [], isLoading }: PropertyCarouselProps) => {
  if (!isLoading && items.length === 0) return null

  return (
    <div className="w-full relative px-6 sm:px-12">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                  <PropertyCardSkeleton />
                </CarouselItem>
              ))
            : items.map((item) => (
                <CarouselItem key={item.id} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                  <PropertyCard {...item} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="-left-10" />
          <CarouselNext className="-right-10" />
        </div>
      </Carousel>
    </div>
  )
}
