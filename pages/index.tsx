import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import { 
  useContract,
  useMetamask,
  useDisconnect,
  useAddress,
  useContractRead,
  useContractWrite
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { currency } from "@/constants";
import CountdownTimer from "@/components/CountdownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee"
import AdminControls from "@/components/AdminControls";

export default function Home() {
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)

  const { data: expiration } = useContractRead(
    contract,
    "expiration"
  )
  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  )
  const { data: currentWinningReward } = useContractRead(
    contract,
    "CurrentWinningReward"
  )

  const { data: ticketPrice } = useContractRead(
    contract,
    "ticketPrice"
  )

  const { data: ticketCommission } = useContractRead(
    contract,
    "ticketCommission"
  )

  const { data: tickets } = useContractRead(contract, "getTickets");

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")

  const { data: winnings } = useContractRead(
    contract,
    "getWinningsForAddress",
    [address]
  )
  const { mutateAsync: WithdrawWinnings } = useContractWrite(
    contract, 
    "WithdrawWinnings"
  )

  const { data: lastWinner} = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount")

  const { data: isLotteryOperator } = useContractRead(
    contract,
    "lotteryOperator"
  )
  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0)

      setUserTickets(noOfUserTickets)
  }, [tickets, address]);

  const handleClick = async () => {
    if (!ticketPrice) return
    const notification = toast.loading("Buying your tickets... 🎫")
    try {
      const data = await BuyTickets({
          overrides: {
            value: ethers.utils.parseEther(
              (
                Number(ethers.utils.formatEther(ticketPrice)) * quantity
              ).toString(),
            )
          }}
      )
      toast.success("Ticket purchased!", { id: notification })
      console.log("Contract call success.")

    } catch (error) {
      toast.error("Error purchasing ticket", { id: notification })
      console.log("Contract call failed.", error)
    }
  }

  const onWithdrawWinnings = async() => {
    const notification = toast.loading("Withdrawing winnings...")

    try {
      const data = await WithdrawWinnings([{}]);

      toast.success("Winnings withdrawn successfully!", {
        id: notification,
      })
    } catch(err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });

      console.error("contract call failure", err)
    }
  }

  if (isLoading) return <Loading />
  if (!address) return <Login />
  
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>LottoHuat</title>
      </Head>

  <div className="flex-1">
          <Header />
          <Marquee className="bg-[#0A1F1C]" gradient={false} speed={100}>
            <div className="flex space-x-2 mx-10">
              <h4 className="text-white font-bold">Last winner: {lastWinner?.toString()}</h4>
              <h4 className="text-white font-bold">Previous winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "} {currency}</h4>
            </div>

          </Marquee>

          {isLotteryOperator === address && (
            <div className="flex justify-center">
              <AdminControls />
            </div>
          )}

          {winnings > 0 && (
            <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
              <button onClick={onWithdrawWinnings} className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full">
                <p className="font-bold">Winner Winner Chicken Dinner</p>
                <p>Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}
                {currency}</p>
                <br />
                <p className="font-semibold">Click here to withdraw</p>
              </button>
              </div>
          )}

    {/* The Next Draw Box */}
    <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
      <div className="stats-container max-w-6xl">
        <h1 className="text-5xl text-white font-semibold text-center">
          The Next Draw
        </h1>
          <div className="flex justify-between p-2 space-x-2">
            <div className="stats">
              <h2 className="text-sm">Total Pool</h2>
              <p className="text-xl">{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())}{" "} {currency}</p>
          </div>
          <div className="stats">
            <h2 className="text-sm">Tickets Remaining</h2>
            <p className='text-xl'>{remainingTickets?.toNumber()}</p>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="mt-5 mb-3">
            <CountdownTimer />
        </div>
      </div>

      <div className="stats-container space-y-2">
        <div className="stats-container">
          <div className="flex justify-between items-center text-white pb-2">
            <h2 className="">Price per ticket</h2>
            <p>
              {ticketPrice && 
                ethers.utils.formatEther(ticketPrice?.toString())}{" "}{currency}
            </p>
          </div>

          <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4"> 
            <p>TICKETS</p>
            <input className="flex w-full bg-transparent text-right outline-none"type="number" min={1} max={10} value={quantity} onChange={e => setQuantity(Number(e.target.value))}/>
          </div>

          <div className="space-y-2 mt-5">
            <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
              <p>Total Cost of tickets</p>
              <p>{ticketPrice && 
                    Number(
                      ethers.utils.formatEther(ticketPrice.toString())
                    ) * quantity}{" "}
                    {currency}
              </p>
            </div>
            <div className="flex items-center justify-between text-emerald-300 text-xs italic">
              <p>Service fees</p>
              <p>{ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())}{" "}{currency}</p>
            </div>
            <div className="flex items-center justify-between text-emerald-300 text-xs italic">
              <p>+ Network Fees</p>
              <p>TBC</p>
            </div>
          </div>
          <button disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0} onClick={handleClick} className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md font-semibold text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-600 disabled:cursor-not-allowed">Buy {quantity} tickets for {ticketPrice &&Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}{" "}</button>
        </div>
        {userTickets > 0 && <div className="stats">
          <p className="text-lg mb-2">you have {userTickets} Tickets in this draw</p>
          <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
            {Array(userTickets).fill("").map((_, index) => (
              <p key={index} className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic">{index + 1}</p>
            ))}
            </div>
            </div>
        }
      </div>
    </div>

    <div>

    </div>
      </div>
      <footer className="border-t border-emerald-500/20 flex items-center text-white justify-between p-5">
        <img className="h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ef3844e-3d1b-4ffc-adea-5837fa8253ff/ddxxqhc-95490851-4d55-4e66-963b-e6c4a61a2d95.png/v1/fill/w_894,h_894,strp/monika_selfie_by_quartizermc_ddxxqhc-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzFlZjM4NDRlLTNkMWItNGZmYy1hZGVhLTU4MzdmYTgyNTNmZlwvZGR4eHFoYy05NTQ5MDg1MS00ZDU1LTRlNjYtOTYzYi1lNmM0YTYxYTJkOTUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.u8ioVbUmFJVq2ApDMYFplNhuWeJ12bMwko2Po3KROn8" alt="" />
        <p className="text-xs text-emerald-900 pl-5">
          DISCLAIMER: This build is made for informational and educational purposes only. 
          The content of this build is not intended to be a lure to gambling.
          Instead, the information presented is meant nothing more than learning and entertainment purposes.
          I am not liable for any losses that are incurred or problems that arise at online casinos or elsewhere after the reading and consideration of this build's content.
          If you are gambling online utilizing information from this build, you are doing so completely and totally at your own risk.
        </p>
      </footer>
    </div>
  );
}
