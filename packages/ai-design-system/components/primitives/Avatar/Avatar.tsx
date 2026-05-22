"use client";

import * as React from "react";
import {
  Avatar as ShadcnAvatar,
  AvatarImage as ShadcnAvatarImage,
  AvatarFallback as ShadcnAvatarFallback,
} from "@/components/ui/avatar";

/**
 * Avatar Primitive
 *
 * An image element with a fallback for representing a user or entity.
 *
 * Features:
 * - Automatic image loading with fallback
 * - Circular or custom shape support
 * - Size customization via className
 * - Lazy loading support
 * - WCAG 2.1 Level AA compliant
 */

export type AvatarProps = React.ComponentProps<typeof ShadcnAvatar>;
export type AvatarImageProps = React.ComponentProps<typeof ShadcnAvatarImage>;
export type AvatarFallbackProps = React.ComponentProps<typeof ShadcnAvatarFallback>;

/**
 * Avatar - Root container for the avatar component
 */
export const Avatar = React.memo<AvatarProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnAvatar>, AvatarProps>(
    (props, ref) => {
      return <ShadcnAvatar ref={ref} {...props} />;
    }
  )
);
Avatar.displayName = "Avatar";

/**
 * AvatarImage - The image element
 * Falls back to AvatarFallback if image fails to load
 */
export const AvatarImage = React.memo<AvatarImageProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnAvatarImage>, AvatarImageProps>(
    (props, ref) => {
      return <ShadcnAvatarImage ref={ref} {...props} />;
    }
  )
);
AvatarImage.displayName = "AvatarImage";

/**
 * AvatarFallback - Fallback content when image is unavailable
 * Typically displays initials or an icon
 */
export const AvatarFallback = React.memo<AvatarFallbackProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnAvatarFallback>, AvatarFallbackProps>(
    (props, ref) => {
      return <ShadcnAvatarFallback ref={ref} {...props} />;
    }
  )
);
AvatarFallback.displayName = "AvatarFallback";
