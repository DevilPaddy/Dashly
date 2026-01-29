'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { GoogleLoginButton } from '../components/authBtn/LoginBtn'

export default function Page() {
  return (
    <section className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center text-white">

      {/* Animation */}
      <div className="w-full hidden md:w-3/5 h-[60vh] md:h-screen md:flex items-center justify-center overflow-hidden">
        <DotLottieReact
          src="https://lottie.host/d9acab39-23b1-469f-bfd2-37b4c4748879/6PmYDR30Gy.lottie"
          loop
          autoplay
          className="w-full h-full scale-110"
        />
      </div>

      {/* Login */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 
                        bg-white/5 backdrop-blur-xl 
                        px-8 py-10 shadow-xl">

          <h2 className="text-2xl font-semibold mb-2">
            Welcome back
          </h2>

          <p className="text-sm text-white/60 mb-8">
            Sign in to continue
          </p>

          <GoogleLoginButton />
        </div>
      </div>

    </section>
  )
}
