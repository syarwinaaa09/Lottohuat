import React from 'react'
import NavButton from './NavButton'
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid"
import { useAddress, useDisconnect } from '@thirdweb-dev/react'

function Header() {
    const address = useAddress();
    const disconnect = useDisconnect();
  return (
    <header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
        <div className="flex items-center space-x-2">
            <img className="rounded-full h-20 w-20" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ef3844e-3d1b-4ffc-adea-5837fa8253ff/ddxxqhc-95490851-4d55-4e66-963b-e6c4a61a2d95.png/v1/fill/w_894,h_894,strp/monika_selfie_by_quartizermc_ddxxqhc-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzFlZjM4NDRlLTNkMWItNGZmYy1hZGVhLTU4MzdmYTgyNTNmZlwvZGR4eHFoYy05NTQ5MDg1MS00ZDU1LTRlNjYtOTYzYi1lNmM0YTYxYTJkOTUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.u8ioVbUmFJVq2ApDMYFplNhuWeJ12bMwko2Po3KROn8" alt=""/>
            <div>
                <h1 className="text-lg text-white font-bold">LOTTOHUAT</h1>
                <p className="text-xs text-emerald-500 truncate">User: {address?.substring(0,5)}...{address?.substring(address.length, address.length-5)}</p>
            </div>
        </div>

        <div className="hidden md:flex md:col-span-3 items-center justify-center rounded-md">
            <div className="bg-[#0A1F1C] p-4 space-x-2">
                <NavButton isActive title="Buy Tickets"/>
                <NavButton onClick={disconnect} title="Logout"/>
            </div>
        </div>

        <div className="flex flex-col ml-auto text-right">
            <Bars3BottomRightIcon className="h-8 w-8 mx-auto text-white cursor-pointer"/>
            <span className="md:hidden">
                <NavButton onClick={disconnect} title="Logout" />
            </span>
        </div>

        
    </header>
  )
}

export default Header