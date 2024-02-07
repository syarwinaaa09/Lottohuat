import { useMetamask } from '@thirdweb-dev/react';
import React from 'react'

function Login() {
    const connectWithMetamask = useMetamask();
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center mb-10">
            <img className="rounded-full h-56 w-56 mb-10"src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ef3844e-3d1b-4ffc-adea-5837fa8253ff/ddxxqhc-95490851-4d55-4e66-963b-e6c4a61a2d95.png/v1/fill/w_894,h_894,strp/monika_selfie_by_quartizermc_ddxxqhc-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzFlZjM4NDRlLTNkMWItNGZmYy1hZGVhLTU4MzdmYTgyNTNmZlwvZGR4eHFoYy05NTQ5MDg1MS00ZDU1LTRlNjYtOTYzYi1lNmM0YTYxYTJkOTUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.u8ioVbUmFJVq2ApDMYFplNhuWeJ12bMwko2Po3KROn8" />
        </div>
        <h1 className="text-6xl text-white font-bold">LOTTOHUAT</h1>
        <h2 className="text-white">Get Started By logging in with your MetaMask</h2>
        <button onClick={connectWithMetamask} className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold text-black">Login with Metamask</button>
    </div>
  )
}

export default Login