import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'sm',
  showValue = false,
  count
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const stars = [];
  const fullStars = Math.floor(rating);
  const partialFill = rating - fullStars;

  for (let i = 0; i < maxRating; i++) {
    const isFilled = i < fullStars;
    const isPartial = i === fullStars && partialFill > 0;
    
    stars.push(
      <span key={i} className="relative inline-block">
        {/* Background star (empty) */}
        <Star 
          className={cn(
            sizeClasses[size],
            'text-muted-foreground/30'
          )} 
        />
        {/* Foreground star (filled) */}
        {(isFilled || isPartial) && (
          <span 
            className="absolute inset-0 overflow-hidden"
            style={{ width: isPartial ? `${partialFill * 100}%` : '100%' }}
          >
            <Star 
              className={cn(
                sizeClasses[size],
                'text-amber-500 fill-amber-500'
              )} 
            />
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">
          ({count})
        </span>
      )}
    </div>
  );
}
