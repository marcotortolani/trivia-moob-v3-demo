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
    console.log('Error loading image')

    setImgSrc(fallbackImage)
  }

  return <img src={imgSrc} alt={alt} onError={handleError} />
}

export default FallbackImage
