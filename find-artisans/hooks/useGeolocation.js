'use client'

import { useCallback, useState } from 'react'
import API from '../app/axios'

// =========================================
// GEOLOCATION HOOK
// =========================================
const useGeolocation = () => {
  // ======================================
  // STATE
  // ======================================

  const [location, setLocation] = useState(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')


  // ======================================
  // GET + PERSIST CURRENT GPS LOCATION
  // ======================================

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {

      // ======================================
      // CHECK BROWSER SUPPORT
      // ======================================

      if (!navigator.geolocation) {
        const message =
          'Geolocation is not supported by this browser'

        setError(message)

        reject(new Error(message))

        return
      }


      // ======================================
      // START LOADING
      // ======================================

      setLoading(true)

      setError('')


      // ======================================
      // GET GPS LOCATION
      // ======================================

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          try {

            const latitude =
              position.coords.latitude

            const longitude =
              position.coords.longitude


            // ======================================
            // UPDATE LOCAL STATE
            // ======================================

            const coordinates = {
              latitude,
              longitude,
            }

            setLocation(coordinates)


            // ======================================
            // PERSIST TO BACKEND
            // ======================================

            const response =
              await API.patch(
                '/users/location',
                {
                  latitude,
                  longitude,
                }
              )


            // ======================================
            // CHECK BACKEND RESPONSE
            // ======================================

            if (!response?.data?.success) {

              throw new Error(
                response?.data?.message ||
                'Failed to save location'
              )

            }


            // ======================================
            // DEBUG
            // ======================================

            console.log(
              'Worker location persisted:',
              response.data.coordinates
            )


            // ======================================
            // FINISH
            // ======================================

            setLoading(false)


            resolve(coordinates)

          } catch (error) {

            console.error(
              'Location persistence error:',
              error
            )


            const message =
              error?.response?.data?.message ||
              error?.message ||
              'Failed to save your location'


            setError(message)

            setLoading(false)

            reject(
              new Error(message)
            )

          }

        },


        // ======================================
        // BROWSER GEOLOCATION ERROR
        // ======================================

        (error) => {

          let message =
            'Unable to get your location'


          if (
            error.code ===
            error.PERMISSION_DENIED
          ) {

            message =
              'Location permission was denied. Please allow location access.'

          }


          if (
            error.code ===
            error.POSITION_UNAVAILABLE
          ) {

            message =
              'Your current location could not be determined.'

          }


          if (
            error.code ===
            error.TIMEOUT
          ) {

            message =
              'Location request timed out. Please try again.'

          }


          console.error(
            'Geolocation error:',
            error
          )


          setError(message)

          setLoading(false)

          reject(
            new Error(message)
          )

        },


        // ======================================
        // GEOLOCATION OPTIONS
        // ======================================

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }

      )

    })
  }, [])


  // =========================================
  // GET LOCATION
  // =========================================

  const getLocation = useCallback(() => {

    getCurrentLocation()

      .catch((error) => {

        console.error(
          'Get location error:',
          error
        )

      })

  }, [
    getCurrentLocation,
  ])


  // =========================================
  // RETURN HOOK API
  // =========================================

  return {
    location,
    loading,
    error,
    getLocation,
    getCurrentLocation,
  }
}


// =========================================
// DEFAULT EXPORT
// =========================================

export default useGeolocation