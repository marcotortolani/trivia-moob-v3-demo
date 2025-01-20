import { useState } from 'react'

const FallbackImage = ({
  primaryImage,
  fallbackImage,
  alt,
}: {
  primaryImage: string
  fallbackImage: string
  alt: string
}) => {
  const [imgSrc, setImgSrc] = useState(primaryImage)

  const handleError = () => {
    setImgSrc(fallbackImage)
  }

  return <img src={imgSrc} alt={alt} onError={handleError} />
}

export default FallbackImage
