import { useState } from 'react'

const FallbackImage = ({
  primaryImage,
  fallbackImage,
  alt,
  className,
}: {
  primaryImage: string
  fallbackImage: string
  alt: string
  className?: string
}) => {
  const [imgSrc, setImgSrc] = useState(primaryImage)

  const handleError = () => {
    console.log('Error loading image')
    setImgSrc(fallbackImage)
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
    />
  )
}

export default FallbackImage
